const { fetchAttendance } = require("../../services/fetchAttendance");
const processLogs = require("./processData");
const { postData } = require("../postData");

async function fetchAndProcessAttendance() {
  try {
    //console.log("Checking for new attendance logs...");

    const logs = await fetchAttendance();

    if (logs.length === 0) {
      //console.log("No new attendance logs found.");
      return;
    }

    console.log(`Found ${logs.length} new attendance logs to process`);

    // Process each log and post if valid
    for (const log of logs) {
      const processedLog = processLogs(log);
      if (processedLog) {
        await postData(processedLog);
      }
    }
  } catch (error) {
    console.error("Error processing attendance logs:", error.message);
  }
}

module.exports = { fetchAndProcessAttendance };
