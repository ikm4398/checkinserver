// scripts/runPostMissing.js
const mongoose = require("mongoose");
require("dotenv").config();

const { postMissingData } = require("../ERP/postMissingData");
const connectDB = require("../config/dbConnection");

(async () => {
  try {
    await connectDB();
    console.log("Database connected");

    // Pass the employeeId (from device logs)
    const employeeId = process.argv[2]; // e.g. node scripts/runPostMissing.js 277

    if (!employeeId) {
      console.error("Please provide employeeId as argument");
      process.exit(1);
    }

    await postMissingData(employeeId);

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
