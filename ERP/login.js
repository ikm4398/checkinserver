const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
require("dotenv").config();

const jar = new CookieJar();
const axiosInstance = wrapper(
  axios.create({
    jar,
    timeout: 10000, // Set timeout to 10 seconds (adjust as needed)
  })
);
const USERNAME = process.env.ERP_USERNAME;
const PASSWORD = process.env.ERP_PASSWORD;
const API_URL = process.env.API_URL;

let authToken = null;
let lastLoginTime = null;
const TOKEN_EXPIRY = 59 * 60 * 1000; // 59 minutes (ERPNext session expiry)

const MAX_RETRIES = 3;
let attempts = 0;

async function login() {
  // If authToken exists and is still valid, reuse it
  if (authToken && lastLoginTime && Date.now() - lastLoginTime < TOKEN_EXPIRY) {
    return { authToken };
  }

  const url = `${API_URL}/api/method/login`;
  const credentials = { usr: USERNAME, pwd: PASSWORD };

  while (attempts < MAX_RETRIES) {
    try {
      const response = await axiosInstance.post(url, credentials);
      const cookies = response.headers["set-cookie"];

      if (cookies) {
        const sidCookie = cookies.find((cookie) => cookie.startsWith("sid="));
        if (sidCookie) {
          authToken = sidCookie.split(";")[0]; // Extract sid
          lastLoginTime = Date.now();
          console.log("Logged in successfully. New authToken:", authToken);
        }
      }

      return { authToken };
    } catch (error) {
      attempts++;
      console.log(`Login attempt ${attempts} failed`);

      // Log error details for debugging
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );

      if (attempts === MAX_RETRIES) {
        throw new Error("Login failed after multiple attempts");
      }

      // Retry after a short delay
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Retry after 1 second
    }
  }
}

module.exports = { login, authToken };
