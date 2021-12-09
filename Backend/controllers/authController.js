const User = require("../models/user");

const ErrorHandler = require("../utils/errorHandler");

const catchAsyncErrors = require("../middlewares/catchAsyncError");

const sendToken = require("../utils/jwtToken");
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
