const serverless = require("serverless-http");
const express = require("express");
const transcoderRoutes = require("./routes/transcoder.route.js");
const userRoutes = require("./routes/user.route.js");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./db/database.js");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error:", error);
      throw error;
    });
  })
  .catch((err) => {
    console.log("MongoDb connection Failed !!", err);
  });



app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/path", (req, res) => {
  return res.status(200).json({
    message: "hello from path!",
  });
});

app.use("/api/v1/video", transcoderRoutes);
app.use("/api/v1/user", userRoutes);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
