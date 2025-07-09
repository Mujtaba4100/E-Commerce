// backend/models/cartitem.js

import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: String,
  name: String,
  price: Number,
  quantity: { type: Number, default: 1 },
  image: String,
});

const CartItem = mongoose.model("CartItem", cartItemSchema);
export default CartItem;
