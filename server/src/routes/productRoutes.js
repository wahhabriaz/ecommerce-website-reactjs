const router = require("express").Router();
const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");
const { requireAuth, requireAdmin } = require("../middleware/auth");

function safeUnlink(relUrl) {
  // only allow deleting from /uploads
  if (!relUrl?.startsWith("/uploads/")) return;

  const filePath = path.join(process.cwd(), "public", relUrl); 
  // relUrl already starts with /uploads/...
  fs.unlink(filePath, (err) => {
    if (err) console.log("⚠️ delete file failed:", err.message);
  });
}

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
router.post("/",requireAuth,requireAdmin, async (req, res) => {
  const created = await Product.create(req.body);
  res.status(201).json(created);
});

// UPDATE product
router.put("/:id",requireAuth,requireAdmin, async (req, res) => {
  const existing = await Product.findById(req.params.id);
  if (!existing) return res.status(404).json({ message: "Product not found" });

  const oldImages = existing.images || [];
  const newImages = req.body.images || [];

  // images removed by admin
  const removed = oldImages.filter((img) => !newImages.includes(img));
  removed.forEach(safeUnlink);

  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json(updated);
});


// DELETE product
router.delete("/:id",requireAuth,requireAdmin, async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Product not found" });
  (deleted.images || []).forEach(safeUnlink);
  res.status(204).send();
});



module.exports = router;
