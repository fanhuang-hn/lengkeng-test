const axios = require('axios');
const appConfig = require('../../config');

class AuthHelper {
  constructor(baseURL = appConfig.BASE_URL) {
    this.baseURL = baseURL;
    this.authToken = null;
    this.cookies = null;
  }

  async login(username = appConfig.AUTH.USERNAME, password = appConfig.AUTH.PASSWORD) {
    try {
      // First, try to get the login page to check for any CSRF tokens or form structure
      const loginPageResponse = await axios.get(`${this.baseURL}${appConfig.ENDPOINTS.LOGIN}`, {
        withCredentials: true,
        timeout: appConfig.TEST.TIMEOUT
      });

      // Extract cookies from the response
      const cookies = loginPageResponse.headers['set-cookie'];
      
      // Attempt login with credentials
      const loginResponse = await axios.post(`${this.baseURL}${appConfig.ENDPOINTS.LOGIN}`, {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          ...(cookies && { 'Cookie': cookies.join('; ') })
        },
        withCredentials: true,
        timeout: appConfig.TEST.TIMEOUT,
        validateStatus: function (status) {
          return status < 500; // Accept all statuses below 500
        }
      });

      // Store authentication data
      if (loginResponse.headers['set-cookie']) {
        this.cookies = loginResponse.headers['set-cookie'];
      }

      // Check if login was successful
      if (loginResponse.status === 200 || loginResponse.status === 302) {
        console.log('Login successful');
        return true;
      }

      throw new Error(`Login failed with status: ${loginResponse.status}`);
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  }

  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (this.cookies) {
      headers['Cookie'] = this.cookies.join('; ');
    }

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  async makeAuthenticatedRequest(method, url, data = null) {
    try {
      const requestConfig = {
        method,
        url: url.startsWith('http') ? url : `${this.baseURL}${url}`,
        headers: this.getAuthHeaders(),
        withCredentials: true,
        timeout: appConfig.TEST.TIMEOUT,
        validateStatus: function (status) {
          return status < 500; // Accept all statuses below 500
        }
      };

      if (data && (method.toLowerCase() === 'post' || method.toLowerCase() === 'put' || method.toLowerCase() === 'patch')) {
        requestConfig.data = data;
      }

      const response = await axios(requestConfig);
      return response;
    } catch (error) {
      console.error(`Request error for ${method} ${url}:`, error.message);
      throw error;
    }
  }
}

module.exports = AuthHelper;