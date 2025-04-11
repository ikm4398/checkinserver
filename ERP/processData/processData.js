const employeeData = require("../employeeData/employeeMap.json"); // Import employee map directly
const processLogs = (log) => {
  console.log("Processing log:", log);

  // Find the employee based on device_id
  const employee = employeeData.find(
    (emp) => emp.device_id === parseInt(log.employee_id)
  );

  if (!employee) {
    console.warn(`No employee found for device_id: ${log.employee_id}`);
    return null;
  }

  // Convert timestamp without adjusting for timezone
  const timestamp = new Date(log.timestamp);

  // Use timestamp directly without adjusting it to the local timezone
  const formattedTime = log.timestamp.slice(0, 19); // Use log's original timestamp format (e.g., 2025-04-08 17:25:16)

  // Array of day names for custom day conversion
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const customDay = dayNames[timestamp.getDay()];

  // Return processed log data with employee info, formatted time, and day
  return {
    employee: employee.employee,
    log_type: log.status === "0" ? "IN" : "OUT", // Log type based on status
    device_id: log.employee_id.toString(),
    time: formattedTime, // Use the exact timestamp from the log without timezone adjustment
    day: customDay, // Custom day name based on timestamp
    latitude: "26.4547555", // Default latitude
    longitude: "87.2727071", // Default longitude
  };
};

module.exports = processLogs;
