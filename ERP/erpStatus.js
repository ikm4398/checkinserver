const axios = require("axios");
const { login } = require("./login");
const API_URL = process.env.API_URL;

async function isErpOnline() {
  try {
    const { authToken } = await login();
    const url = `${API_URL}/api/method/frappe.ping`; // Use frappe.ping for reliability
    const response = await axios.get(url, {
      headers: {
        Cookie: authToken,
        Expect: null, // Disable Expect header to avoid 417 error
      },
    });
    console.log(
      `ERP status check: ${
        response.status
      } from ${url}, response: ${JSON.stringify(response.data)}`
    );
    return response.status === 200 && response.data.message === "pong";
  } catch (error) {
    console.error("ERP status check failed:", {
      message: error.message,
      status: error.response ? error.response.status : null,
      url: error.config ? error.config.url : null,
    });
    return false;
  }
}

module.exports = { isErpOnline };
