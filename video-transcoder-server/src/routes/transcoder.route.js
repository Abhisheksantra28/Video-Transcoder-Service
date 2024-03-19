const {
  handleS3Trigger,
  handleECSTrigger,
} = require("../controllers/transcoder.controller.js");
const { Router } = require("express");
const { getAllVideos, getVideoByFileName } = require("../controllers/video.contoller.js");

const router = Router();

router.post("/s3-trigger", handleS3Trigger);
router.post("/ecs-trigger", handleECSTrigger);

router.get("/get-all-videos",  getAllVideos);
router.get("/v/:fileName",  getVideoByFileName);

module.exports = router;
