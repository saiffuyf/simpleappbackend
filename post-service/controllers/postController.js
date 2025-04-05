const Post = require("../models/Post");
const { validationResult, body } = require("express-validator");
const multer = require("multer");
const path = require("path");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Validation rules
const validatePost = [
  body("userId").notEmpty().withMessage("User ID is required"),
  body("username").notEmpty().withMessage("Username is required"),
  body("caption").isLength({ max: 500 }).withMessage("Caption cannot exceed 500 characters"),
];

// Create a new post
exports.createPost = async (req, res) => {
    console.log("🔍 Received Request Body:", req.body);
    console.log("📸 Received File:", req.file);
  
    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }
  
    const { userId, username, profilePicture, caption } = req.body;
    // const imageUrl = `/uploads/${req.file.filename}`; // Store file path ***
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  
    try {
      const newPost = new Post({
        userId,
        username,
        profilePicture,
        imageUrl,
        caption
      });
  
      await newPost.save();
      res.status(201).json(newPost);
    } catch (error) {
      console.error(" Error creating post:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
// Get all posts ***
// exports.getAllPosts = async (req, res) => {
//   try {
//     const posts = await Post.find().sort({ createdAt: -1 });
//     res.json(posts);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.getAllPosts = async (req, res) => {
    try {
      let posts = await Post.find();
      
      // Shuffle posts randomly (Fisher-Yates Algorithm)
      for (let i = posts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [posts[i], posts[j]] = [posts[j], posts[i]];
      }
  
      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };


// Get posts by a specific user
exports.getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.likePost = async (req, res) => {
//     try {
//         const { id } = req.params; // Get post ID from URL
//         const post = await Post.findById(id);

//         if (!post) {
//             return res.status(404).json({ message: "Post not found" });
//         }

//         post.likes += 1; // Increment likes
//         await post.save(); // Save updated post

//         res.json({ message: "Post liked!", likes: post.likes });
//     } catch (error) {
//         console.error("Error liking post:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };
exports.likePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId } = req.body; // Get the user ID from the request
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      const likedIndex = post.likes.indexOf(userId);
  
      if (likedIndex === -1) {
        // User hasn't liked the post yet, so add like
        post.likes.push(userId);
      } else {
        // User already liked the post, so remove like
        post.likes.splice(likedIndex, 1);
      }
  
      await post.save();
      res.json({ likes: post.likes.length, message: likedIndex === -1 ? "Liked" : "Unliked" });
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  exports.addComment = async (req, res) => {
    const { postId } = req.params;
    const { userId, username, text } = req.body;
  
    if (!text) return res.status(400).json({ message: "Comment text is required" });
  
    try {
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      post.comments.push({ userId, username, text });
      await post.save();
  
      res.status(200).json(post);
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  