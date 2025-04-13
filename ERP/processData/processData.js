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
  const formattedTime = log.timestamp.slice(0, 19);

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
    log_type: log.status === "0" ? "IN" : "OUT",
    device_id: log.employee_id.toString(),
    time: formattedTime,
    day: customDay,
    //Default location Data(if not require remove it)
    latitude: "26.4547555",
    longitude: "87.2727071",
  };
};

module.exports = processLogs;
