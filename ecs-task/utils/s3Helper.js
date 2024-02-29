const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const fs = require("fs");

require("dotenv").config();

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const generateSignedGetUrl = async (payload) => {
  try {
    console.log(
      JSON.stringify(`[GET S3 DOWNLOAD URL SERVICE] ${JSON.stringify(payload)}`)
    );

    const { key, bucketName } = payload;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 * 60 });

    return url;
  } catch (error) {
    console.log(
      JSON.stringify(
        `[GET S3 DOWNLOAD URL SERVICE ERROR] ${JSON.stringify(error)}`
      )
    );
  }
};

async function uploadFileToS3(fileName, bucketName, contentType) {
  try {
    // Read the file contents synchronously (replace with fs.promises.readFile for asynchronous reading)
    const fileData = fs.readFileSync(fileName);

    // Construct the PutObject command with secure credentials and appropriate metadata
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileData,
      ContentType: contentType,
    });

    // Send the command to upload the file
    const uploadResponse = await s3Client.send(command);

    console.log("File uploaded successfully:", uploadResponse.Location);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}




module.exports = { generateSignedGetUrl, uploadFileToS3 };
