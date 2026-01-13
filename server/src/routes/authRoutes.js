const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name = "", email, password } = req.body || {};

  if (!email || !password) return res.status(400).json({ message: "Email and password required" });
  if (String(password).length < 6) return res.status(400).json({ message: "Password must be 6+ chars" });

  const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (exists) return res.status(409).json({ message: "Email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: String(email).toLowerCase().trim(),
    passwordHash,
    role: "user",
  });

  const token = signToken(user._id.toString());

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user._id.toString());

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
