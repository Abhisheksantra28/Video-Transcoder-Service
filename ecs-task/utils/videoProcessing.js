const fs = require("fs");
const path = require("path");
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
    // console.log("STDOUT content:", stdout);
    // console.error("STDERR content:", stderr);
  });
  return results;
};



async function checkIfFileExists(allFiles, filePath) {
  console.log("Checking if files exist:");
  for (const file of allFiles) {
    const newfilePath = path.resolve(filePath, file);
    console.log(`Checking for file: ${newfilePath}`); // Added line to log the full path
    if (!fs.existsSync(newfilePath)) {
      throw new Error(`${file} does not exist`);
    }
  }
  console.log("Checking successful");
}

// const downloadVideo = async (url, destination) => {
//   try {
//     const response = await axios({
//       url,
//       method: "GET",
//       responseType: "stream",
//     });

//     const writer = fs.createWriteStream(destination);

//     response.data.pipe(writer);

//     return new Promise((resolve, reject) => {
//       writer.on("finish", resolve);
//       writer.on("error", reject);
//     });
//   } catch (error) {
//     console.log("Error downloading video: " + error.message);
//     process.exit(1);
//   }
// };

const downloadVideo = async (url, destinationPath) => {
  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    const writer = fs.createWriteStream(destinationPath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Error downloading video: " + error.message);
    process.exit(1);
  }
};


module.exports = {
  runParallelFFmpegCommands,
  checkIfFileExists,
  downloadVideo,
};
