const express = require('express');
const { applyWatermark } = require('../controllers/watermarkController');
const { publishToPubSub } = require('../utils/publishToPubSub'); // Ensure you have this utility function defined
const cors = require('cors');

const router = express.Router();

// Define the CORS options
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['https://watermark-fron.web.app/', 'https://ass2vid.storage.googleapis.com']; // Add your allowed origins here
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['X-Requested-With', 'content-type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Apply CORS to all routes
router.use(cors(corsOptions));

// Existing endpoint to apply watermark directly
router.post('/upload', (req, res) => {
  applyWatermark(req, res);
});

router.post('/upload-url', (req, res) => {
  applyWatermark(req, res);
});

// New endpoint to trigger the watermark process via Pub/Sub
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
