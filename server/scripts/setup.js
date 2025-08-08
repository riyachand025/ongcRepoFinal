#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 ONGC Internship ATS - Setup Script');
console.log('=====================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  const envExamplePath = path.join(__dirname, '..', 'env.example');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created. Please update it with your database credentials.');
  } else {
    console.log('❌ env.example file not found. Please create a .env file manually.');
  }
} else {
  console.log('✅ .env file already exists.');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully.');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
}

// Database setup instructions
console.log('\n🗄️  Database Setup Instructions:');
console.log('================================');
console.log('1. Install MySQL if not already installed');
console.log('2. Create a MySQL database:');
console.log('   mysql -u root -p');
console.log('   CREATE DATABASE ongc_auth_db;');
console.log('3. Update your .env file with database credentials');
console.log('4. Run the database setup script:');
console.log('   mysql -u root -p ongc_auth_db < scripts/setup-database.sql');
console.log('\n📋 Default credentials:');
console.log('   HR Manager: hr@ongc.co.in / password123');
console.log('   Admin: admin@ongc.co.in / admin123');
console.log('   Viewer: viewer@ongc.co.in / viewer123');

console.log('\n🎯 Next steps:');
console.log('1. Configure your .env file');
console.log('2. Start the server: npm run dev');
console.log('3. Start the frontend: cd ../Frontend && npm run dev');

console.log('\n✨ Setup complete!'); 