const fs = require("fs");
const moment = require("moment");

const logDirectory = "./logs";
const logFilePath = `${logDirectory}/device-logs.txt`;
const attendanceLogFilePath = `${logDirectory}/attendance-logs.txt`;

// Ensure the logs directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Function to write logs to a file
const writeLog = (message, logFile = logFilePath) => {
  const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim());
  fs.appendFileSync(logFile, logMessage);
};

module.exports = { writeLog, logFilePath, attendanceLogFilePath };
