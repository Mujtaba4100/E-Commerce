import express from "express";
import jwt from "jsonwebtoken";
import CartItem from "../models/cartItem.js";
import Product from "../models/product.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// Authentication middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

// Get user's cart
router.get("/", auth, async (req, res) => {
  try {
    const cart = await CartItem.find({ userId: req.userId })
      .populate('productId', 'name price image description')
      .sort({ createdAt: -1 });
    
    res.json(cart);
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Failed to get cart" });
  }
});

// Add item to cart
router.post("/", auth, async (req, res) => {
  try {
    const { productId, name, price, image, quantity = 1 } = req.body;

    // Validate required fields
    if (!productId || !name || !price) {
      return res.status(400).json({ message: "Product ID, name, and price are required" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({ 
      userId: req.userId, 
      productId 
    });

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.json(existingItem);
    }

    // Create new cart item
    const cartItem = new CartItem({
      userId: req.userId,
      productId,
      name,
      price,
      image: image || product.image,
      quantity
    });

    await cartItem.save();
    res.status(201).json(cartItem);

  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
});

// Update cart item quantity
router.patch("/:id", auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cartItem = await CartItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: { quantity } },
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json(cartItem);

  } catch (err) {
    console.error("Update quantity error:", err);
    res.status(500).json({ message: "Failed to update quantity" });
  }
});

// Remove single cart item
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await CartItem.deleteOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(204).send();

  } catch (err) {
    console.error("Delete cart item error:", err);
    res.status(500).json({ message: "Failed to delete cart item" });
  }
});

// Clear all cart items
router.delete("/", auth, async (req, res) => {
  try {
    await CartItem.deleteMany({ userId: req.userId });
    res.status(204).send();
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
});

export default router;