const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
const path = require("path");
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: true,          // ✅ reflect request origin (localhost/127.0.0.1)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options(/.*/, cors());


app.use("/api/uploads", uploadRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
app.use("/images", express.static(path.join(__dirname, "../public/images")));

app.use(helmet());
app.use(express.json());
// app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
