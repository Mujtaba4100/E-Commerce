import express from "express";
import jwt from "jsonwebtoken";
import CartItem from "../models/cartItem.js";


const router = express.Router();
const JWT_SECRET = "your_secret_key";

// 🔐 Middleware to verify JWT token
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (e) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

// 📥 Get user's cart
router.get("/", auth, async (req, res) => {
  try {
    const cart = await CartItem.find({ userId: req.userId });
    res.json(cart);
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Failed to get cart" });
  }
});

// ➕ Add item to cart
router.post("/", auth, async (req, res) => {
  const { productId, name, price, image } = req.body;

  if (!productId || !name || !price) {
    return res.status(400).json({ message: "Missing cart item data" });
  }

  try {
    const existing = await CartItem.findOne({ userId: req.userId, productId });

    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return res.json(existing);
    }

    const item = new CartItem({
      userId: req.userId,
      productId,
      name,
      price,
      image,
      quantity: 1,
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error("Cart add error:", err);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
});

// ❌ Delete one cart item
router.delete("/:id", auth, async (req, res) => {
  try {
    await CartItem.deleteOne({ _id: req.params.id, userId: req.userId });
    res.sendStatus(204);
  } catch (err) {
    console.error("Delete item error:", err);
    res.status(500).json({ message: "Failed to delete item" });
  }
});

// 🧹 Clear all cart items
router.delete("/", auth, async (req, res) => {
  try {
    await CartItem.deleteMany({ userId: req.userId });
    res.sendStatus(204);
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
});

// 🔁 Update quantity of a cart item
router.patch("/:id", auth, async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  try {
    await CartItem.updateOne(
      { _id: req.params.id, userId: req.userId },
      { $set: { quantity } }
    );
    res.sendStatus(200);
  } catch (err) {
    console.error("Update quantity error:", err);
    res.status(500).json({ message: "Failed to update quantity" });
  }
});

export default router;
