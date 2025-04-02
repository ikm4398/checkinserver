const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
require("dotenv").config();

const jar = new CookieJar();
const axiosInstance = wrapper(axios.create({ jar }));
const USERNAME = process.env.ERP_USERNAME;
const PASSWORD = process.env.ERP_PASSWORD;
const API_URL = process.env.API_URL;

let authToken = null;
let lastLoginTime = null;
const TOKEN_EXPIRY = 59 * 60 * 1000; // 59 minutes (ERPNext session expiry)


async function login() {
  // If authToken exists and is still valid, reuse it
  if (authToken && lastLoginTime && Date.now() - lastLoginTime < TOKEN_EXPIRY) {
    return { authToken };
  }

  const url = `${API_URL}/api/method/login`;
  const credentials = { usr: USERNAME, pwd: PASSWORD };

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
    console.error(
      "Login failed:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Login failed");
  }
}

module.exports = { login, authToken };
