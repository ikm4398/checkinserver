const mongoose = require("mongoose");
const moment = require("moment");

const attendanceSchema = new mongoose.Schema({
  device: { type: String, required: true },
  employeeId: { type: String, required: true },
  timestamp: { type: String, required: true }, 
  status: { type: String, required: true },
  recordedAt: { type: Date, default: Date.now }, 
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
