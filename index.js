const express = require("express");
const dotenv = require("dotenv");
const serverless = require("serverless-http");
dotenv.config();
const watermarkRoutes = require("./routes/watermark");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = ['https://watermark-fron.web.app/', 'https://ass2vid1.storage.googleapis.com'];
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

app.use(express.json());
app.use('/api/watermark', watermarkRoutes);

module.exports = { app: serverless(app) };
