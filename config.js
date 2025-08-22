require('dotenv').config();

module.exports = {
  // Base URL for the application
  BASE_URL: process.env.BASE_URL || 'https://lengkeng-dev.hocai.fun',
  
  // Authentication credentials
  AUTH: {
    USERNAME: process.env.AUTH_USERNAME || 'admini',
    PASSWORD: process.env.AUTH_PASSWORD || 'admin123'
  },
  
  // Test configuration
  TEST: {
    TIMEOUT: parseInt(process.env.TEST_TIMEOUT) || 15000,
    RETRY_ATTEMPTS: parseInt(process.env.RETRY_ATTEMPTS) || 1
  },
  
  // API endpoints
  ENDPOINTS: {
    LOGIN: '/login',
    USERS: '/users'
  }
};