import express from 'express';
import jwt from "jsonwebtoken"
// const jwt = require("jsonwebtoken");
import CartItem from "../models/cartitem.js";

const router = express.Router();

const JWT_SECRET = "your_secret_key";

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (e) {
    res.sendStatus(403);
  }
}

// Get cart for user
router.get("/", auth, async (req, res) => {
  const cart = await CartItem.find({ userId: req.userId });
  res.json(cart);
});

// Add item to cart
router.post("/", auth, async (req, res) => {
  const { productId, name, price, image } = req.body;
  const existing = await CartItem.findOne({ userId: req.userId, productId });
  if (existing) {
    existing.quantity += 1;
    await existing.save();
    return res.json(existing);
  }
  const item = new CartItem({ userId: req.userId, productId, name, price, image });
  await item.save();
  res.status(201).json(item);
});

// Delete single item
router.delete("/:id", auth, async (req, res) => {
  await CartItem.deleteOne({ _id: req.params.id, userId: req.userId });
  res.sendStatus(204);
});

// Clear all
router.delete("/", auth, async (req, res) => {
  await CartItem.deleteMany({ userId: req.userId });
  res.sendStatus(204);
});

// Update quantity
router.patch("/:id", auth, async (req, res) => {
  const { quantity } = req.body;
  await CartItem.updateOne(
    { _id: req.params.id, userId: req.userId },
    { $set: { quantity } }
  );
  res.sendStatus(200);
});

export default router

