const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },

    brand: { type: String, default: "" },
    category: { type: String, index: true, required: true },
    tags: [{ type: String }],

    description: { type: String, default: "" },
    details: [{ label: String, value: String }], // e.g. Material/Care/Fit

    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: 0 }, // old price
    currency: { type: String, default: "USD" },

    images: [{ type: String, required: true }], // ["/images/a.jpg", "/images/b.jpg"]
    thumbnail: { type: String, default: "" },

    stock: { type: Number, default: 0 },
    sku: { type: String, default: "" },

    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
