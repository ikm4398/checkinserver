const employeeData = require("../employeeData/employeeMap.json"); // Import employee map directly

const processLogs = (log) => {
  console.log("Processing log:", log);

  const employee = employeeData.find(
    (emp) => emp.device_id === parseInt(log.employee_id)
  );

  if (!employee) {
    console.warn(`No employee found for device_id: ${log.employee_id}`);
    return null;
  }

  // Convert timestamp and adjust for timezone (3.5 hours)
  const timestamp = new Date(log.timestamp);
  timestamp.setHours(timestamp.getHours() + 3);
  timestamp.setMinutes(timestamp.getMinutes() + 30);

  const formattedTime = timestamp.toISOString().replace("T", " ").slice(0, 19);
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

  return {
    employee: employee.employee,
    log_type: log.status === "0" ? "IN" : "OUT",
    device_id: log.employee_id.toString(),
    time: formattedTime,
    custom_day: customDay,
  };
};

module.exports = processLogs;
