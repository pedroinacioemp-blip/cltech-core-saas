const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const pool = require('../config/database');
const authMiddleware = require('../middlewares/auth');

// Multer storage in memory
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload Image with Caption
router.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { caption } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Convert buffer to base64 for Cloudinary
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: 'cltech-core-saas/images'
    });

    const result = await pool.query(
      'INSERT INTO images (user_id, url, caption, public_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.userId, uploadResponse.secure_url, caption, uploadResponse.public_id]
    );

    res.status(201).json({ 
      message: 'Image uploaded successfully', 
      image: result.rows[0] 
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image', message: error.message });
  }
});

// Get User Images
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM images WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json({ images: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Update Image Caption
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { caption } = req.body;

    const result = await pool.query(
      'UPDATE images SET caption = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
      [caption, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found or unauthorized' });
    }

    res.json({ message: 'Caption updated successfully', image: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update caption' });
  }
});

// Delete Image
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM images WHERE id = $1 AND user_id = $2 RETURNING public_id',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found or unauthorized' });
    }

    // Delete from Cloudinary as well
    if (result.rows[0].public_id) {
      await cloudinary.uploader.destroy(result.rows[0].public_id);
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

module.exports = router;
