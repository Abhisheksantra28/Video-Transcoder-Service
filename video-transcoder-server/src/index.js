const serverless = require("serverless-http");
const express = require("express");
const transcoderRoutes = require("./routes/transcoder.route.js");
const userRoutes = require("./routes/user.route.js");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./db/database.js");
const cors = require("cors");
const { connectPassport } = require("./utils/Provider.js");
const session = require("express-session");
const passport = require("passport");

const app = express();

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


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    },
  })
);
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());
app.enable("trust proxy");

connectPassport();


app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.use("/api/v1/video", transcoderRoutes);
app.use("/api/v1/user", userRoutes);

module.exports.handler = serverless(app);
