const express = require('express');
const { applyWatermark } = require('../controllers/watermarkController');

const router = express.Router();

router.post('/upload', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*'); // Use '*' to allow all origins, or specify your frontend URL
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  res.set('Access-Control-Allow-Credentials', true);

  applyWatermark(req, res);
});

router.post('/upload-url', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*'); // Use '*' to allow all origins, or specify your frontend URL
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  res.set('Access-Control-Allow-Credentials', true);

  applyWatermark(req, res);
});

module.exports = router;
