const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../model/user.model");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendLoginNotificationEmail,
} = require("../services/email.service");

const createAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" });

const createRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" });

const formatUser = (u) => ({
  id: u._id,
  username: u.username,
  email: u.email,
  avatar: u.avatar,
  isVerified: u.isVerified,
  createdAt: u.createdAt,
});

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    const token = crypto.randomBytes(32).toString("hex");
    const user = await User.create({
      username,
      email,
      password,
      verificationToken: token,
      verificationTokenExpiry: new Date(Date.now() + 30 * 60 * 1000),
    });

    sendVerificationEmail(user.email, user.username, token).catch(() => {
      console.log(`\nVerification Link: ${process.env.CLIENT_URL}/verify-email/${token}\n`);
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
      data: { user: formatUser(user) },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: "Please verify your email before logging in." });
    }

    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie("refreshToken", refreshToken, cookieOptions);
    sendLoginNotificationEmail(user.email, user.username).catch(() => {});

    return res.json({
      success: true,
      message: "Login successful.",
      data: { accessToken, user: formatUser(user) },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    res.clearCookie("refreshToken", cookieOptions);
    if (req.user) await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
    return res.json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    next(error);
  }
}

async function refreshTokenHandler(req, res, next) {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token provided." });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: "Invalid refresh token." });
    }

    const newAccessToken = createAccessToken(user._id);
    const newRefreshToken = createRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie("refreshToken", newRefreshToken, cookieOptions);

    return res.json({
      success: true,
      message: "Token refreshed successfully.",
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired refresh token." });
  }
}

async function verifyEmail(req, res, next) {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification link." });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save({ validateBeforeSave: false });

    return res.json({ success: true, message: "Email verified successfully. You can now log in." });
  } catch (error) {
    next(error);
  }
}

async function resendVerification(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase() });

    if (!user || user.isVerified) {
      return res.json({ success: true, message: "If an unverified account exists, an email has been sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;
    user.verificationTokenExpiry = new Date(Date.now() + 30 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    sendVerificationEmail(user.email, user.username, token).catch(() => {
      console.log(`\nVerification Link: ${process.env.CLIENT_URL}/verify-email/${token}\n`);
    });

    return res.json({ success: true, message: "If an unverified account exists, an email has been sent." });
  } catch (error) {
    next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase() });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
      user.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000);
      await user.save({ validateBeforeSave: false });

      sendPasswordResetEmail(user.email, user.username, resetToken).catch(() => {
        console.log(`\nReset Link: ${process.env.CLIENT_URL}/reset-password/${resetToken}\n`);
      });
    }

    return res.json({ success: true, message: "If an account with that email exists, a password reset link has been sent." });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token." });
    }

    user.password = req.body.password;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();

    return res.json({ success: true, message: "Password reset successful. You can now log in." });
  } catch (error) {
    next(error);
  }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");

    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  refreshToken: refreshTokenHandler,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
};
