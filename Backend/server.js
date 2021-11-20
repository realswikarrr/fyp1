const app = require("./app");
const connectDatabase = require("./config/database");

const dotenv = require("dotenv");

// Handling Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting Down The Server Due To Uncaught Exception");
  process.exit(1);
});

// Getting Ready With Config Files
dotenv.config({ path: "backend/config/config.env" });

// TODO: Connecting Database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

// Handling Unhandled Rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting dow the server due to unhandled promise rejection`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
