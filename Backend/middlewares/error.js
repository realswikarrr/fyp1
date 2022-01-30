const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(err.statusCode).json({
      sucess: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err };

    error.message = err.message;

    // If Object Id In The Mongoose Is Wrong
    if (err.name === "CastError") {
      const message = `Resource not found with id of ${err.value}`;
      error = new ErrorHandler(message, 404);
    }

    // Handing Mongoose Duplicate Key Errors
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      error = new ErrorHandler(message, 404);
    }

    // Handling Wrong JWT Token Error
    if (err.name === "JsonWebTokenError") {
      const message = `JSON Web Token Error`;
      error = new ErrorHandler(message, 400);
    }

    // Handling Expire JWT Token Error
    if (err.name === "TokenExpiredError") {
      const message = `JSON Web Token Expired`;
      error = new ErrorHandler(message, 400);
    }

    // Mongoose Validation Error Handling
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((val) => val.message);
      error = new ErrorHandler(message, 400);
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};
