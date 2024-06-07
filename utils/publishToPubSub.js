const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();

const publishToPubSub = async (data) => {
  const topicName = 'watermark-topic';  // Ensure you replace this with your actual topic name
  const dataBuffer = Buffer.from(JSON.stringify(data));
  try {
    const messageId = await pubsub.topic(topicName).publish(dataBuffer);
    console.log(`Message ${messageId} published.`);
    return messageId;
  } catch (error) {
    console.error('Failed to publish message:', error);
    throw error;
  }
};

module.exports = publishToPubSub;
