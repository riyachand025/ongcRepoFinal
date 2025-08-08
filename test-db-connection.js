const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('🧪 Testing database connection...');
console.log('📝 Environment variables:');
console.log('   SQL_DATABASE:', process.env.SQL_DATABASE);
console.log('   SQL_USER:', process.env.SQL_USER);
console.log('   SQL_PASSWORD:', process.env.SQL_PASSWORD ? '***configured***' : 'Not configured');
console.log('   SQL_HOST:', process.env.SQL_HOST);
console.log('   SQL_PORT:', process.env.SQL_PORT);

// Create Sequelize instance with exact same config
const sequelize = new Sequelize(
  process.env.SQL_DATABASE || 'ongc_auth',
  process.env.SQL_USER || 'ongc_user',
  process.env.SQL_PASSWORD || '6574839201Ongc@321#',
  {
    host: process.env.SQL_HOST || 'localhost',
    port: process.env.SQL_PORT || 3306,
    dialect: 'mysql',
    logging: console.log
  }
);

async function testConnection() {
  try {
    console.log('🔌 Attempting to connect...');
    await sequelize.authenticate();
    console.log('✅ Connection successful!');
    
    // Test a simple query
    const [results] = await sequelize.query('SELECT 1 as test');
    console.log('✅ Query test successful:', results);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('🔍 Full error:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection(); 