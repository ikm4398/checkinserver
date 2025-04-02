const LastProcessed = require("../models/lastProcessed"); // Import model
const Attendance = require("../models/attendanceModel");

let lastProcessedId = null;

const fetchLastProcessedId = async () => {
  try {
    const data = await LastProcessed.findOne({});
    if (data) {
      lastProcessedId = data.lastProcessedId;
    } else {
      // If no record is found, set it to null
      lastProcessedId = null;
    }
  } catch (error) {
    console.error("Error fetching lastProcessedId:", error);
  }
};

const fetchAttendance = async () => {
  try {
    await fetchLastProcessedId(); // Fetch the last processed ID from the database

    let query = {};
    if (lastProcessedId) {
      query = { _id: { $gt: lastProcessedId } };
    }

    const logs = await Attendance.find(query).sort({ _id: 1 }).limit(100);

    if (logs.length > 0) {
      lastProcessedId = logs[logs.length - 1]._id;
      await updateLastProcessedId(lastProcessedId); // Update the database with the new lastProcessedId
    }

    return logs.map((log) => ({
      _id: log._id,
      device: log.device,
      employee_id: log.employeeId,
      timestamp: log.timestamp,
      status: log.status,
      recordedAt: log.recordedAt,
    }));
  } catch (error) {
    console.error("Error fetching attendance logs:", error);
    throw error;
  }
};

const updateLastProcessedId = async (newId) => {
  try {
    await LastProcessed.findOneAndUpdate(
      {},
      { lastProcessedId: newId },
      { upsert: true } // If no record exists, create one
    );
  } catch (error) {
    console.error("Error updating lastProcessedId:", error);
  }
};

module.exports = {
  fetchAttendance,
};
