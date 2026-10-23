import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import requestRouter from "./routes/requestRoutes.js";
import { Server } from "socket.io";

// Create Express app and Http server
const app = express();
const server = http.createServer(app);

// Initialize socket.io server
export const io = new Server(server, {
  cors: { origin: "*" },
});

// Store online users
export const userSocketMap = {}; // {userId:socketId}

// socket io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Emit online users to all users

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Route setup

app.get("/", (req, res) => res.json({ status: "ok", message: "ChitChat Backend API is live" }));
app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is live",
    env: {
      hasSupabaseUrl: Boolean(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
      hasSupabaseKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY),
      hasJwtSecret: Boolean(process.env.JWT_SECRET),
      hasCloudinary: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
    }
  });
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/requests", requestRouter);

// Initialize Supabase DB client
await connectDB();

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, ()=> console.log("Server is running on PORT:" + PORT));
}

// Export Express app for Vercel serverless function
export default app;