// backend/routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();
const JWT_SECRET = "your_secret_key"; // 🔐 For production, move to .env

// Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ error: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });
  await user.save();

  res.status(201).json({ message: "User registered" });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  res.json({ token, userId: user._id });
});

export default router;
