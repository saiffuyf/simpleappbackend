const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const matchRoutes = require("./routes/matchRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/ai-dating", matchRoutes);

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB Atlas");
  app.listen(5003, () => console.log("AI Dating Service running on port 5003"));
}).catch(err => {
  console.error("MongoDB connection error:", err);
});
