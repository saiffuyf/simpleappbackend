const Message = require("../models/Message");

exports.getChatHistory = async (req, res) => {
  const { userId1, userId2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
exports.sendMessage = async (req, res) => {
    const { sender, receiver, message } = req.body;
  
    if (!sender || !receiver || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
      const newMessage = new Message({
        sender,
        receiver,
        message,
        participants: [sender, receiver], // optional if you're storing this
        timestamp: new Date()
      });
  
      await newMessage.save();
  
      res.status(201).json(newMessage);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to send message" });
    }
  };
  
