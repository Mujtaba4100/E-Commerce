// models/CartItem.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: String,  // this should NOT be MongoDB _id
  name: String,
  price: Number,
  image: String,
  quantity: Number,
});

export default mongoose.model("CartItem", cartItemSchema);
