const { handleS3Trigger } = require("../controllers/transcoder.controller.js");
const { Router } = require("express");

const router = Router();

router.post("/s3-trigger", handleS3Trigger);

module.exports = router;
