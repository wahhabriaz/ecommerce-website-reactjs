const router = require("express").Router();
const Product = require("../models/Product");

// GET /api/products
router.get("/", async (req, res) => {
  const { search, category, minPrice, maxPrice, sort = "-createdAt", page = 1, limit = 12 } = req.query;

  const filter = {};
  if (search) filter.title = { $regex: search, $options: "i" };
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// POST /api/products
router.post("/", async (req, res) => {
  const created = await Product.create(req.body);
  res.status(201).json(created);
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).send();
});


module.exports = router;
