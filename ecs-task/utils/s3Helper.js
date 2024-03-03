const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const axios = require("axios");
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
    const fileData = fs.readFileSync(fileName);

    // Construct the PutObject command with secure credentials and appropriate metadata
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: `processed/videos/${fileName}`,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command);
    // Use Axios to upload the file to the pre-signed URL
    const response = await axios.put(url, fileData, {
      headers: {
        "Content-Type": contentType,
      },
    });
    // Send the command to upload the file
    // const uploadResponse = await s3Client.send(command);

    console.log("File uploaded successfully:", response.data);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

module.exports = { generateSignedGetUrl, uploadFileToS3 };
