const express = require("express");
const dotenv = require("dotenv");
const serverless = require("serverless-http");
dotenv.config();
const watermarkRoutes = require("./routes/watermark");
const cors = require("cors");

const app = express();

// Set up CORS
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = ['https://watermark-fron.web.app', 'https://ass2vid1.storage.googleapis.com'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: 'X-Requested-With,content-type,Authorization'
}));

// Add CORS headers to every response
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(express.json());
app.use('/api/watermark', watermarkRoutes);

// Local development server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for serverless deployment
module.exports = { app: serverless(app) };
