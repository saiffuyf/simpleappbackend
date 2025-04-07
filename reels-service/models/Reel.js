// const mongoose = require('mongoose');

// const ReelSchema = new mongoose.Schema({
//   userId: String,
//   fileId: mongoose.Schema.Types.ObjectId,
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Reel', ReelSchema);
const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Reel', reelSchema);
