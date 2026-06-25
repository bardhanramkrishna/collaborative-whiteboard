const rooms = {};
const chatHistory = {}; // { roomId: [messages] }

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Connected: ${socket.id}`);

    // ── join-room ──────────────────────────────────────────
    socket.on("join-room", ({ roomId, username }) => {
      socket.join(roomId);

      if (!rooms[roomId]) rooms[roomId] = {};
      rooms[roomId][socket.id] = username;

      if (!chatHistory[roomId]) chatHistory[roomId] = [];

      socket.to(roomId).emit("user-joined", {
        username,
        activeUsers: Object.values(rooms[roomId]),
      });

      socket.emit("active-users", {
        activeUsers: Object.values(rooms[roomId]),
      });

      // Send last 50 chat messages to the joining user
      socket.emit("chat-history", chatHistory[roomId].slice(-50));

      // System message
      const joinMsg = {
        type: "system",
        message: `${username} joined the room`,
        time: new Date().toISOString(),
      };

      chatHistory[roomId].push(joinMsg);
      io.to(roomId).emit("chat-message", joinMsg);

      console.log(`👤 ${username} joined room ${roomId}`);
    });

    // ── draw ──────────────────────────────────────────────
    socket.on("draw", (data) => {
      socket.to(data.roomId).emit("drawing-update", data);
    });

    // ── shape-draw ────────────────────────────────────────
    socket.on("shape-draw", (data) => {
      socket.to(data.roomId).emit("drawing-update", data);
    });

    // ── erase ─────────────────────────────────────────────
    socket.on("erase", (data) => {
      socket.to(data.roomId).emit("drawing-update", data);
    });

    // ── undo ──────────────────────────────────────────────
    socket.on("undo", ({ roomId }) => {
      socket.to(roomId).emit("undo");
    });

    // ── redo ──────────────────────────────────────────────
    socket.on("redo", ({ roomId }) => {
      socket.to(roomId).emit("redo");
    });

    // ── clear-board ───────────────────────────────────────
    socket.on("clear-board", ({ roomId }) => {
      io.to(roomId).emit("board-cleared");
    });

    // ── cursor-move ───────────────────────────────────────
    socket.on("cursor-move", ({ roomId, x, y, username }) => {
      socket.to(roomId).emit("cursor-update", {
        socketId: socket.id,
        x,
        y,
        username,
      });
    });

    // ── chat-message ──────────────────────────────────────
    socket.on("chat-message", ({ roomId, username, message, time }) => {
      console.log(`💬 [${roomId}] ${username}: ${message}`);

      const msg = {
        type: "user",
        username,
        message,
        time,
      };

      if (!chatHistory[roomId]) {
        chatHistory[roomId] = [];
      }

      chatHistory[roomId].push(msg);

      // Keep only last 200 messages
      if (chatHistory[roomId].length > 200) {
        chatHistory[roomId].shift();
      }

      io.to(roomId).emit("chat-message", msg);
    });

    // ── disconnect ────────────────────────────────────────
    socket.on("disconnect", () => {
      for (const roomId in rooms) {
        if (rooms[roomId][socket.id]) {
          const username = rooms[roomId][socket.id];

          delete rooms[roomId][socket.id];

          if (Object.keys(rooms[roomId]).length === 0) {
            delete rooms[roomId];
          } else {
            const leaveMsg = {
              type: "system",
              message: `${username} left the room`,
              time: new Date().toISOString(),
            };

            if (chatHistory[roomId]) {
              chatHistory[roomId].push(leaveMsg);
            }

            io.to(roomId).emit("chat-message", leaveMsg);

            socket.to(roomId).emit("user-left", {
              username,
              activeUsers: Object.values(rooms[roomId] || {}),
            });
          }

          console.log(`👋 ${username} left`);
          break;
        }
      }
    });
  });
};