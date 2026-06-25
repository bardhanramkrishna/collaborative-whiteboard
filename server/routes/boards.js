const express = require("express");
const router = express.Router();
const Board = require("../models/Board");

// POST /api/boards/save
router.post("/save", async (req, res) => {
  try {
    const { roomId, drawings } = req.body;
    if (!roomId) {
      return res.status(400).json({ success: false, message: "Room ID required" });
    }

    const board = await Board.findOneAndUpdate(
      { roomId: roomId.toUpperCase() },
      { drawings, updatedAt: Date.now() },
      { upsert: true, new: true }
    );

    res.json({ success: true, board });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/boards/:roomId
router.get("/:roomId", async (req, res) => {
  try {
    const board = await Board.findOne({
      roomId: req.params.roomId.toUpperCase(),
    });
    if (!board) {
      return res.json({ success: true, drawings: [] });
    }
    res.json({ success: true, drawings: board.drawings, updatedAt: board.updatedAt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/boards/stats/all  ← for analytics
router.get("/stats/all", async (req, res) => {
  try {
    const totalBoards = await Board.countDocuments();
    const totalDrawings = await Board.aggregate([
      { $project: { count: { $size: "$drawings" } } },
      { $group: { _id: null, total: { $sum: "$count" } } },
    ]);
    res.json({
      success: true,
      totalBoards,
      totalDrawings: totalDrawings[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;