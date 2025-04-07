const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const reelController = require('../controllers/reelController');

router.post('/upload', upload.single('video'), reelController.uploadReel);
router.get('/random', reelController.getRandomReels);
router.get('/video/:id', reelController.getVideoStream);

module.exports = router;
