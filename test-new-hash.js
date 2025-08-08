const bcrypt = require('bcryptjs');

console.log('🔐 Testing New Password Hash...\n');

async function testNewHash() {
  const password = 'password';
  
  // Test with the new hash from database
  console.log('📝 Test: Compare with new database hash');
  const newHash = '$2a$10$ZzWP09UowYaZGRiXi3dmsuw7s890hvnPbaZ4C9XhcDIZEFa6lE53.';
  console.log(`   New hash: ${newHash}`);
  
  const isMatch = await bcrypt.compare(password, newHash);
  console.log(`   Password match: ${isMatch}`);
  
  // Test with the previous hash
  console.log('\n📝 Test: Compare with previous hash');
  const prevHash = '$2a$10$wD8yh4H/xIOsCqWR00F9auYktRrXSFtxtKKZPsenz53ViM4l9.F1W';
  console.log(`   Previous hash: ${prevHash}`);
  
  const isPrevMatch = await bcrypt.compare(password, prevHash);
  console.log(`   Password match: ${isPrevMatch}`);
  
  // Test with the original hash
  console.log('\n📝 Test: Compare with original hash');
  const origHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
  console.log(`   Original hash: ${origHash}`);
  
  const isOrigMatch = await bcrypt.compare(password, origHash);
  console.log(`   Password match: ${isOrigMatch}`);
}

testNewHash(); 