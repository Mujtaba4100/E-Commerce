// backend/server.js
import express from 'express';
import cors from 'cors';
import { readFile } from 'fs/promises';
import './db.js';
import cartRoutes from './routes/cart.js';
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js'; // ✅ new

import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

// mongoose.connect('mongodb://localhost:27017/ecommerce');

// ✅ Use ES module imports
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);   // ✅ Make sure this file exists and is updated
app.use('/products', productRoutes);
app.use('/api/auth', authRoutes);

app.listen(3000, () => console.log('🚀 Server running on port 3000'));
