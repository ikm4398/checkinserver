const mongoose = require("mongoose");
const { writeLog } = require("../logger/logger");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    writeLog("MongoDB connected successfully");
  } catch (err) {
    writeLog(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
