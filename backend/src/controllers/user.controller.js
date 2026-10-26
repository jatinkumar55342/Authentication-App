const crypto = require("crypto");
const User = require("../model/user.model");
const imagekit = require("../config/imagekit");
const { sendVerificationEmail } = require("../services/email.service");

const formatUser = (u) => ({
  id: u._id,
  username: u.username,
  email: u.email,
  avatar: u.avatar,
  isVerified: u.isVerified,
  createdAt: u.createdAt,
});

async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    return res.json({ success: true, data: { user: formatUser(user) } });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    if (username) user.username = username.trim();

    if (email && email.toLowerCase() !== user.email) {
      user.email = email.toLowerCase();
      user.isVerified = false;

      const token = crypto.randomBytes(32).toString("hex");
      user.verificationToken = token;
      user.verificationTokenExpiry = new Date(Date.now() + 30 * 60 * 1000);

      sendVerificationEmail(user.email, user.username, token).catch(() => {});
    }

    await user.save();
    return res.json({ success: true, message: "Profile updated.", data: { user: formatUser(user) } });
  } catch (error) {
    next(error);
  }
}

async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Please upload an image." });

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: `avatar_${req.user.id}_${Date.now()}`,
      folder: "/avatars",
    });

    const user = await User.findByIdAndUpdate(req.user.id, { avatar: result.url }, { new: true });
    return res.json({ success: true, message: "Avatar uploaded.", data: { user: formatUser(user) } });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
};
