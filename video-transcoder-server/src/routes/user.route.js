const { Router } = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  changeCurrentPassword,
  updateAccountDetails,
  refreshAccessToken,
} = require("../controllers/user.controller.js");

const { verifyJWT } = require("../middlewares/auth.middleware.js");

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

// Secured routes
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router.get("/get-user", verifyJWT, getCurrentUser);
router.patch("/update-details", verifyJWT, updateAccountDetails);

module.exports = router;
