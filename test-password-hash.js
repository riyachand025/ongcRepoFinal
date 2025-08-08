const bcrypt = require('bcryptjs');

console.log('🔐 Testing Password Hash Comparison...\n');

async function testPasswordHash() {
  const password = 'password';
  
  // Test 1: Generate a fresh hash
  console.log('📝 Test 1: Generate fresh hash');
  const freshHash = await bcrypt.hash(password, 10);
  console.log(`   Fresh hash: ${freshHash}`);
  
  // Test 2: Compare with the hash in database
  console.log('\n📝 Test 2: Compare with database hash');
  const dbHash = '$2a$10$wD8yh4H/xIOsCqWR00F9auYktRrXSFtxtKKZPsenz53ViM4l9.F1W';
  console.log(`   Database hash: ${dbHash}`);
  
  const isMatch = await bcrypt.compare(password, dbHash);
  console.log(`   Password match: ${isMatch}`);
  
  // Test 3: Compare with old hash
  console.log('\n📝 Test 3: Compare with old hash');
  const oldHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
  console.log(`   Old hash: ${oldHash}`);
  
  const isOldMatch = await bcrypt.compare(password, oldHash);
  console.log(`   Password match: ${isOldMatch}`);
  
  // Test 4: Test different passwords
  console.log('\n📝 Test 4: Test different passwords');
  const testPasswords = ['password', 'Password', 'PASSWORD', 'password123', 'admin123'];
  
  for (const testPassword of testPasswords) {
    const match = await bcrypt.compare(testPassword, dbHash);
    console.log(`   "${testPassword}" matches: ${match}`);
  }
}

testPasswordHash(); 