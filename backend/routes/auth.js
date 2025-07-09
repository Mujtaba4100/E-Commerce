// backend/routes/auth.js

import express from "express";
import bcrypt from "bcrypt";
// ✅ Correct import for ES Modules
import User from "../models/user.js";



const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "Login successful", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
