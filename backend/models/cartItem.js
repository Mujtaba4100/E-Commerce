import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: "" },
  quantity: { type: Number, default: 1, min: 1 },
}, {
  timestamps: true
});

// Prevent duplicate cart items for same user/product
cartItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

const CartItem = mongoose.model("CartItem", cartItemSchema);
export default CartItem;