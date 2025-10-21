require("dotenv").config();

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDatabase = require("./helpers/database/connectDatabase");
const customErrorHandler = require("./middlewears/errors/customErrorHandler");
const routers = require("./routers");
const path = require("path");

// Enviroment Variables
dotenv.config({
  path: "./config/env/config.env",
});

// MongoDB Connection
connectDatabase();

const app = express();

// Test rotası (ilk sıraya koy — Railway root için buraya gelir)
app.get("/", (req, res) => {
  res.send("API is live!");
});

// Profil fotoğraflarını dışarı aç
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// CORS
app.use(cors());

// Body Parser
app.use(express.json());

// API Routers
app.use("/api", routers);

// Error Handler
app.use(customErrorHandler);

// (Opsiyonel) Public klasörü servis et
app.use(express.static(path.join(__dirname, "public")));

// Tüm isteklerde log bas (sonlara koymak iyidir)
app.use((req, res, next) => {
  console.log("İstek geldi:", req.method, req.url);
  next();
});

// Port ayarı
const PORT = process.env.PORT || 3000; // Local için fallback

app.listen(PORT, () => {
  console.log(`App started on ${PORT}: ${process.env.NODE_ENV}`);
});
