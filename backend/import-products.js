import mongoose from "mongoose";
import fs from "fs/promises";
import "./db.js";
import Product from "./models/product.js"; // adjust path if needed

async function importProducts() {
  try {
    const data = await fs.readFile("./products.json", "utf-8");
    let products = JSON.parse(data);

    // ✅ Clean price values: "$49.99" → 49.99 (number)
    products = products.map(p => ({
      ...p,
      price: parseFloat(String(p.price).replace(/[^0-9.]/g, "")), // removes "$" or anything else
    }));

    await Product.deleteMany({});
    console.log("✅ Old products cleared");

    await Product.insertMany(products);
    console.log("✅ Products imported to MongoDB");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error importing products:", err);
    process.exit(1);
  }
}

importProducts();
