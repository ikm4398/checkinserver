const axios = require("axios");
const { login } = require("./login"); // Import login function to get the token
const fs = require("fs");
const path = require("path");
const API_URL = process.env.API_URL;

const EMPLOYEE_FILE_PATH = path.join(
  __dirname,
  "employeeData",
  "employeeMap.json"
);

// Ensure the directory exists
if (!fs.existsSync(path.dirname(EMPLOYEE_FILE_PATH))) {
  fs.mkdirSync(path.dirname(EMPLOYEE_FILE_PATH), { recursive: true });
}

// Ensure the file exists
if (!fs.existsSync(EMPLOYEE_FILE_PATH)) {
  fs.writeFileSync(EMPLOYEE_FILE_PATH, JSON.stringify([]));
}

let lastEmployeeData = JSON.parse(fs.readFileSync(EMPLOYEE_FILE_PATH, "utf-8"));

async function fetchAndLogEmployees() {
  const { authToken } = await login();

  const url = `${API_URL}/api/resource/Employee?fields=["employee", "employee_name", "status", "attendance_device_id"]`;

  //console.log("Fetching employee data from:", url);
  //console.log("token", authToken);

  try {
    const response = await axios.get(url, { headers: { Cookie: authToken } });
    //console.log("Employee data fetched successfully.");

    const employees = response.data.data;

    const newEmployeeData = employees
      .filter((emp) => emp.status === "Active" && emp.attendance_device_id)
      .map((emp) => ({
        employee: emp.employee,
        employee_name: emp.employee_name,
        device_id: parseInt(emp.attendance_device_id),
      }));

    //console.log(
    //`Filtered ${newEmployeeData.length} active employees with a device ID.`
    //);

    // Only update if data changed
    if (JSON.stringify(lastEmployeeData) !== JSON.stringify(newEmployeeData)) {
      console.log("Employee data has changed. Updating file...");

      fs.writeFileSync(
        EMPLOYEE_FILE_PATH,
        JSON.stringify(newEmployeeData, null, 2)
      );
      lastEmployeeData = newEmployeeData;

      console.log("Employee data updated");

      return { updated: true, data: newEmployeeData };
    }

    //console.log("No changes in employee data.");
    return { updated: false, data: lastEmployeeData };
  } catch (error) {
    console.error(
      "Error fetching employees:",
      error.response?.data || error.message
    );
    throw error;
  }
}

module.exports = { fetchAndLogEmployees };
