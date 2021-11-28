const express = require("express");
const app = express();

const errorMiddleware = require("./middlewares/error");

app.use(express.json());

// IMPORTING ALL THE ROUTES
const products = require("./routes/product");
const auth = require("./routes/auth");

app.use("/api/v1", products);
app.use("/api/v1", auth);

// ERROR HANDLING ( Middle Ware )
app.use(errorMiddleware);

module.exports = app;
