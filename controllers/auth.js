const User = require("../models/user");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers");
const {
  validateUserInput,
  comparePassword,
} = require("../helpers/input/inputHelpers");
const sendEmail = require("../helpers/libraries/sendEmail");
const { compare } = require("bcryptjs");

// --- REGISTER ---
const register = asyncErrorWrapper(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendJwtToClient(user, res);
});

// --- LOGIN ---
const login = asyncErrorWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!validateUserInput(email, password)) {
    return next(new CustomError("Please check your inputs", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!comparePassword(password, user.password)) {
    return next(new CustomError("Please check your credentials", 400));
  }

  sendJwtToClient(user, res);
});

// --- LOGOUT ---
const logout = asyncErrorWrapper(async (req, res, next) => {
  const { NODE_ENV } = process.env;

  return res
    .status(200)
    .cookie("access_token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: NODE_ENV !== "development",
      sameSite: "strict",
    })
    .json({
      success: true,
      message: "Logout successful.",
    });
});

// --- GET USER ---

const getUser = asyncErrorWrapper(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "Kullanıcı bulunamadı." });
  }

  res.json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      profile_image: user.profile_image, // ✅ bu satır kritik
    },
  });
});

// --- IMAGE UPLOAD ---
const imageUpload = asyncErrorWrapper(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { profile_image: req.savedProfileImage },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Image Upload Successfull",
    data: user,
  });
});

// --- FORGOT PASSWORD ---
const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
  const resetEmail = req.body.email;
  const user = await User.findOne({ email: resetEmail });

  if (!user) {
    return next(new CustomError("There is no user with that email", 400));
  }

  const resetPasswordToken = user.getResetPasswordTokenFromUser();
  await user.save();

  const resetPasswordUrl = `http://localhost:3000/reset-password?token=${resetPasswordToken}`;
  const emailTemplate = `
<div style="max-width: 600px; margin: auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; color: #1d1d1f; background-color: #ffffff; padding: 40px 30px;">
  <h2 style="font-weight: 600; font-size: 24px; color: #000000; margin-bottom: 24px;">Reset Your Password</h2>
  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Hi there,</p>
  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
    We received a request to reset the password for your account. Click the button below to create a new password.
  </p>
  <a href="${resetPasswordUrl}"
     style="display: inline-block; background-color: #0071e3; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 16px;">
    Reset Password
  </a>
  <p style="font-size: 14px; line-height: 1.5; color: #6e6e73; margin-top: 30px;">
    If you didn’t request a password reset, please ignore this email. Your current password will remain unchanged.
  </p>
  <p style="font-size: 12px; color: #86868b; margin-top: 40px;">
    This link will expire in 1 hour for your security.
  </p>
</div>
`;

  try {
    await sendEmail({
      from: process.env.SMTP_USER,
      to: resetEmail,
      subject: "Reset Your Password",
      html: emailTemplate,
    });

    return res.status(200).json({
      success: true,
      message: "Token Sent To Your Email",
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return next(new CustomError("Email Could Not Be Sent", 500));
  }
});

// --- RESET PASSWORD ---
const resetPassword = asyncErrorWrapper(async (req, res, next) => {
  const { resetPasswordToken } = req.query;
  const { password } = req.body;

  if (!resetPasswordToken) {
    return next(new CustomError("Please provide a valid token", 400));
  }

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new CustomError("Invalid Token or Session Expired", 400));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Reset Password Process Successful",
  });
});

// --- EDIT USER DETAILS ---
const editDetails = asyncErrorWrapper(async (req, res, next) => {
  const editInformation = req.body;

  const user = await User.findByIdAndUpdate(req.user.id, editInformation, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: user,
  });
});

// --- CHANGE PASSWORD ---
const changePassword = asyncErrorWrapper(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");

  const isMatch = await compare(oldPassword, user.password);
  if (!isMatch) {
    return next(new CustomError("Eski şifre doğru değil.", 400));
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Şifre başarıyla değiştirildi.",
  });
});

module.exports = {
  register,
  login,
  logout,
  getUser,
  imageUpload,
  forgotPassword,
  resetPassword,
  editDetails,
  changePassword, // ✅ yeni fonksiyon burada export edildi
};
