const {
  handleS3Trigger,
  handleECSTrigger,
} = require("../controllers/transcoder.controller.js");
const { Router } = require("express");
const { verifyJWT } = require("../middlewares/auth.middleware.js");

const router = Router();

router.post("/s3-trigger",verifyJWT, handleS3Trigger);
router.post("/ecs-trigger", handleECSTrigger);

module.exports = router;
