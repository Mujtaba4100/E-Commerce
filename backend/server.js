import express from 'express';
import cors from 'cors';
import { readFile } from 'fs/promises';

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/products', async (req, res) => {
  const data = await readFile('./products.json', 'utf-8');
  res.json(JSON.parse(data));
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
