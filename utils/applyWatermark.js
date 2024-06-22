const ffmpeg = require('fluent-ffmpeg');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
if (!bucketName) {
  throw new Error('A bucket name is needed to use Cloud Storage.');
}
const bucket = storage.bucket(bucketName);

exports.applyWatermarkToVideo = (videoPath, imagePath, outputFilePath) => {
  return new Promise((resolve, reject) => {
    console.log('Starting video processing:', { videoPath, imagePath, outputFilePath });

    ffmpeg(videoPath)
      .input(imagePath)
      .complexFilter([
        '[1:v]scale=iw:ih[wm];[wm]format=rgba,colorchannelmixer=aa=0.5[wm_trans];[0:v][wm_trans]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2'
      ])
      .outputOptions('-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast')
      .output(outputFilePath)
      .on('end', () => {
        console.log('Video processing completed:', outputFilePath);
        resolve();
      })
      .on('error', (err) => {
        console.error('Error during video processing:', err);
        reject(err);
      })
      .run();
  });
};

exports.uploadToCloudStorage = (filePath) => {
  return new Promise((resolve, reject) => {
    const destination = path.basename(filePath);
    console.log('Uploading to Cloud Storage:', filePath);
    bucket.upload(filePath, { destination }, (err, file) => {
      if (err) {
        console.error('Error during file upload:', err);
        return reject(err);
      }
      const publicUrl = `https://${bucket.name}.storage.googleapis.com/${file.name}`;
      console.log('File uploaded successfully:', publicUrl);
      fs.unlinkSync(filePath); 
      resolve(publicUrl);
    });
  });
};
