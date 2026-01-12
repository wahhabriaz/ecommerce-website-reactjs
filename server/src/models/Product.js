const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    category: { type: String, index: true },
    brand: { type: String },
    description: { type: String },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
