// models/cartitem.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  productId: { type: String, required: true },
  name: { type: String, required: true },     // ⛔ Required
  price: { type: Number, required: true },    // ⛔ Required
  image: { type: String },
  quantity: { type: Number, default: 1 },
});

const CartItem = mongoose.model("CartItem", cartItemSchema);
export default CartItem;
