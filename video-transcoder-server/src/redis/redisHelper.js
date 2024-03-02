const Redis = require("ioredis");
const { REDIS_KEYS } = require("../constants.js");


const redis = new Redis(process.env.REDIS_URL);

const enqueueJobInQueue = async (job) => {
  return await redis.lpush(
    REDIS_KEYS.VIDEO_TRANSCODING_QUEUE,
    JSON.stringify(job)
  );
};

const deQueueJobFromQueue = async () => {
  const job = await redis.rpop(REDIS_KEYS.VIDEO_TRANSCODING_QUEUE);

  return job ? JSON.parse(job) : null;
};

const getKey = async (key) => {
  return await redis.get(key);
};

const deleteKey = async (key) => {
  return await redis.del(key);
};

const setKey = async (key, value, expire = 0, setIfNotExist = false) => {
  let params = [key, value];
  if (expire) {
    params.push("EX", expire);
  }
  if (setIfNotExist) {
    params.push("NX");
  }

  const response = await redis.sendCommand("SET", params);

  if (response) {
    console.log(key + "set to " + value);
    return true;
  } else return false;
};

const increment = async (key) => {
  const value = await redis.incr(key);
  console.log("Incremented key: ", key, "value: ", value);
  return value;
};

const decrement = async (key) => {
  const value = await redis.decr(key);
  console.log("Incremented key: ", key, "value: ", value);
  return value;
};

const getQueueLength = async () => {
  return await redis.llen(REDIS_KEYS.VIDEO_TRANSCODING_QUEUE);
};


module.exports = {
    enqueueJobInQueue,
    deQueueJobFromQueue,
    getKey,
    deleteKey,
    setKey,
    increment,
    decrement,
    getQueueLength
}