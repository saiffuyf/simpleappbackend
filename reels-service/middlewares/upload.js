const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage(); // use memory buffer
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (!['.mp4', '.mov', '.avi', '.webm'].includes(ext)) {
    return cb(new Error('Only video files are allowed'));
  }
  cb(null, true);
};

module.exports = multer({ storage, fileFilter });
