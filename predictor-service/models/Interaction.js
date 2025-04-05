const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema({
  userId: String,
  targetUserId: String,
  likes: Number,
  comments: Number,
  dms: Number,
  responseTime: Number,
});

module.exports = mongoose.model("Interaction", interactionSchema);
