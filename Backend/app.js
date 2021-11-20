const express = require("express");
const app = express();

const errorMiddleware = require("./middlewares/error");

app.use(express.json());

// IMPORTING ALL THE ROUTES
const products = require("./routes/product");

app.use("/api/v1", products);

// ERROR HANDLING ( Middle Ware )
app.use(errorMiddleware);

module.exports = app;
