const axios = require("axios");
const path = require("path");
const { generateSignedGetUrl, uploadFileToS3 } = require("./utils/s3Helper");
const {
  downloadVideo,
  runParallelFFmpegCommands,
} = require("./utils/videoProcessing");

const { VIDEO_PROCESS_STATES } = require("./utils/constants");

require("dotenv").config();

const markTaskCompleted = async (key, allFilesObjects) => {
  try {
    const webhook = process.env.WEBHOOK_URL;
    console.log("Webhook URL:", webhook);
    const response = await axios.post(webhook, {
      key,
      progress: VIDEO_PROCESS_STATES.COMPLETED,
      videoResolutions: allFilesObjects,
    });

    if (response.status === 200) {
      console.log("Webhook called successfully!");
    }
  } catch (error) {
    console.log("Error while calling webhook:", error);
    process.exit(1);
  }
};

const markTaskFailed = async (key) => {
  try {
    const webhook = process.env.WEBHOOK_URL;
    console.log("Webhook URL:", webhook);
    const response = await axios.post(webhook, {
      key,
      progress: VIDEO_PROCESS_STATES.FAILED,
      videoResolutions: {},
    });

    if (response.status === 200) {
      console.log("Webhook called successfully");
    }
  } catch (error) {
    console.log("Error while calling webhook:", error);
    throw error;
  }
};

let ffmpegCommands = [];
let allFiles = [];

let videoFormat = [
  { name: "360p", scale: "w=480:h=360" },
  { name: "480p", scale: "w=858:h=480" },
  { name: "720p", scale: "w=1280:h=720" },
  { name: "1080p", scale: "w=1920:h=1080" },
];

(async function () {
  try {
    console.log("Starting.....");

    const videoToProcess = process.env.OBJECT_KEY;
    const key = videoToProcess;
    const bucketName = process.env.TEMP_S3_BUCKET_NAME;
    const finalBucketName = process.env.FINAL_S3_BUCKET_NAME;

    if (!videoToProcess) {
      console.error(
        "Missing environment variable: OBJECT_KEY Please set the environment variable with the video name you want to process."
      );
      process.exit(1);
    }

    const url = await generateSignedGetUrl({ key, bucketName });

    if (!url) {
      console.log(
        "Failed to generate pre-signed URL for video. Please check your configuration and network connectivity."
      );
      process.exit(1);
    }

    console.log("getURL: ", url);
    const videoName = key.split("/").pop();
    const outputVideoName = key.split("/").pop().split(".")[0];
    // const outputVideoName = removeFileExtension(videoToProcess);

    console.log("testing....");
    const desiredPath = path.join(__dirname, "downloads"); // Example path construction
    await downloadVideo(url, desiredPath);
    // await downloadVideo(url, videoToProcess);

    videoFormat.forEach((format) => {
      ffmpegCommands.push(
        `ffmpeg -i ${path.join(
          desiredPath,
          videoName
        )} -y -acodec aac -vcodec libx264 -filter:v scale=${
          format.scale
        } -f mp4 ${outputVideoName + "-" + format.name}.mp4`
      );

      allFiles.push(`${outputVideoName + "-" + format.name}.mp4`);
    });

    await runParallelFFmpegCommands(ffmpegCommands);

    console.log(allFiles);

    let uploadPromises = [];
    allFiles.map((file) => {
      uploadPromises.push(
        uploadFileToS3(desiredPath, outputVideoName, file, finalBucketName)
      );
    });

    console.log("Uploading files to S3:");

    if (uploadPromises.length === 0) {
      console.log("No files to upload.");
    } else if (uploadPromises.length === 1) {
      console.log("Uploading 1 file: ", uploadPromises[0]);
    } else {
      console.log(`Uploading ${uploadPromises.length} files:`);
      uploadPromises.forEach((promise, index) => {
        console.log(` - File ${index + 1}: ${promise}`);
      });
    }

    const results = await Promise.allSettled(uploadPromises);

    const allSuccessful = results.every(
      (result) => result.status === "fulfilled"
    );

    if (allSuccessful) {
      console.log("All uploads completed successfully!");

      let allFilesObject = {};

      allFiles.map((file) => {
        if (file.includes("360p")) {
          allFilesObject["360p"] = file;
        } else if (file.includes("480p")) {
          allFilesObject["480p"] = file;
        } else if (file.includes("720p")) {
          allFilesObject["720p"] = file;
        } else if (file.includes("1080p")) {
          allFilesObject["1080p"] = file;
        }
      });

      markTaskCompleted(key, allFilesObject);
    } else {
      const failedResults = results.filter(
        (result) => result.status === "rejected"
      );
      const numFailed = failedResults.length;

      if (numFailed === 1) {
        console.error(`One upload failed:`);
        console.error(failedResults[0].reason);
      } else if (numFailed > 1) {
        console.error(`${numFailed} uploads failed:`);
        failedResults.forEach((result, index) => {
          console.error(` - Upload ${index + 1}: ${result.reason}`);
        });
      } else {
        // This shouldn't happen unless the logic for result statuses is incomplete
        console.error(
          "Unexpected error: Uploads reported failures but results show no rejections."
        );
      }

      markTaskFailed(key);

      process.exit(1);
    }
  } catch (error) {
    console.log("Error:", error);
    process.exit(1);
  }
})();
