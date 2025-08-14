import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const posts = await query(`
      SELECT p.id, p.title, LEFT(p.content, 300) AS excerpt, p.content, p.created_at, p.updated_at,
             u.username AS author
      FROM posts p
      JOIN users u ON u.id = p.author_id
      ORDER BY p.created_at DESC
    `);
    res.json(posts.map(p => ({ id: p.id, title: p.title, excerpt: p.excerpt, author: p.author, created_at: p.created_at })));
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const rows = await query(`
      SELECT p.id, p.title, p.content, p.created_at, p.updated_at, p.author_id, u.username AS author
      FROM posts p JOIN users u ON u.id = p.author_id WHERE p.id = :id
    `, { id });
    if (!rows.length) return res.status(404).json({ error: 'Post not found' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'title and content required' });
    const result = await query('INSERT INTO posts (title, content, author_id) VALUES (:title, :content, :author_id)',
      { title, content, author_id: req.user.id });
    const post = await query('SELECT id, title, content, author_id, created_at FROM posts WHERE id = :id', { id: result.insertId });
    res.status(201).json(post[0]);
  } catch (e) { next(e); }
});
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, content } = req.body;
    const rows = await query('SELECT id, author_id FROM posts WHERE id = :id', { id });
    if (!rows.length) return res.status(404).json({ error: 'Post not found' });
    if (rows[0].author_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await query('UPDATE posts SET title = :title, content = :content, updated_at = NOW() WHERE id = :id', { id, title, content });
    const post = await query('SELECT id, title, content, author_id, updated_at FROM posts WHERE id = :id', { id });
    res.json(post[0]);
  } catch (e) { next(e); }
});
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const rows = await query('SELECT id, author_id FROM posts WHERE id = :id', { id });
    if (!rows.length) return res.status(404).json({ error: 'Post not found' });
    if (rows[0].author_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await query('DELETE FROM posts WHERE id = :id', { id });
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
});
export default router;
