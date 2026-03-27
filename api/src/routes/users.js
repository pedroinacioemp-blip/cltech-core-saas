const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middlewares/auth');

// Get all users (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users');
    res.json({ users: result.rows, total: result.rows.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users', message: error.message });
  }
});

// Get user by ID (protected)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user', message: error.message });
  }
});

// Update user (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (req.userId !== parseInt(id) && req.userId !== 1) { // Admin check can be added
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, updated_at = NOW() WHERE id = $3 RETURNING id, name, email',
      [name || null, email || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user', message: error.message });
  }
});

// Delete user (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.userId !== parseInt(id) && req.userId !== 1) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user', message: error.message });
  }
});

module.exports = router;
