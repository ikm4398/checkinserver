// module.exports = router;
const express = require("express");
const { writeLog, attendanceLogFilePath } = require("../logger/logger");
const { saveAttendance } = require("../services/saveAttendance");
const router = express.Router();

// Handle POST /iclock/cdata (Device sending attendance logs)
router.post("/iclock/cdata", async (req, res) => {
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const queryParams = req.query;
  const device = queryParams.SN;
  let rawData = "";

  req.on("data", (chunk) => {
    rawData += chunk;
  });

  req.on("end", async () => {
    try {
      if (rawData.trim() !== "") {
        const rawLogs = rawData.split("\n");

        for (const logLine of rawLogs) {
          if (logLine.trim() !== "") {
            const logFields = logLine.split("\t");
            if (logFields.length >= 2) {
              const attendanceLog = {
                device,
                employeeId: logFields[0],
                timestamp: logFields[1],
                status: logFields[2],
              };

              // Save to database
              await saveAttendance(attendanceLog);

              // Also write to log file (optional)
              writeLog(
                `Attendance log: ${JSON.stringify(attendanceLog, null, 2)}`,
                attendanceLogFilePath
              );
            } else {
              writeLog("Invalid raw data format.", attendanceLogFilePath);
            }
          }
        }
      }
      res.status(200).send("OK");
    } catch (error) {
      writeLog(
        `Error processing attendance data: ${error.message}`,
        attendanceLogFilePath
      );
      res.status(500).send("Internal Server Error");
    }
  });
});

module.exports = router;
