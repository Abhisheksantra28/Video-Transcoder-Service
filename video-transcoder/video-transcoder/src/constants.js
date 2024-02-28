const VIDEO_PROCESS_STATES = {
    PENDING: "pending",
    IN_QUEUE: "queued",
    PROCESSING: "processing",
    COMPLETED: "completed",
    FAILED: "failed",
  };
  
  const REDIS_KEYS = {
    CURRENT_VIDEO_TRANSCODING_JOB_COUNT: "CURRENT_VIDEO_TRANSCODING_JOB_COUNT",
    VIDEO_TRANSCODING_QUEUE: "VIDEO_TRANSCODING_QUEUE",
  };
  
  
  module.exports = {
    VIDEO_PROCESS_STATES,
    REDIS_KEYS,
  };