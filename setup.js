#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Lengkeng CRUD Test Suite');
console.log('=====================================');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  console.log('📝 Creating .env file from template...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ .env file created successfully!');
  console.log('');
  console.log('Please review and update the .env file with your configuration:');
  console.log('- Base URL for your application');
  console.log('- Username and password for authentication');
  console.log('- Timeout and retry settings');
} else if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
} else {
  console.log('⚠️  No .env.example template found');
}

console.log('');
console.log('📋 Available commands:');
console.log('- npm test           : Run all tests');
console.log('- npm run test:unit  : Run unit tests only');
console.log('- npm run test:users : Run CRUD user tests');
console.log('- npm run test:connection : Test server connection');
console.log('- npm run test:verbose    : Run tests with verbose output');
console.log('');
console.log('🔗 To test your setup:');
console.log('1. npm run test:connection');
console.log('2. npm run test:unit');
console.log('3. npm run test:users (requires server access)');
console.log('');
console.log('✅ Setup complete!');