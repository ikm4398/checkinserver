// ERP/postMissingData.js

const Attendance = require("../models/attendanceModel");
const processLogs = require("./processData/processData");
const { postData } = require("./postData");
const { login } = require("./login");

/**
 * Post missing check-in/out logs for a specific employee from MongoDB to ERPNext
 * @param {string} employeeId - The device employeeId (from Attendance model)
 */
async function postMissingData(employeeId) {
  try {
    await login();

    const logs = await Attendance.find({ employeeId }).sort({ timestamp: 1 });

    if (!logs || logs.length === 0) {
      console.log(`No logs found in DB for employeeId: ${employeeId}`);
      return;
    }

    console.log(`Found ${logs.length} logs for employeeId: ${employeeId}`);

    for (const log of logs) {
      // 🟢 Adapt DB record to match processData.js expected format
      const adaptedLog = {
        employee_id: log.employeeId, // processData.js expects employee_id
        timestamp: log.timestamp,
        status: log.status,
      };

      const processedLog = processLogs(adaptedLog);

      if (!processedLog) {
        console.warn(
          `Skipping log at ${log.timestamp} (employee not mapped in employeeMap.json)`
        );
        continue;
      }

      await postData(processedLog);
    }

    console.log(`Finished posting logs for employeeId: ${employeeId}`);
  } catch (error) {
    console.error("Error in postMissingData:", error.message);
  }
}

module.exports = { postMissingData };
