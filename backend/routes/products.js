import express from "express";
import Product from "../models/product.js";

const router = express.Router();

// Add product to DB
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: "✅ Product saved", product });
  } catch (err) {
    res.status(400).json({ error: "❌ Could not save product", details: err });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to fetch products" });
  }
});

export default router;
