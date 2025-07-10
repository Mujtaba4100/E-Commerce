import express from "express";
import Product from "../models/product.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const { category, search, limit = 50, page = 1 } = req.query;
    
    // Build query
    const query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("Get product error:", err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

// Add new product (protected route)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, price, description, image, category, stock } = req.body;

    // Validate required fields
    if (!name || !price || !description || !image) {
      return res.status(400).json({ 
        message: "Name, price, description, and image are required" 
      });
    }

    const product = new Product({
      name,
      price: parseFloat(price),
      description,
      image,
      category: category || "general",
      stock: parseInt(stock) || 0
    });

    await product.save();
    res.status(201).json({ 
      message: "Product created successfully", 
      product 
    });

  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ message: "Failed to create product" });
  }
});

// Update product (protected route)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { name, price, description, image, category, stock } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price: parseFloat(price),
        description,
        image,
        category,
        stock: parseInt(stock)
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ 
      message: "Product updated successfully", 
      product 
    });

  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Failed to update product" });
  }
});

// Delete product (protected route)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });

  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

export default router;