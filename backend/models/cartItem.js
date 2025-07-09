// models/CartItem.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: String,
  quantity: Number
});

export default mongoose.model("CartItem", cartItemSchema);
