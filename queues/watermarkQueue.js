const Queue = require('bull');
const { processWatermarkJob } = require('../workers/watermarkWorker');

const watermarkQueue = new Queue('watermarkQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379
  }
});

watermarkQueue.process(processWatermarkJob);

module.exports = watermarkQueue;
