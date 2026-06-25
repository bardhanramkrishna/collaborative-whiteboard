const mongoose = require("mongoose");

const drawingSchema = new mongoose.Schema({
  tool: String,           // pen, line, rect, circle, arrow, eraser
  color: String,
  brushSize: Number,
  points: Array,          // for freehand
  startX: Number,
  startY: Number,
  endX: Number,
  endY: Number,
  timestamp: { type: Date, default: Date.now },
});

const boardSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  drawings: [drawingSchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Board", boardSchema);