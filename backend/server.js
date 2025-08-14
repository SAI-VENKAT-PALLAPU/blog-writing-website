import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createPool } from './db.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

createPool().getConnection()
  .then(conn => { conn.release(); console.log('MySQL connected'); })
  .catch(err => { console.error('MySQL connection error:', err.message); process.exit(1); });

app.use(helmet());
app.use(express.json({limit: '1mb'}));

const allowed = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: function(origin, cb){
    if (!origin) return cb(null, true);
    if (allowed.length === 0 || allowed.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'), false);
  },
  credentials: true
}));
app.use(morgan('dev'));

app.get('/api/health', (req,res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.use((req,res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
