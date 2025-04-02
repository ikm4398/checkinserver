const express = require("express");
const moment = require("moment");
const { writeLog } = require("../logger/logger");

const router = express.Router();

// Handle GET /iclock/cdata (Device registration/options request)
router.get("/iclock/cdata", (req, res) => {
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  writeLog(`GET /iclock/cdata from ${clientIp}`);

  const response = `GetOption=1\nPushVersion=2.4.1\nLanguage=69\n`;
  res.status(200).send(response);
});

// Handle GET /iclock/getrequest (Device checking for commands)
router.get("/iclock/getrequest", (req, res) => {
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  //writeLog(`GET /iclock/getrequest from ${clientIp}`);

  res.status(200).send("OK");
});

// Endpoint to fetch the latest device activity
router.get("/device-status", (req, res) => {
  const now = Date.now();
  const timeSinceLastActivity = global.lastDeviceActivity
    ? (now - global.lastDeviceActivity) / 1000
    : null;

  const statusData = {
    lastActivityTimestamp: global.lastDeviceActivity
      ? moment(global.lastDeviceActivity).format("YYYY-MM-DD HH:mm:ss")
      : null,
    timeSinceLastActivity: timeSinceLastActivity
      ? `${timeSinceLastActivity.toFixed(2)} seconds ago`
      : "Device has not yet connected.",
  };

  res.status(200).json(statusData);
});

module.exports = router;
