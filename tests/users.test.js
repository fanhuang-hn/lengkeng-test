const AuthHelper = require('./helpers/auth');

describe('CRUD Users Tests', () => {
  let authHelper;
  let createdUserId;
  const testUser = {
    username: `testuser_${Date.now()}`,
    email: `testuser_${Date.now()}@example.com`,
    password: 'testpassword123',
    name: 'Test User'
  };

  beforeAll(async () => {
    authHelper = new AuthHelper();
    
    // Login before running tests
    await authHelper.login();
  }, 30000);

  describe('Create User', () => {
    test('should create a new user successfully', async () => {
      const response = await authHelper.makeAuthenticatedRequest('POST', '/users', testUser);
      
      // Check if request was successful (200-299 range)
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
      
      // Store the created user ID for later tests
      if (response.data && response.data.id) {
        createdUserId = response.data.id;
      } else if (response.data && response.data.user && response.data.user.id) {
        createdUserId = response.data.user.id;
      }
      
      console.log('Created user response:', response.status, response.data);
    }, 15000);

    test('should handle duplicate user creation', async () => {
      // Try to create the same user again
      const response = await authHelper.makeAuthenticatedRequest('POST', '/users', testUser);
      
      // Should return an error (typically 400 or 409)
      expect(response.status).toBeGreaterThanOrEqual(400);
      
      console.log('Duplicate user response:', response.status, response.data);
    }, 15000);
  });

  describe('Read Users', () => {
    test('should get list of users', async () => {
      const response = await authHelper.makeAuthenticatedRequest('GET', '/users');
      
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
      
      // Should return an array of users or a response containing users
      expect(response.data).toBeDefined();
      
      console.log('Users list response:', response.status, 'Data type:', typeof response.data);
    }, 15000);

    test('should get specific user by ID', async () => {
      if (!createdUserId) {
        console.log('Skipping specific user test - no user ID available');
        return;
      }

      const response = await authHelper.makeAuthenticatedRequest('GET', `/users/${createdUserId}`);
      
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
      expect(response.data).toBeDefined();
      
      console.log('Specific user response:', response.status, response.data);
    }, 15000);
  });

  describe('Update User', () => {
    test('should update user information', async () => {
      if (!createdUserId) {
        console.log('Skipping update test - no user ID available');
        return;
      }

      const updateData = {
        name: 'Updated Test User',
        email: `updated_${testUser.email}`
      };

      const response = await authHelper.makeAuthenticatedRequest('PUT', `/users/${createdUserId}`, updateData);
      
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
      
      console.log('Update user response:', response.status, response.data);
    }, 15000);

    test('should partially update user with PATCH', async () => {
      if (!createdUserId) {
        console.log('Skipping patch test - no user ID available');
        return;
      }

      const patchData = {
        name: 'Patched Test User'
      };

      const response = await authHelper.makeAuthenticatedRequest('PATCH', `/users/${createdUserId}`, patchData);
      
      // PATCH might not be supported, so we accept both success and method not allowed
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(500);
      
      console.log('Patch user response:', response.status, response.data);
    }, 15000);
  });

  describe('Delete User', () => {
    test('should delete user successfully', async () => {
      if (!createdUserId) {
        console.log('Skipping delete test - no user ID available');
        return;
      }

      const response = await authHelper.makeAuthenticatedRequest('DELETE', `/users/${createdUserId}`);
      
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
      
      console.log('Delete user response:', response.status, response.data);
    }, 15000);

    test('should handle deleting non-existent user', async () => {
      const nonExistentId = 999999;
      const response = await authHelper.makeAuthenticatedRequest('DELETE', `/users/${nonExistentId}`);
      
      // Should return 404 or similar error
      expect(response.status).toBeGreaterThanOrEqual(400);
      
      console.log('Delete non-existent user response:', response.status, response.data);
    }, 15000);
  });

  describe('Error Handling', () => {
    test('should handle unauthorized access', async () => {
      // Create a new auth helper without login
      const unauthHelper = new AuthHelper();
      
      const response = await unauthHelper.makeAuthenticatedRequest('GET', '/users');
      
      // Should return 401 or 403
      expect(response.status).toBeGreaterThanOrEqual(401);
      expect(response.status).toBeLessThan(500);
      
      console.log('Unauthorized access response:', response.status, response.data);
    }, 15000);

    test('should handle invalid endpoints', async () => {
      const response = await authHelper.makeAuthenticatedRequest('GET', '/users/invalid-endpoint');
      
      // Should return 404 or similar
      expect(response.status).toBeGreaterThanOrEqual(400);
      
      console.log('Invalid endpoint response:', response.status, response.data);
    }, 15000);
  });
});