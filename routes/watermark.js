const express = require('express');
const { applyWatermark } = require('../controllers/watermarkController');
const { publishToPubSub } = require('../utils/publishToPubSub'); 
const cors = require('cors');

const router = express.Router();

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['https://watermark-fron.web.app/', 'https://ass2vid1.storage.googleapis.com']; 
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['X-Requested-With', 'content-type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 
};

router.use(cors(corsOptions));

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
