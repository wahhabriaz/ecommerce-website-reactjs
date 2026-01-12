const mongoose = require("mongoose");

async function connectDB(uri) {
  mongoose.set("strictQuery", true);

  await mongoose.connect(uri, {
    autoIndex: true, // fine for local dev
  });

  console.log("✅ MongoDB connected");
}

module.exports = connectDB;
