const mongoose = require("mongoose");

const CncSchema = new mongoose.Schema({
  position: {
    x: Number,
    y: Number,
    z: Number
  },
  state: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("CncData", CncSchema);