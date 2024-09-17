const { putObjectURL } = require("../utils/s3SignedUrl.js");

const uploadToTempBucketURL = (req, res) => {
  const { fileName, contentType } = req.params;

  const bucketName = process.env.TEMP_S3_BUCKET_NAME;

  const url = putObjectURL(fileName, contentType, bucketName);

  if (!url) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Error while generating the signed URL"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, url, "Signed URL generated successfully"));
};




module.exports = {
  uploadToTempBucket,
};
