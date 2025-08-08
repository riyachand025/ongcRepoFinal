console.log('🔍 Debugging Frontend vs Curl Login...\n');

async function debugLogin() {
  const baseUrl = 'http://localhost:3001';
  
  // Test 1: Curl-style request (working)
  console.log('📡 Test 1: Curl-style request');
  try {
    const curlResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@ongc.co.in',
        password: 'password'
      })
    });
    
    const curlData = await curlResponse.json();
    console.log(`   Status: ${curlResponse.status}`);
    console.log(`   Success: ${curlData.success}`);
    console.log(`   Message: ${curlData.message}`);
    console.log('');
  } catch (error) {
    console.error('   Error:', error.message);
  }

  // Test 2: Frontend-style request (simulating what frontend sends)
  console.log('🌐 Test 2: Frontend-style request');
  try {
    const frontendResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        email: 'admin@ongc.co.in',
        password: 'password'
      })
    });
    
    const frontendData = await frontendResponse.json();
    console.log(`   Status: ${frontendResponse.status}`);
    console.log(`   Success: ${frontendData.success}`);
    console.log(`   Message: ${frontendData.message}`);
    console.log('');
  } catch (error) {
    console.error('   Error:', error.message);
  }

  // Test 3: Check if there's any difference in request body
  console.log('📝 Test 3: Request body comparison');
  const requestBody = {
    email: 'admin@ongc.co.in',
    password: 'password'
  };
  
  console.log('   Request body:');
  console.log(`   Email: "${requestBody.email}"`);
  console.log(`   Password: "${requestBody.password}"`);
  console.log(`   Password length: ${requestBody.password.length}`);
  console.log(`   Password bytes: ${Buffer.from(requestBody.password).toString('hex')}`);
  console.log('');
}

debugLogin(); 