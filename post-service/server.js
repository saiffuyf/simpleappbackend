const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const postRoutes = require("./routes/postRoutes");

const app = express();
app.use(cors({
  origin: 'https://texus.onrender.com',
  credentials: true
}));
// app.use(cors())

// Middleware
app.use(express.json());



// app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images
// Routes
app.use("/api/posts", postRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Post Service running on port ${PORT}`));
