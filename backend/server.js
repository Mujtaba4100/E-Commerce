import express from 'express';
import cors from 'cors';
import { readFile } from 'fs/promises';
import './db.js';
import cartRoutes from './routes/cart.js';
import productRoutes from './routes/products.js';

const app = express();
const PORT = 3000;

app.use(cors()); // ✅ Must be before routes
app.use(express.json());

app.use('/api', cartRoutes);
app.use('/products', productRoutes);

// (Optional) JSON file route if still needed
app.get('/products', async (req, res) => {
  const data = await readFile('./products.json', 'utf-8');
  res.json(JSON.parse(data));
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
