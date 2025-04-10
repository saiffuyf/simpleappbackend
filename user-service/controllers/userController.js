const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// User registration
exports.registerUser = async (req, res) => {
  // Validation checks
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    // const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username, profilePicture: newUser.profilePicture },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response
    res.status(201).json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        userId: user._id, 
        username: user.username,
        profilePicture: user.profilePicture || "" // Ensure it doesn't break if empty
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Send both token & user object
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        profilePicture: user.profilePicture || ""
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    let { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }

    // Filter only valid MongoDB ObjectIDs
    userIds = userIds.filter(id => typeof id === "string" && id.match(/^[0-9a-fA-F]{24}$/));

    if (userIds.length === 0) {
      return res.status(400).json({ message: "No valid user IDs provided" });
    }

    const users = await User.find({ _id: { $in: userIds } }).select("username profilePicture");

    // Convert to object with userId as key
    const userMap = {};
    users.forEach(user => {
      userMap[user._id] = {
        username: user.username,
        profilePicture: user.profilePicture || ""
      };
    });

    res.json(userMap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// Get all users except the current one
exports.getAllUsersExcept = async (req, res) => {
  try {
    const { currentUserId } = req.body;

    // Validate ID format
    if (!currentUserId || !currentUserId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Get all users excluding the current user
    const users = await User.find({ _id: { $ne: currentUserId } })
      .select("_id username profilePicture");

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
