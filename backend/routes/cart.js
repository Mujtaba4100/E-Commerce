import express from "express";
import CartItem from "../models/cartitem.js";

const router = express.Router();

// ➕ Add to cart
// POST: Add item to cart
router.post("/cart", async (req, res) => {
  const { productId, name, price, image } = req.body;

  try {
    let item = await CartItem.findOne({ productId });

    if (item) {
      item.quantity += 1;
    } else {
      item = new CartItem({
        productId,
        name,
        price,
        image,
        quantity: 1, // ✅ IMPORTANT
      });
    }

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error("❌ Error adding to cart:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// 📥 Get all cart items
router.get("/cart", async (req, res) => {
  const items = await CartItem.find();
  res.json(items);
});
// PATCH: Update cart item quantity
// ✏️ Update quantity of an item
router.patch("/cart/:id", async (req, res) => {
  const { quantity } = req.body;

  try {
    const item = await CartItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.quantity = quantity;
    await item.save();

    res.json(item);
  } catch (err) {
    console.error("❌ Error updating quantity:", err);
    res.status(500).json({ error: "Server error" });
  }
});



// ❌ Delete one item
router.delete("/cart/:id", async (req, res) => {
  await CartItem.findByIdAndDelete(req.params.id);
  res.json({ message: "Item removed" });
});

// 🧹 Clear all cart
router.delete("/cart", async (req, res) => {
  await CartItem.deleteMany();
  res.json({ message: "Cart cleared" });
});

export default router;
