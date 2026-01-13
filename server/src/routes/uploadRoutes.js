const router = require("express").Router();
const uploadLocal = require("../middleware/uploadLocal");

// field name must match form: "images"
router.post("/", uploadLocal.array("images", 8), (req, res) => {
  const files = req.files || [];

  // return relative URLs that your frontend can store in DB
  const urls = files.map((f) => `/uploads/${f.filename}`);

  res.status(201).json({ urls });
});

module.exports = router;
