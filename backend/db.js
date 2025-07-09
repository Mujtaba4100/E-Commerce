import mongoose from "mongoose";
import dotenv from "dotenv"; // ❌ You wrote 'env' instead of 'dotenv'

dotenv.config(); // ✅ This loads .env variables into process.env

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));
