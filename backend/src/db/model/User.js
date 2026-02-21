const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  address: String,
  password: String,
  role: {
    type: String,
    enum: ["MANAGER", "DISPATCHER", "SAFETY", "FINANCE"],
  },
  approved: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);