const express = require('express');
const router = express.Router();
const pool = require('../config/database');

/**
 * @swagger
 * /api/webhooks/bot-status:
 *   post:
 *     summary: Recebe o status de envio de uma imagem pelo Bot
 *     tags: [Webhooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [sent, failed]
 *               error:
 *                 type: string
 */
router.post('/bot-status', async (req, res) => {
  try {
    const { imageId, status, error } = req.body;
    
    // Log do status (pode ser expandido para salvar no DB)
    console.log(`[BOT-STATUS] Image ${imageId}: ${status} ${error ? `(Error: ${error})` : ''}`);
    
    res.json({ message: 'Status received' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
