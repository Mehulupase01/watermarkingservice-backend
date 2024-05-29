const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const watermarkRoutes = require("./routes/watermark");
const cors = require("cors");
const app = express();

app.use(cors());
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
