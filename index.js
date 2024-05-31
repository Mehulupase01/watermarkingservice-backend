const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const watermarkRoutes = require("./routes/watermark");
const cors = require("cors");
const app = express();

app.use((req, res, next) => {
  // Update this line to allow your web app's origin
  res.setHeader('Access-Control-Allow-Origin', 'http://watermark.fron.web.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400');
    res.sendStatus(204);
  } else {
    next();
  }
});

app.use(express.json());
app.use('/api/watermark', watermarkRoutes);

// Create a function to start the server
const startServer = () => {
  const server = app.listen(0, () => {
    const port = server.address().port;
    console.log(`Server is running on port ${port}`);
  });
  return server;
};

// Export the function
exports.watermarkService = startServer;
