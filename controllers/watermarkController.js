const path = require('path');
const fs = require('fs');
const { applyWatermarkToVideo, uploadToCloudStorage } = require('../utils/applyWatermark');
const { downloadFile } = require('../utils/downloadFile');

exports.applyWatermark = async (req, res) => {
  try {
    let videoPath, imagePath;

    if (req.files && req.files.video && req.files.image) {
      console.log('Received files:', req.files);
      videoPath = req.files.video[0].path;
      imagePath = req.files.image[0].path;
    } else if (req.body.videoUrl && req.body.imageUrl) {
      console.log('Received URLs:', req.body);
      const videoUrl = req.body.videoUrl;
      const imageUrl = req.body.imageUrl;
      videoPath = path.join(__dirname, '..', 'uploads', `video_${Date.now()}.mp4`);
      imagePath = path.join(__dirname, '..', 'uploads', `image_${Date.now()}.png`);
      await downloadFile(videoUrl, videoPath);
      await downloadFile(imageUrl, imagePath);
    } else {
      throw new Error('Either files or URLs must be provided.');
    }

    const outputFilePath = path.join(__dirname, '..', 'uploads', `watermarked_${Date.now()}.mp4`);
    await applyWatermarkToVideo(videoPath, imagePath, outputFilePath);
    const url = await uploadToCloudStorage(outputFilePath);

    console.log('Watermarked video URL:', url);
    res.status(200).json({ url });
  } catch (error) {
    console.error('Error in applyWatermark controller:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
