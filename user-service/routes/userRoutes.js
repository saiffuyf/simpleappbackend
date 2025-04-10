const express = require('express');
const { registerUser, loginUser, getUsers,getAllUsersExcept } = require('../controllers/userController');
const userValidation = require('../validations/userValidation');
const User = require("../models/User");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require('multer');

// ✅ Define `upload` BEFORE using it
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Register routes AFTER upload is defined
router.post('/register', userValidation, registerUser);
router.post('/login', loginUser);
router.post('/getUsers', getUsers);
router.post('/getAllExceptMe', getAllUsersExcept);

router.get("/:userID", async (req, res) => {
  try {
    const user = await User.findById(req.params.userID).select("username profilePicture");
    if (!user) return res.status(404).json({ message: "User not found" });

    const profilePicture = user.profilePicture?.data
      ? `data:${user.profilePicture.contentType};base64,${user.profilePicture.data.toString("base64")}`
      : "";

    res.json({
      username: user.username,
      profilePicture
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:userId", upload.single("profilePicture"), async (req, res) => {
  try {
    const { userId } = req.params;
    const { username } = req.body;

    const updateData = {};
    if (username) updateData.username = username;

    if (req.file) {
      updateData.profilePicture = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("username profilePicture");
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
    if (!user || !user.profilePicture?.data) {
      return res.status(404).json({ message: "User or profile picture not found" });
    }

    user.profilePicture = undefined;
    await user.save();

    res.json({ message: "Profile picture deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile picture:", error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;


