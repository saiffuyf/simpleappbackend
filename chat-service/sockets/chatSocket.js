const Message = require("../models/Message");

function setupChat(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("private-message", async ({ senderId, receiverId, message }) => {
      const newMsg = await Message.create({ sender: senderId, receiver: receiverId, message });

      // Emit message to sender & receiver if online
      socket.to(receiverId).emit("new-message", newMsg);
      socket.emit("new-message", newMsg);
    });

    socket.on("join", (userId) => {
      socket.join(userId); // Join userId room for private messages
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

module.exports = setupChat;
