const express = require("express");
const passport = require("passport");
const { getCurrentUser, logoutUser } = require("../controllers/user.controller.js");
const { isAuthenticated } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/google-login",
  passport.authenticate("google", {
    scope: ["profile"],
  }),
  (req, res, next) => {
    // Handle successful authentication (e.g., redirect to frontend)
    if (!req.user) {
      return next(new Error("Authentication failed")); // Example error handling
    }
    res.redirect(process.env.FRONTEND_URL);
  }
);

router.get("/current-user", isAuthenticated, getCurrentUser);
router.get("/logout", isAuthenticated, logoutUser);

module.exports = router;
