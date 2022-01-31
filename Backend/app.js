const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");

const errorMiddleware = require("./middlewares/error");

app.use(express.json());
app.use(cookieParser());

// IMPORTING ALL THE ROUTES
const products = require("./routes/product");
const auth = require("./routes/auth");
const order = require("./routes/order");

app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", order);

// ERROR HANDLING ( Middle Ware )
app.use(errorMiddleware);

module.exports = app;
