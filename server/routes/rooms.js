const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const { v4: uuidv4 } = require("uuid");

// POST /api/rooms/create
router.post("/create", async (req, res) => {
  try {
    const roomId = uuidv4().slice(0, 8).toUpperCase();
    const room = await Room.create({ roomId });
    res.status(201).json({
      success: true,
      roomId: room.roomId,
      createdAt: room.createdAt,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/rooms/:roomId
router.get("/:roomId", async (req, res) => {
  try {
    const room = await Room.findOne({
      roomId: req.params.roomId.toUpperCase(),
    });
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/rooms/join
router.post("/join", async (req, res) => {
  try {
    const { roomId } = req.body;
    if (!roomId) {
      return res.status(400).json({ success: false, message: "Room ID required" });
    }
    let room = await Room.findOne({ roomId: roomId.toUpperCase() });
    if (!room) {
      // Auto-create room if it doesn't exist
      room = await Room.create({ roomId: roomId.toUpperCase() });
    }
    // Update lastActive
    room.lastActive = Date.now();
    await room.save();

    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/rooms/stats/all  ← for analytics
router.get("/stats/all", async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const activeRooms = await Room.countDocuments({ isActive: true });
    res.json({ success: true, totalRooms, activeRooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;