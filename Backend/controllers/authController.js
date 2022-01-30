const User = require("../models/user");

const ErrorHandler = require("../utils/errorHandler");

const catchAsyncErrors = require("../middlewares/catchAsyncError");

const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const catchAsyncError = require("../middlewares/catchAsyncError");

// Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "avatars/kccvibpsuiusmwfepb3m",
      url: "https://res.cloudinary.com/shopit/image/upload/v1606305757/avatars/kccvibpsuiusmwfepb3m.png",
    },
  });

  // Send the token to the user
  sendToken(user, 200, res);
});

// Login a user => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  // Checking if the email and password is enterd by user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  // Checking if the user exist in the database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  // Checking if the password is correct
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  // Send the token to the user
  sendToken(user, 200, res);
});

// Forget Password ==> /api/v1/password/forgot

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User Not Found With This Email", 404));
  }

  // Get Reset Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Creating Reset Password URL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Recovery",
      message,
    });

    res.status(200).json({
      sucess: true,
      message: "Email Sent",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password ==> /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hashing The URL TOKEN
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Password Reset Token Is Invalid or has expired", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords are not the same", 400));
  }

  // Creating a new password for the user
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Logout a user => /api/v1/logout

exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", "null", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    sucess: true,
    message: "User logged out successfully",
  });
});
