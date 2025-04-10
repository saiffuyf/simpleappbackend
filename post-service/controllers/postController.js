const Post = require("../models/Post");
const { validationResult, body } = require("express-validator");
const multer = require("multer");
const path = require("path");
// Multer setup for file uploads
// **const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

const storage = multer.memoryStorage(); // Store image in memory
const upload = multer({ storage });


// **const upload = multer({ storage });

// Validation rules
const validatePost = [
  body("userId").notEmpty().withMessage("User ID is required"),
  body("username").notEmpty().withMessage("Username is required"),
  body("caption").isLength({ max: 500 }).withMessage("Caption cannot exceed 500 characters"),
];
 
exports.createPost = async (req, res) => {
  console.log("🔍 Received Request Body:", req.body);
  console.log("📸 Received File:", req.file);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  const { userId, username, profilePicture, caption } = req.body;

  try {
    const newPost = new Post({
      userId,
      username,
      profilePicture,
      caption,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log("📨 Page:", page);
    console.log("🔢 Limit:", limit);
    console.log("⏩ Skip:", skip);

    const totalPosts = await Post.countDocuments();

    // Add this log to verify if skip/limit works
    let posts = await Post.find()
      .skip(skip)
      .limit(limit);

    console.log(" Posts fetched from DB:", posts.length);

    // Shuffle posts
    for (let i = posts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [posts[i], posts[j]] = [posts[j], posts[i]];
    }

    const postsWithBase64 = posts.map((post) => {
      const imageBase64 = post.image?.data?.toString("base64");
      const imageUrl = imageBase64
        ? `data:${post.image.contentType};base64,${imageBase64}`
        : null;

      return {
        ...post._doc,
        imageUrl,
      };
    });

    res.json({
      posts: postsWithBase64,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    });
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });

    const postsWithImages = posts.map(post => {
      const postObj = post.toObject(); //Convert Mongoose doc to plain JS object

      if (postObj.image && postObj.image.data) {
        postObj.imageUrl = `data:${postObj.image.contentType};base64,${Buffer.from(postObj.image.data).toString('base64')}`;
      } else {
        postObj.imageUrl = '';
      }

      return postObj;
    });

    res.json(postsWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

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
      res.json({ likes: post.likes, message: likedIndex === -1 ? "Liked" : "Unliked" });

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
  