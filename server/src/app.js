const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV });
});

module.exports = app;
