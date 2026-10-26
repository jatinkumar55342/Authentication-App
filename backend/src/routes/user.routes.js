const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  uploadAvatar,
} = require("../controllers/user.controller");

const authMiddleware = require("../middleware/auth.middleware");
const { validateUpdateProfile } = require("../middleware/validation.middleware");
const uploadAvatarMiddleware = require("../middleware/upload.middleware");

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, validateUpdateProfile, updateProfile);
router.post("/avatar", authMiddleware, uploadAvatarMiddleware, uploadAvatar);

module.exports = router;
