require("dotenv").config();
const express    = require("express");
const http       = require("http");
const { Server } = require("socket.io");
const cors       = require("cors");
const connectDB  = require("./config/db");

const roomRoutes    = require("./routes/rooms");
const boardRoutes   = require("./routes/boards");
const socketHandler = require("./socket/socketHandler");

connectDB();

const app        = express();
const httpServer = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketHandler(io);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.use("/api/rooms",  roomRoutes);
app.use("/api/boards", boardRoutes);

// ── Root route ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "🎨 DrawTogether Backend is running!",
    status: "ok",
    version: "1.0.0",
    links: {
      health:     "https://collaborative-whiteboard-nk5s.onrender.com/api/health",
      frontend:   "https://drawtogether-frontend-5sd3.onrender.com",
    },
    endpoints: {
      health:      "GET  /api/health",
      createRoom:  "POST /api/rooms/create",
      getRoom:     "GET  /api/rooms/:roomId",
      joinRoom:    "POST /api/rooms/join",
      saveBoard:   "POST /api/boards/save",
      getBoard:    "GET  /api/boards/:roomId",
      roomStats:   "GET  /api/rooms/stats/all",
      boardStats:  "GET  /api/boards/stats/all",
    },
    timestamp: new Date().toISOString(),
  });
});

// ── Health check ───────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "All systems operational",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});