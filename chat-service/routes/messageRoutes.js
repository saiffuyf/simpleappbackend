const express = require("express");
const router = express.Router();
const { getChatHistory,sendMessage } = require("../controllers/messageController");

router.get("/chat/:userId1/:userId2", getChatHistory);
router.post("/chat", sendMessage);

module.exports = router;
