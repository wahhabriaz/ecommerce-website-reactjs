require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const products = [
  {
    title: "Classic T-Shirt",
    price: 29.99,
    images: ["/images/p1.jpg"],
    category: "T-Shirts",
    brand: "Uomo",
    description: "Soft cotton tee",
    stock: 20,
  },
  // add more…
];

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("✅ Seeded products:", products.length);
    process.exit(0);
  } catch (e) {
    console.error("❌ Seed failed:", e.message);
    process.exit(1);
  }
}

run();
