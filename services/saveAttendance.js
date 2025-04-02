const Attendance = require("../models/attendanceModel");
const { writeLog, attendanceLogFilePath } = require("../logger/logger");



const saveAttendance = async (attendanceData) => {
  try {
    const attendance = new Attendance({
      ...attendanceData,
      timestamp: attendanceData.timestamp,
    });

    await attendance.save();

    writeLog(
      `Attendance saved to DB: ${JSON.stringify(attendance)}`,
      attendanceLogFilePath
    );
    return attendance;
  } catch (error) {
    writeLog(
      `Error saving attendance: ${error.message}`,
      attendanceLogFilePath
    );
    throw error;
  }
};

module.exports = {
  saveAttendance,
};
