require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

(async () => {
  try {
    const email = process.argv[2];
    if (!email) throw new Error("Usage: node src/scripts/makeAdmin.js you@email.com");

    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { role: "admin" },
      { new: true }
    );

    if (!user) throw new Error("User not found. Register first.");

    console.log("✅ Now admin:", user.email, user.role);
    process.exit(0);
  } catch (e) {
    console.error("❌", e.message);
    process.exit(1);
  }
})();
