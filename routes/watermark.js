const express = require('express');
const { applyWatermark } = require('../controllers/watermarkController');
const { publishToPubSub } = require('../utils/publishToPubSub');

const router = express.Router();

router.post('/upload', (req, res) => {
  applyWatermark(req, res);
});

router.post('/upload-url', (req, res) => {
  applyWatermark(req, res);
});

router.post('/trigger-watermark-process', async (req, res) => {
  const { videoPath, imagePath, videoUrl, imageUrl } = req.body;
  try {
    const messageId = await publishToPubSub({ videoPath, imagePath, videoUrl, imageUrl });
    res.status(200).json({ messageId: messageId, message: 'Watermark process initiated' });
  } catch (error) {
    console.error('Failed to publish message:', error);
    res.status(500).json({ message: 'Failed to initiate watermark process' });
  }
});

module.exports = router;
