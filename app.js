const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routers/authRouter");
const contactsRouter = require("./routers/contactsRouter");
const chatRoomRouter = require("./routers/chatRoomRouter");
const profileRouter = require("./routers/profileRouter");
const uploadRouter = require("./routers/uploadRouter");

const ReqError = require("./utilities/ReqError");
const errorController = require("./controllers/errorController");

const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// CORS (only once)
app.use(cors({
  origin: true,
  credentials: true,
}));

// Debug
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.originalUrl}`);
  next();
});

// PUBLIC ROUTES
app.get("/", (req, res) => res.json({ message: "Telegram Clone API" }));
app.use("/api/user", authRouter);

// AUTH MIDDLEWARE
const requireAuth = (req, res, next) => {
  const publicRoutes = [
    "/",
    "/api/test",
    "/api/health",
    "/api/user/login",
    "/api/user/register"
  ];
  
  if (publicRoutes.some(r => req.originalUrl.startsWith(r))) return next();
  if (!req.cookies.userId) return next(new ReqError(401, "Login required."));
  
  next();
};

app.use(requireAuth);

// PROTECTED ROUTES
app.use("/api/contacts", contactsRouter);
app.use("/api/profile", profileRouter);
app.use("/api/chatRoom", chatRoomRouter);
app.use("/api/upload", uploadRouter);

// ERROR HANDLER
app.use(errorController);

module.exports = app;
