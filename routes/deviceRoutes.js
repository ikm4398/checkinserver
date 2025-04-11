const express = require("express");
const moment = require("moment-timezone");
const { writeLog } = require("../logger/logger");

const router = express.Router();

// Track last time update
let lastTimeUpdate = null;
const TIME_UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Handle GET /iclock/cdata (Device registration/options request)
router.get("/iclock/cdata", (req, res) => {
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  writeLog(`GET /iclock/cdata from ${clientIp}`);

  // Add timezone information in response
  const response = `GetOption=1\nPushVersion=2.4.1\nLanguage=69\nTimeZone=345\n`; // 345 minutes = +5:45
  res.status(200).send(response);
});

// Set Nepal local time in attendance device
router.get("/iclock/getrequest", (req, res) => {
  try {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const now = Date.now();

    // Only send time update if:
    // 1. Never sent before, OR
    // 2. More than 24 hours since last update
    if (!lastTimeUpdate || now - lastTimeUpdate > TIME_UPDATE_INTERVAL) {
      const nepalTime = moment()
        .tz("Asia/Kathmandu")
        .format("YYYY-MM-DD HH:mm:ss");
      const timeCommand = `TIME ${nepalTime}`;
      lastTimeUpdate = now;
      writeLog(`Sent time update to device: ${nepalTime}`);
      return res.status(200).send(timeCommand);
    }

    // Default response when no time update is needed
    res.status(200).send("OK");
  } catch (error) {
    writeLog(`Error in getrequest: ${error.message}`);
    res.status(500).send("ERROR");
  }
});

module.exports = router;
