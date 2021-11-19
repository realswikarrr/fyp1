const Product = require("../models/product");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");
const products = require("../data/products");

// Setting up the dotenv file
dotenv.config({ path: "backend/config/config.env" });

// Connecting The Databse
connectDatabase();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("Products Are Deleted");
    await Product.insertMany(products);
    console.log("Products Are Inserted");
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

seedProducts();
