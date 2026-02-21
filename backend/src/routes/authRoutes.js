const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../db/model/User");

const router = express.Router();
const jwtKey = process.env.JWT_SECRET;

/* ===============================
   REGISTER
================================ */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      address,
      role,
      password: hashedPassword,
      approved: false, // manager must approve
    });

    await user.save();

    res.status(201).json({
      message: "Registration successful. Awaiting admin approval.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ===============================
   LOGIN
================================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.approved) {
      return res.status(403).json({
        message: "Account awaiting approval",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      jwtKey,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;