const sendError = (res, message) => res.status(400).json({ success: false, message });
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegister(req, res, next) {
  const { username, email, password } = req.body;

  if (!username || username.trim().length < 3) {
    return sendError(res, "Username must be at least 3 characters.");
  }
  if (!email || !emailRegex.test(email.trim())) {
    return sendError(res, "Please provide a valid email address.");
  }
  if (!password || password.length < 8) {
    return sendError(res, "Password must be at least 8 characters.");
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, "Email and password are required.");
  }

  next();
}

function validateForgotPassword(req, res, next) {
  const { email } = req.body;

  if (!email || !emailRegex.test(email.trim())) {
    return sendError(res, "Please provide a valid email address.");
  }

  next();
}

function validateResetPassword(req, res, next) {
  const { password } = req.body;

  if (!password || password.length < 8) {
    return sendError(res, "Password must be at least 8 characters.");
  }

  next();
}

function validateChangePassword(req, res, next) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return sendError(res, "Current and new password are required.");
  }
  if (newPassword.length < 8) {
    return sendError(res, "New password must be at least 8 characters.");
  }
  if (currentPassword === newPassword) {
    return sendError(res, "New password must be different from current password.");
  }

  next();
}

function validateUpdateProfile(req, res, next) {
  const { username, email } = req.body;

  if (username && username.trim().length < 3) {
    return sendError(res, "Username must be at least 3 characters.");
  }
  if (email && !emailRegex.test(email.trim())) {
    return sendError(res, "Please provide a valid email address.");
  }

  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateProfile,
};
