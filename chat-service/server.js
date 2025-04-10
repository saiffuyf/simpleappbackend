const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const messageRoutes = require("./routes/messageRoutes");
const setupChat = require("./sockets/chatSocket");
const cors = require('cors');

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});
app.use(cors({
  origin: 'https://texus.onrender.com',
  credentials: true
}));

// app.use(cors())

// Connect DB
connectDB();

app.use(express.json());
app.use("/api", messageRoutes);

// Setup Socket.IO
setupChat(io);

const PORT = process.env.PORT || 5008;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
