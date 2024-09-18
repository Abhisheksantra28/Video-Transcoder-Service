const { Router } = require("express");
const {
  handleS3Trigger,
  handleECSTrigger,
} = require("../controllers/transcoder.controller.js");
const {
  getAllVideos,
  getVideoByFileName,
  getVideoStatus,
} = require("../controllers/video.contoller.js");
const {
  getFinalBucketvideoURL,
  uploadToTempBucketURL,
} = require("../controllers/s3.controlllers.js");

const router = Router();

router.post("/s3-trigger", handleS3Trigger);
router.post("/ecs-trigger", handleECSTrigger);

router.get("/get-upload-url", uploadToTempBucketURL);
router.get("/get-video-urls", getFinalBucketvideoURL);

router.get("/get-all-videos", getAllVideos);
router.get("/v/:fileName", getVideoByFileName);
router.get("/s/:videoId", getVideoStatus);

module.exports = router;
