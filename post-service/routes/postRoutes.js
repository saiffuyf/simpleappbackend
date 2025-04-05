const express = require("express");
const { createPost,addComment, getAllPosts, getPostsByUser,likePost } = require("../controllers/postController");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// router.post("/", upload.single("image"), createPost);
router.post("/create", upload.single("image"), createPost);
router.get("/all", getAllPosts);
router.get("/user/:userId", getPostsByUser);
// router.post("/like/:id", likePost);
router.post("/:postId/like", likePost);
router.post("/:postId/comments", addComment)


module.exports = router;
