const express = require("express");
const moment = require("moment");
const { writeLog } = require("./logger/logger");
const deviceRoutes = require("./routes/deviceRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const connectDB = require("./config/dbConnection");
const { login } = require("./ERP/login");
const { fetchAndLogEmployees } = require("./ERP/fetchEmployee");
const {
  fetchAndProcessAttendance,
} = require("./ERP/processData/fetchAndProcessAttendance");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const IP_ADDRESS = process.env.IP_ADDRESS || "0.0.0.0";
const PORT = process.env.PORT || 5001;

// Connect to database
connectDB();

// Variable to track last device activity
let lastDeviceActivity = null;
global.lastDeviceActivity = lastDeviceActivity;

// Middleware to log all incoming requests
app.use((req, res, next) => {
  lastDeviceActivity = Date.now();
  global.lastDeviceActivity = lastDeviceActivity;

  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const logData = {
    timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
    clientIp,
    method: req.method,
    url: req.url,
  };
  next();
});

// Use modular routes
app.use("/", deviceRoutes);
app.use("/", attendanceRoutes);

// chech checkin data in every 5 sec
setInterval(async () => {
  try {
    await fetchAndProcessAttendance();
  } catch (error) {
    console.error("Error in attendance processing interval:", error);
  }
}, 5000); // 5 sec in milliseconds

//check employee data in 1 day
setInterval(async () => {
  try {
    await fetchAndLogEmployees();
  } catch (error) {
    console.error("Error in attendance processing interval:", error);
  }
}, 24 * 60 * 60 * 1000); // 1 day in milliseconds

// Start the server
app.listen(PORT, IP_ADDRESS, async () => {
  writeLog(`Server is running on http://${IP_ADDRESS}:${PORT}`);
  try {
    //login to erp
    await login();
    console.log("Logged in successfully");
    // fetch employee data
    await fetchAndLogEmployees();
    console.log("Initial employee data loaded");
    //fetch checkin data from database
    await fetchAndProcessAttendance();
  } catch (error) {
    console.error("Initialization error:", error);
    process.exit(1);
  }
});
