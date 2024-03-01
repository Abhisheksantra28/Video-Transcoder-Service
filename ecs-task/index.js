const axios = require("axios");
const { generateSignedGetUrl, uploadFileToS3 } = require("./utils/s3Helper");
const {
  downloadVideo,
  removeFileExtension,
  runParallelFFmpegCommands,
  checkIfFileExists,
} = require("./utils/videoProcessing");

const marktaskCompleted = async (userId, videoId, allFilesObject) => {
    try {
      const webhook = process.env.WEBHOOK_URL;
      console.log("Webhook URL:", webhook);
      const res = await axios.post(webhook, {
        userID: userId,
        videoId,
        progress: VIDEO_PROCESS_STATES.COMPLETED,
        hostedFiles: allFilesObject,
      });
  
      if (res.status === 200) {
        console.log("Webhook called successfully");
      }
    } catch (error) {
      console.log("Error Axios call:", error);
      process.exit();
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
  console.log("Starting.....");

  const videoToProcess = process.env.VIDEO_NAME;
  const userId = process.env.USER_ID;

  if (!videoToProcess) {
    console.error(
      "Missing environment variable: VIDEO_NAME. Please set the environment variable with the video name you want to process."
    );
    process.exit(1);
  }

  if (!userId) {
    console.error(
      "Missing environment variable: USER_ID. Please set the environment variable with your user ID."
    );
    process.exit(1);
  }

  const bucketName = process.env.TEMP_S3_BUCKET_NAME;
  const key = videoToProcess;
  const url = await generateSignedGetUrl({ key, bucketName });

  if (!url) {
    console.log(
      "Failed to generate pre-signed URL for video. Please check your configuration and network connectivity."
    );
    process.exit(1);
  }

  const outputVideoName = removeFileExtension(videoToProcess);

  await downloadVideo(url, videoToProcess);

  videoFormat.forEach((format) => {
    ffmpegCommands.push(
      `ffmpeg -i ${videoToProcess} -y -acodec aac -vcodec libx264 -filter:v scale=${
        format.scale
      } -f mp4 ${outputVideoName + "-" + format.name}.mp4`
    );

    allFiles.push(`${outputVideoName + "-" + format.name}.mp4`);
  });

  await runParallelFFmpegCommands(ffmpegCommands);

  checkIfFileExists(allFiles);

  const finalBucketName = process.env.FINAL_S3_BUCKET_NAME;

  let uploadPromises = [];
  allFiles.map((file) => {
    uploadPromises.push(uploadFileToS3(file, finalBucketName));
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
      if (file.includes("144p")) {
        allFilesObject["144p"] = file;
      } else if (file.includes("360p")) {
        allFilesObject["360p"] = file;
      } else if (file.includes("480p")) {
        allFilesObject["480p"] = file;
      } else if (file.includes("720p")) {
        allFilesObject["720p"] = file;
      } else if (file.includes("1080p")) {
        allFilesObject["1080p"] = file;
      }
    });




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

    process.exit(1);
  }
})();
