const { asyncHander } = require("../utils/asyncHandler.js");
const axios = require("axios");
require("dotenv").config();


const handleS3Trigger = asyncHander(async (req, res) => {
  console.log("Trigger from S3.....");
  const { s3EventData } = req.body;

  if (!s3EventData) {
    return res.status(400).json({ message: "S3 Event Data not found!" });
  }

  console.log("S3 Event Data", s3EventData);

  return res.status(200).json({ message: "everything is ok" });
});

module.exports = { handleS3Trigger };
