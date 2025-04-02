const fs = require("fs");
const moment = require("moment");

const logFilePath = "./logs/device-logs.txt";
const attendanceLogFilePath = "./logs/attendance-logs.txt";

// Function to write logs to a file
const writeLog = (message, logFile = logFilePath) => {
  const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim());
  fs.appendFileSync(logFile, logMessage);
};

module.exports = { writeLog, logFilePath, attendanceLogFilePath };
