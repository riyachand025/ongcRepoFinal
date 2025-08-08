const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const SQLUser = require('../models/User');

console.log('🔐 [PASSWORD_UPDATE] Starting password update script...');

async function updatePasswords() {
  try {
    console.log('🔌 [PASSWORD_UPDATE] Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ [PASSWORD_UPDATE] Database connected successfully');

    console.log('🔐 [PASSWORD_UPDATE] Generating fresh password hash...');
    const password = 'password123'; // Updated to match what frontend is sending
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ [PASSWORD_UPDATE] Password hash generated:', hashedPassword.substring(0, 20) + '...');

    console.log('👥 [PASSWORD_UPDATE] Updating passwords for all users...');
    
    // Update all users with the new password hash
    const result = await SQLUser.update(
      { password: hashedPassword },
      { where: {} } // Update all users
    );

    console.log(`✅ [PASSWORD_UPDATE] Updated ${result[0]} users successfully`);

    // Verify the update by fetching a user
    const testUser = await SQLUser.findByEmail('admin@ongc.co.in');
    if (testUser) {
      console.log('✅ [PASSWORD_UPDATE] Test user found:', testUser.email);
      console.log('🔐 [PASSWORD_UPDATE] New password hash stored:', testUser.password.substring(0, 20) + '...');
      
      // Test password verification
      const isValid = await testUser.comparePassword('password123');
      console.log('🔐 [PASSWORD_UPDATE] Password verification test:', isValid ? 'PASSED' : 'FAILED');
    }

    console.log('✅ [PASSWORD_UPDATE] Password update completed successfully!');
    console.log('📝 [PASSWORD_UPDATE] All users now have password: "password123"');

  } catch (error) {
    console.error('❌ [PASSWORD_UPDATE] Error updating passwords:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 [PASSWORD_UPDATE] Database connection closed');
  }
}

updatePasswords(); 