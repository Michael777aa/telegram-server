const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const authRouter = require("./routers/authRouter");
const contactsRouter = require("./routers/contactsRouter");
const chatRoomRouter = require("./routers/chatRoomRouter");
const profileRouter = require("./routers/profileRouter");
const uploadRouter = require("./routers/uploadRouter");
const ReqError = require("./utilities/ReqError");
const errorController = require("./controllers/errorController");

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
}));

// ========== ADDED TEST ROUTES ==========
// Public test route - no authentication required
app.get("/", (req, res) => {
  res.json({
    message: "Telegram Clone API is running 🚀",
    timestamp: new Date().toISOString(),
    endpoints: {
      test: "/api/test",
      health: "/api/health",
      public: "/api/public",
      status: "/api/status",
      user: "/api/user",
      contacts: "/api/contacts",
      profile: "/api/profile",
      chatRoom: "/api/chatRoom",
      upload: "/api/upload"
    },
    note: "Most endpoints require authentication"
  });
});

// Public test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API is working correctly! ✅",
    serverTime: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "Telegram Clone API",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// Public status endpoint
app.get("/api/public", (req, res) => {
  res.json({
    public: true,
    message: "This endpoint is publicly accessible",
    authRequired: false,
    cookies: req.cookies ? Object.keys(req.cookies) : []
  });
});

// Server status endpoint
app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    version: "1.0.0",
    features: {
      authentication: true,
      messaging: true,
      fileUpload: true,
      realTime: "WebSocket support"
    }
  });
});

// ========== AUTH MIDDLEWARE ==========
// Define auth middleware FIRST
const authMiddleware = (req, res, next) => {
  // Skip protection for public routes
  const publicRoutes = [
    "/api/test", 
    "/api/health", 
    "/api/public", 
    "/api/status",
    "/api/user/login",
    "/api/user/register",
    "/api/user/logout"
  ];
  
  const currentRoute = req.originalUrl.split('?')[0];
  
  // Check if current route is in publicRoutes
  const isPublicRoute = publicRoutes.some(route => currentRoute.startsWith(route));
  
  if (isPublicRoute) {
    return next();
  }
  
  if (!req.cookies.userId) {
    return next(new ReqError(401, "Authentication required. Please log in."));
  }
  next();
};

// ========== YOUR EXISTING ROUTES ==========
// Auth routes (public) - should come BEFORE auth middleware
app.use("/api/user", authRouter);

// Apply auth middleware to everything else
app.use(authMiddleware);

// Protected routes (require authentication)
app.use("/api/contacts", contactsRouter);
app.use("/api/profile", profileRouter);
app.use("/api/chatRoom", chatRoomRouter);
app.use("/api/upload", uploadRouter);

// Error handle middleware
app.use(errorController);

module.exports = app;