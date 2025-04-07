const mongoose = require('mongoose');
const Reel = require('../models/Reel');
const { GridFSBucket } = require('mongodb');

let bucket;
mongoose.connection.once('open', () => {
  bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'reels' });
});

// Upload video to GridFS
// ****exports.uploadReel = async (req, res) => {
//     // const { userId } = req.body;
//     const { userId, caption, tags } = req.body;

//     if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
//     const uploadStream = bucket.openUploadStream(`reel_${Date.now()}.mp4`, {
//       contentType: req.file.mimetype,
//     });
  
//     const fileId = uploadStream.id; // <-- capture manually
  
//     uploadStream.end(req.file.buffer);
  
//     uploadStream.on('finish', async () => {
//       try {
//         const newReel = new Reel({ userId, fileId });
//         await newReel.save();
//         res.status(201).json({ message: 'Reel uploaded successfully', reelId: newReel._id });
//       } catch (err) {
//         console.error('DB save error:', err);
//         res.status(500).json({ error: 'Error saving reel to database' });
//       }
//     });
  
//     uploadStream.on('error', (err) => {
//       console.error('Upload error:', err);
//       res.status(500).json({ error: 'Upload failed' });
//     });
// };
// Upload video to GridFS
exports.uploadReel = async (req, res) => {
    const { userId, caption, tags } = req.body;
  
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    const uploadStream = bucket.openUploadStream(`reel_${Date.now()}.mp4`, {
      contentType: req.file.mimetype,
    });
  
    const fileId = uploadStream.id;
  
    uploadStream.on('error', (err) => {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'Failed to upload file' });
    });
  
    uploadStream.on('finish', async () => {
      try {
        const newReel = new Reel({
          userId,
          fileId,
          caption,
          tags,
        });
  
        await newReel.save();
        res.status(201).json({ message: 'Reel uploaded successfully', reelId: newReel._id });
      } catch (err) {
        console.error('DB save error:', err);
        res.status(500).json({ error: 'Error saving to database' });
      }
    });
  
    // 🟢 END after attaching listeners
    uploadStream.end(req.file.buffer);
  };
      
  
// Random Reels
exports.getRandomReels = async (req, res) => {
  const reels = await Reel.aggregate([{ $sample: { size: 10 } }]);
  res.json(reels);
};

exports.getVideoStream = async (req, res) => {
    try {
      const fileId = new mongoose.Types.ObjectId(req.params.id);
      const db = mongoose.connection.db;
      const bucket = new GridFSBucket(db, { bucketName: 'reels' });
  
      const file = await db.collection('reels.files').findOne({ _id: fileId });
  
      // ⛔ If file not found or is empty, return 404
      if (!file || !file.length || file.length === 0) {
        return res.status(404).send('Video not found or file is empty');
      }
  
      const videoSize = file.length;
      const contentType = file.contentType || 'video/mp4';
      const range = req.headers.range;
  
      // 🧠 Handle Full Request
      if (!range) {
        res.set({
          'Content-Type': contentType,
          'Content-Length': videoSize,
          'Accept-Ranges': 'bytes',
        });
        return bucket.openDownloadStream(fileId).pipe(res);
      }
  
      // 🧠 Handle Partial Range Request
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
  
      // ⛔ Invalid range
      if (start >= videoSize || end >= videoSize) {
        return res.status(416).send('Requested range not satisfiable');
      }
  
      const chunkSize = end - start + 1;
  
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
      });
  
      bucket.openDownloadStream(fileId, { start, end: end + 1 }).pipe(res); // ✅ set both start and end
    } catch (err) {
      console.error('Video stream error:', err);
      res.status(500).json({ error: 'Video streaming failed' });
    }
  };
    