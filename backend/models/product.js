import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, default: "general" },
  stock: { type: Number, default: 0 },
}, {
  timestamps: true
});

export default mongoose.model("Product", productSchema);