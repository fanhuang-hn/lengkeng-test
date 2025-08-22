# Lengkeng Test

Automated CRUD testing suite for user management functionality at https://lengkeng-dev.hocai.fun/users

## Overview

This project provides comprehensive testing for user CRUD (Create, Read, Update, Delete) operations on the Lengkeng development environment. The tests authenticate with the admin panel and perform various user management operations to ensure the system works correctly.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Access to the Lengkeng development environment

## Installation

1. Clone the repository:
```bash
git clone https://github.com/fanhuang-hn/lengkeng-test.git
cd lengkeng-test
```

2. Install dependencies:
```bash
npm install
```

## Configuration

The tests use the following default configuration:
- **Base URL**: https://lengkeng-dev.hocai.fun
- **Username**: admini
- **Password**: admin123

These can be modified in the `tests/helpers/auth.js` file if needed.

## Running Tests

### Run all tests:
```bash
npm test
```

### Run user CRUD tests specifically:
```bash
npm run test:users
```

### Run tests with verbose output:
```bash
npm run test:verbose
```

### Run tests in watch mode (for development):
```bash
npm run test:watch
```

## Test Structure

### Tests Included

1. **Create User Tests**
   - Create new user with valid data
   - Handle duplicate user creation

2. **Read User Tests**
   - Get list of all users
   - Get specific user by ID

3. **Update User Tests**
   - Update user information (PUT)
   - Partial update user information (PATCH)

4. **Delete User Tests**
   - Delete existing user
   - Handle deletion of non-existent user

5. **Error Handling Tests**
   - Test unauthorized access
   - Test invalid endpoints

### Test Files

- `tests/users.test.js` - Main CRUD user tests
- `tests/helpers/auth.js` - Authentication helper class

## Features

- **Automatic Authentication**: Handles login and maintains session
- **Comprehensive Coverage**: Tests all CRUD operations
- **Error Handling**: Validates proper error responses
- **Flexible Configuration**: Easy to modify for different environments
- **Detailed Logging**: Console output for debugging

## API Endpoints Tested

- `POST /users` - Create new user
- `GET /users` - Get all users
- `GET /users/:id` - Get specific user
- `PUT /users/:id` - Update user
- `PATCH /users/:id` - Partial update user
- `DELETE /users/:id` - Delete user

## Expected Responses

The tests are designed to work with standard HTTP status codes:
- **200-299**: Success responses
- **400-499**: Client error responses (validation, authentication, etc.)
- **500+**: Server error responses

## Troubleshooting

### Authentication Issues
- Verify the username and password are correct
- Check if the login endpoint is accessible
- Ensure the base URL is correct

### Network Issues
- Verify internet connectivity
- Check if the development server is running
- Confirm firewall settings allow outbound requests

### Test Failures
- Review console output for detailed error messages
- Check if API endpoints have changed
- Verify expected data formats match actual responses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add or modify tests as needed
4. Ensure all tests pass
5. Submit a pull request

## License

ISC License