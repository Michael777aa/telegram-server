// server.js
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: "./.env" });

// Load Express app
const app = require("./app");

// Create HTTP server ONCE
const server = http.createServer(app);

// ============ SOCKET.IO CONFIG ============
const io = socketIO(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://telegram-clone-inky.vercel.app",
      /\.vercel\.app$/,
      /\.onrender\.com$/,
      /\.localhost(:[0-9]+)?$/
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Import socket controllers
const {
  callRequestController,
  callAcceptedController,
  endCallController,
  callDeniedController,
} = require("./socketControllers/callController");

const {
  onlineController,
  offlineController,
  disconnectingController,
  joinRoomController,
} = require("./socketControllers/connectionController");

const {
  messagingController,
  markMessageReadController,
} = require("./socketControllers/messageController");

const {
  typingController,
  recordingcontroller,
  clearChatRoomController,
} = require("./socketControllers/userActionController");

// ============ SOCKET.IO EVENTS ============
io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // Connection controllers
  onlineController(io, socket);
  offlineController(io, socket);
  disconnectingController(io, socket);
  joinRoomController(io, socket);

  // User actions
  typingController(io, socket);
  recordingcontroller(io, socket);
  clearChatRoomController(io, socket);

  // Messaging
  messagingController(io, socket);
  markMessageReadController(io, socket);

  // Calls
  callRequestController(io, socket);
  callAcceptedController(io, socket);
  endCallController(io, socket);
  callDeniedController(io, socket);

  socket.on("test", (d) => {
    socket.emit("testResponse", { ok: true, data: d });
  });

  socket.onAny((event, ...args) => {
    if (event !== "heartbeat") {
      console.log(`📡 [${event}]`, args[0]);
    }
  });
});

// ============ MONGO CONNECTION ============
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err.message));

// ============ SERVE CLIENT (SPA) ============
const clientPath = path.join(__dirname, "client", "build");
app.use(express.static(clientPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// ============ START SERVER ============
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 WebSocket Ready`);
});

module.exports = { io, server, app };
