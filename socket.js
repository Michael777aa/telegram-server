// // server.js or index.js (your main server file)
// const express = require("express");
// const http = require("http");
// const socketIO = require("socket.io");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");

// dotenv.config({ path: "./.env" });

// // Create Express app
// const app = require("./app"); // Your app.js file

// // Create HTTP server
// const server = http.createServer(app);

// // Configure Socket.io with CORS
// const io = socketIO(server, {
//   cors: {
//     origin: [
//       "http://localhost:3000",
//       "https://telegram-clone-inky.vercel.app",
//       "https://telegram-server-1-o8qe.onrender.com",
//       /\.vercel\.app$/,
//       /\.onrender\.com$/,
//       /\.localhost(:[0-9]+)?$/,
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
//   },
//   transports: ["websocket", "polling"], // IMPORTANT for Render
//   pingTimeout: 60000,
//   pingInterval: 25000,
// });

// // Import socket controllers
// const {
//   callRequestController,
//   callAcceptedController,
//   endCallController,
//   callDeniedController,
// } = require("./socketControllers/callController");

// const {
//   onlineController,
//   offlineController,
//   disconnectingController,
//   joinRoomController,
// } = require("./socketControllers/connectionController");
// const {
//   messagingController,
//   markMessageReadController,
// } = require("./socketControllers/messageController");

// const {
//   typingController,
//   recordingcontroller,
//   clearChatRoomController,
// } = require("./socketControllers/userActionController");

// // Socket.io connection handling
// io.on("connection", async (socket) => {
//   console.log(`🔌 New socket connection: ${socket.id}`);
//   console.log(`🌍 Origin: ${socket.handshake.headers.origin}`);
//   console.log(`🍪 Cookies: ${JSON.stringify(socket.handshake.headers.cookie)}`);
  
//   // -------------Connection controls -------------- //
//   onlineController(io, socket);
//   offlineController(io, socket);
//   disconnectingController(io, socket);
//   joinRoomController(io, socket);
//   //--------------------------------------------------//

//   // -------------User Action controls -------------- //
//   typingController(io, socket);
//   recordingcontroller(io, socket);
//   clearChatRoomController(io, socket);
//   //--------------------------------------------------//

//   // -------------Message controls -------------- //
//   messagingController(io, socket);
//   markMessageReadController(io, socket);
//   //--------------------------------------------------//

//   // ----------------- Call controls --------------- //
//   callRequestController(io, socket);
//   callAcceptedController(io, socket);
//   endCallController(io, socket);
//   callDeniedController(io, socket);
//   //--------------------------------------------------//

//   // Debug: Echo back for testing
//   socket.on("test", (data) => {
//     console.log("🧪 Test event received:", data);
//     socket.emit("testResponse", { 
//       message: "Test successful", 
//       data,
//       timestamp: new Date().toISOString()
//     });
//   });

//   socket.on("message", (data) => {
//     console.log("📨 Message event received:", data);
//   });

//   socket.onAny((event, ...args) => {
//     if (event !== 'heartbeat') { // Filter out heartbeat logs
//       console.log(`📡 Socket event [${socket.id}]: ${event}`, args.length > 0 ? args[0] : '');
//     }
//   });
// });

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ Database connected successfully"))
//   .catch((error) => {
//     console.log("❌ MongoDB connection error:", error.message);
//   });

// // Start server
// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`🔌 Socket.io ready`);
//   console.log(`🌐 HTTP: http://localhost:${PORT}`);
//   console.log(`🔗 WebSocket: ws://localhost:${PORT}`);
//   console.log(`🌍 Production WebSocket: wss://telegram-server-1-o8qe.onrender.com`);
// });

// // Export for testing or other modules
// module.exports = { io, server, app };