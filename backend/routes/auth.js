import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const existing = await query('SELECT id FROM users WHERE username = :username', { username });
    if (existing.length) return res.status(409).json({ error: 'Username already taken' });
    const hash = await bcrypt.hash(password, 10);
    const result = await query('INSERT INTO users (username, password_hash) VALUES (:username, :hash)', { username, hash });
    const id = result.insertId;
    const token = jwt.sign({ id, username }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '2d' });
    res.status(201).json({ id, username, token });
  } catch (e) { next(e); }
});
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const users = await query('SELECT id, username, password_hash FROM users WHERE username = :username', { username });
    if (!users.length) return res.status(401).json({ error: 'Invalid credentials' });
    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '2d' });
    res.json({ id: user.id, username: user.username, token });
  } catch (e) { next(e); }
});
export default router;
