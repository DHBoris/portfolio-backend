import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { contactRouter } from './routes/contact.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 3001);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', contactRouter);

app.listen(PORT, () => {
  console.log(`\x1b[32m✓\x1b[0m Server running on http://localhost:${PORT}`);
});
