const { asyncHander } = require("../utils/asyncHandler.js");
const axios = require("axios");

require("dotenv").config();

const { connectDB } = require("../db/database.js");

const {
  getKey,
  enqueueJobInQueue,
  deQueueJobFromQueue,
  increment,
  decrement,
  getQueueLength,
  setKey,
} = require("../redis/redisHelper.js");

const {
  REDIS_KEYS,
  VIDEO_PROCESS_STATES,
} = require("../constants.js");

const { VIDEO_PROCESS_STATES } = require("../constants.js");
const { triggerTranscodingJob } = require("../utils/ecsTranscodingTrigger.js");
const Video = require("../models/video.model.js");

const handleS3Trigger = asyncHander(async (req, res) => {
  console.log("Trigger from S3.....");
  const { s3EventData } = req.body;

  if (!s3EventData) {
    return res.status(400).json({ message: "S3 Event Data not found!" });
  }

  console.log("S3 Event Data", s3EventData);
  /*
   2024-03-02T11:52:19.234Z	be8e0a39-aeab-4624-bf95-26a6d373cfe6	INFO	Received S3 event with object details: {
     s3SchemaVersion: '1.0',
     configurationId: 'upload-trigger-api',
     bucket: {
       name: 'video-transcoder-temp',
       ownerIdentity: { principalId: 'A1GP8KJ6WPNITN' },
       arn: 'arn:aws:s3:::video-transcoder-temp'
     },
     object: {
       key: 'uploads/videos/VID-20230711-WA0065.mp4',
       size: 2654509,
       eTag: 'a8bbec5f232fa3629ee302bc36def510',
       sequencer: '0065E312F182AD832A'
     }
   }
   */

  const bucketName = s3EventData.bucket.name;
  const key = s3EventData.object.key;

  const currentJobCount = parseInt(
    await getKey(REDIS_KEYS.CURRENT_VIDEO_TRANSCODING_JOB_COUNT)
  );

  // key = 'uploads/videos/VID-20230711-WA0065.mp4';
  const fileName = key.split("/").pop().split(".")[0];

  await connectDB();

  if (currentJobCount < 5) {
    await increment(REDIS_KEYS.CURRENT_VIDEO_TRANSCODING_JOB_COUNT);

    const job = {
      fileName,
      objectKey: key,
      progress: VIDEO_PROCESS_STATES.PROCESSING,
    };

    const transcodingData = await triggerTranscodingJob(job);
    console.log("Triggered transcoding job", transcodingData);

    const video = await Video.create({
      fileName: fileName,
      objectKey: key,
      progress: VIDEO_PROCESS_STATES.PROCESSING,
    });

    if (!video) {
      return res.status(500).json({
        message: "Failed to create video. Please try again later.",
      });
    }

    return res.status(200).json({
      message: "Video transcoding job triggered for " + fileName,
    });
  } else {
    //enqueue the job
    const job = {
      fileName,
      objectKey: key,
      progress: VIDEO_PROCESS_STATES.PENDING,
    };

    await enqueueJobInQueue(job);

    return res.status(200).json({
      message: "Job enqueued successfully for" + fileName,
    });
  }
});

const handleECSTrigger = asyncHander(async (req, res) => {
  console.log("Trigger from ECS.....");
  //webhook
  const { key, progress, videoResolutions } = req.body;

  await connectDB();

  const video = await Video.findOne({ objectKey: key });

  if (!video) {
    return res.status(404).json({ message: "video not found!" });
  }

  if (progress === VIDEO_PROCESS_STATES.COMPLETED) {
    video.progress = VIDEO_PROCESS_STATES.COMPLETED;
    video.videoResolutions = videoResolutions;
    await video.save();
  }

  if (progress === VIDEO_PROCESS_STATES.FAILED) {
    video.progress = VIDEO_PROCESS_STATES.FAILED;
    video.videoResolutions = videoResolutions;
    await video.save();
  }

  await decrement(REDIS_KEYS.CURRENT_VIDEO_TRANSCODING_JOB_COUNT);

  const currentJobCount = parseInt(
    await getKey(REDIS_KEYS.CURRENT_VIDEO_TRANSCODING_JOB_COUNT)
  );

  const queueLength = await getQueueLength();

  if (queueLength === 0) {
    if (currentJobCount > 0) {
      await setKey(REDIS_KEYS.CURRENT_VIDEO_TRANSCODING_JOB_COUNT, 0);
    }

    console.log("Trigger from ECS: Processing queue is empty.");
    return res.status(200).json({
      message: "Trigger from ECS: Queue is empty",
    });
  }

  const availableSlots = 5 - currentJobCount;

  if (availableSlots > 0) {
    for (const i = 0; i < availableSlots; i++) {
      const job = await deQueueJobFromQueue();
      await increment(REDIS_KEYS.CURRENT_VIDEO_TRANSCODING_JOB_COUNT);
      await triggerTranscodingJob(job);

      await Video.findOneAndUpdate(
        { objectKey: job.objectKey },
        {
          $set: { progress: job.progress },
        }
      );

      console.log("Transcoding job triggered successfully for:", job.fileName);
    }

    return res.status(200).json({
      message:
        "Trigger from ECS: " + availableSlots + " jobs triggered successfully",
    });
  }
});

module.exports = { handleS3Trigger, handleECSTrigger };
