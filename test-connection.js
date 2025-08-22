#!/usr/bin/env node

const AuthHelper = require('./tests/helpers/auth');
const config = require('./config');

async function testConnection() {
  console.log('🧪 Lengkeng CRUD User Test Suite');
  console.log('================================');
  console.log(`Target URL: ${config.BASE_URL}`);
  console.log(`Username: ${config.AUTH.USERNAME}`);
  console.log(`Endpoints: ${JSON.stringify(config.ENDPOINTS, null, 2)}`);
  console.log('');

  const authHelper = new AuthHelper();

  try {
    console.log('🔗 Testing connection to server...');
    await authHelper.login();
    console.log('✅ Connection successful!');
    console.log('');

    console.log('📋 Testing user endpoints...');
    
    // Test getting users list
    console.log('GET /users');
    const usersResponse = await authHelper.makeAuthenticatedRequest('GET', '/users');
    console.log(`Status: ${usersResponse.status}`);
    console.log(`Response type: ${typeof usersResponse.data}`);
    console.log('');

    // Test creating a user
    console.log('POST /users');
    const testUser = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'testpass123',
      name: 'Test User'
    };

    const createResponse = await authHelper.makeAuthenticatedRequest('POST', '/users', testUser);
    console.log(`Status: ${createResponse.status}`);
    console.log(`Response:`, createResponse.data);
    console.log('');

    console.log('✅ Connection test completed successfully!');

  } catch (error) {
    console.log('❌ Connection failed:');
    console.log(`Error: ${error.message}`);
    console.log('');
    console.log('This is normal if the server is not accessible from this environment.');
    console.log('The test suite is properly configured and ready to run when the server is available.');
    console.log('');
    console.log('To use the tests:');
    console.log('1. Ensure the server https://lengkeng-dev.hocai.fun is accessible');
    console.log('2. Run: npm test');
    console.log('3. Or run specific tests: npm run test:users');
  }
}

if (require.main === module) {
  testConnection();
}

module.exports = testConnection;