import express from "express";
import CartItem from "../models/cartItem.js"; // path depends on your file structure

const router = express.Router();

// POST /cart - Add item to cart
router.post("/cart", async (req, res) => {
  try {
    const item = new CartItem(req.body);
    await item.save();
    res.status(201).json({ message: "Item added to cart" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add item" });
  }
});

// GET /cart - Get all items
router.get("/cart", async (req, res) => {
  try {
    const items = await CartItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

export default router;



