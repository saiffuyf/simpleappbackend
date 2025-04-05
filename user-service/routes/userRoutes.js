const express = require('express');
const { registerUser, loginUser, getUsers } = require('../controllers/userController');
const userValidation = require('../validations/userValidation');
const User = require("../models/User");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require('multer');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Setup storage FIRST
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// ✅ Define `upload` BEFORE using it
const upload = multer({ storage });

// ✅ Register routes AFTER upload is defined
router.post('/register', userValidation, registerUser);
router.post('/login', loginUser);
router.post('/getUsers', getUsers);

router.get('/:userID', async (req, res) => {
  try {
    const user = await User.findById(req.params.userID).select('username profilePicture');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ username: user.username, profilePicture: user.profilePicture });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:userId', upload.single("profilePicture"), async (req, res) => {
  try {
    const { userId } = req.params;
    const { username } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (req.file) {
      updateData.profilePicture = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('username profilePicture');
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete('/:userId/profile-picture', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.profilePicture) {
      return res.status(404).json({ message: "User or profile picture not found" });
    }

    const filename = user.profilePicture.split("/uploads/")[1];
    const filePath = path.join(__dirname, "..", "uploads", filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    user.profilePicture = "";
    await user.save();

    res.json({ message: "Profile picture deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile picture:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


