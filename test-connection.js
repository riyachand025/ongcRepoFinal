const fetch = require('node-fetch');

console.log('🔗 Testing Frontend-Backend Connection...\n');

async function testConnection() {
  const baseUrl = 'http://localhost:3001';
  
  try {
    // Test 1: Health Check
    console.log('📡 Test 1: Health Check');
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    console.log(`   Status: ${healthResponse.status}`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log(`   Response: ${JSON.stringify(healthData)}`);
    }
    console.log('');

    // Test 2: Login Test
    console.log('🔐 Test 2: Login Test');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@ongc.co.in',
        password: 'password'
      })
    });
    
    console.log(`   Status: ${loginResponse.status}`);
    const loginData = await loginResponse.json();
    console.log(`   Success: ${loginData.success}`);
    console.log(`   Message: ${loginData.message}`);
    
    if (loginData.success && loginData.token) {
      console.log(`   Token: ${loginData.token.substring(0, 20)}...`);
      console.log(`   User: ${loginData.user.email} (${loginData.user.role})`);
      
      // Test 3: Protected Route Test
      console.log('\n🔒 Test 3: Protected Route Test');
      const profileResponse = await fetch(`${baseUrl}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`   Status: ${profileResponse.status}`);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log(`   Profile: ${profileData.user.email}`);
      }
    }
    
    // Test 4: Email Test
    console.log('\n📧 Test 4: Email Test');
    const emailResponse = await fetch(`${baseUrl}/api/test-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: 'test@example.com',
        subject: 'Connection Test',
        html: '<h1>Frontend-Backend Connection Test</h1><p>If you receive this, the connection is working!</p>'
      })
    });
    
    console.log(`   Status: ${emailResponse.status}`);
    const emailData = await emailResponse.json();
    console.log(`   Success: ${emailData.success}`);
    console.log(`   Message: ${emailData.message}`);
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testConnection(); 