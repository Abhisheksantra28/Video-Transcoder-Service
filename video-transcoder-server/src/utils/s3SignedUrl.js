const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const accessKeyId = process.env.MY_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.MY_AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function getObjectURL(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.TEMP_S3_BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command);
  return url;
}

async function putObjectURL(fileName, contentType) {
  const command = new PutObjectCommand({
    Bucket: process.env.TEMP_S3_BUCKET_NAME,
    Key: `uploads/videos/${fileName}`,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 180 });
  return url;
}

module.exports = { getObjectURL, putObjectURL };
