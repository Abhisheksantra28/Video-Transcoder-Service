const fs = require("fs");
const axios = require("axios");
const { exec } = require("child_process");

const runParallelFFmpegCommands = async (commands) => {
  console.log("Commands to run:", commands);

  const results = [];
  const promises = commands.map((ffmpegCommand, index) => {
    try {
      const { stdout, stderr } = exec(ffmpegCommand);
      results.push({ stdout, stderr });
    } catch (error) {
      console.error(`FFmpeg process failed for command ${index + 1}:`, error);
      process.exit(1); // Indicate abnormal termination with exit code 1
    }
  });

  await Promise.all(promises);

  console.log("All FFmpeg processes completed successfully:");

  results.forEach(({ stdout, stderr }, index) => {
    console.log(`Result for command ${index + 1}:`);
    // Comment out these lines if you don't want to log stdout and stderr
    console.log(`STDOUT: ${stdout}`);
    console.error(`STDERR: ${stderr}`);
  });
  return results;
};

const checkIfFileExists = (fileList) => {
  fileList.forEach((file) => {
    if (!fs.existsSync(file)) {
      throw new Error(`${file} does not exist`);
    }
  });
};

const downloadVideo = async (url, destination) => {
  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    const writer = fs.createWriteStream(destination);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.log("Error downloading video: " + error.message);
    process.exit(1);
  }
};

function removeFileExtension(videoName) {
  const lastDotIndex = videoName.lastIndexOf(".");

  if (lastDotIndex !== -1 && lastDotIndex > 0) {
    return videoName.substring(0, lastDotIndex);
  }

  return videoName;
}

module.exports = {
  runParallelFFmpegCommands,
  checkIfFileExists,
  downloadVideo,
  removeFileExtension,
};
