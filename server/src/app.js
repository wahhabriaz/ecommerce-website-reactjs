const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/products", productRoutes);

module.exports = app;
