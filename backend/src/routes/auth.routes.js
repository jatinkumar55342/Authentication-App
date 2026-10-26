const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  refreshToken,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");
const {
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
} = require("../middleware/validation.middleware");

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/reset-password/:token", validateResetPassword, resetPassword);
router.put("/change-password", authMiddleware, validateChangePassword, changePassword);

module.exports = router;
