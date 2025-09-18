
const axios = require("axios");
const { login } = require("./login");
const API_URL = process.env.API_URL;

async function checkExistingCheckin(employee, timestamp) {
  const { authToken } = await login();
  const url = `${API_URL}/api/resource/Employee Checkin?filters=[["employee", "=", "${employee}"], ["time", "=", "${timestamp}"]]`;

  try {
    const response = await axios.get(url, {
      headers: {
        Cookie: authToken,
        Expect: null, // Disable Expect header
      },
    });
    return response.data.data.length > 0;
  } catch (error) {
    console.error("Error checking existing check-in:", error.message);
    return false;
  }
}

async function postData(data) {
  const { authToken } = await login();
  const { employee, time } = data;

  if (await checkExistingCheckin(employee, time)) {
    console.log("Check-in already exists, skipping.");
    return;
  }

  const url = `${API_URL}/api/resource/Employee Checkin`;
  const headers = {
    "Content-Type": "application/json",
    Cookie: authToken,
    Expect: null, // Disable Expect header
  };

  try {
    console.log(`Posting data: ${JSON.stringify(data)}`);
    const response = await axios.post(url, data, { headers });
    console.log("Post successful:", response.data);
  } catch (error) {
    console.error("Error posting data:", error.message);
  }
}

module.exports = { postData };
