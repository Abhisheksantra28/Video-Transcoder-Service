const Redis = require("ioredis");
const { REDIS_KEYS } = require("../constants.js");

const redis = new Redis(process.env.REDIS_URL)
