// Debug script to test the exact login flow
const API_BASE_URL = 'https://ongcrepofinal.onrender.com/api';

console.log('🚀 Testing ONGC Login Flow...\n');

// Test 1: Health check
console.log('1️⃣ Testing health endpoint...');
fetch(`${API_BASE_URL.replace('/api', '')}/api/health`)
  .then(response => response.json())
  .then(data => {
    console.log('✅ Health check:', data);
    
    // Test 2: Login attempt
    console.log('\n2️⃣ Testing login endpoint...');
    return fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'hr@ongc.co.in',
        password: 'password123'
      })
    });
  })
  .then(async response => {
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Login successful:', {
        success: data.success,
        message: data.message,
        hasToken: !!data.token,
        user: data.user?.email
      });
    } else {
      console.log('❌ Login failed:', data);
    }
  })
  .catch(error => {
    console.log('🚫 Network error:', error.message);
  });

// Test 3: Check environment detection
console.log('\n3️⃣ Environment info:');
console.log('Current URL would be:', window.location?.href || 'N/A (running in Node)');
console.log('API Base URL:', API_BASE_URL);

// Test 4: Check CORS
console.log('\n4️⃣ Testing CORS...');
fetch(`${API_BASE_URL}/auth/login`, {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://ongc-repo-final.vercel.app',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'Content-Type,Authorization'
  }
}).then(response => {
  console.log('CORS preflight status:', response.status);
  console.log('CORS headers:', {
    'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
    'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
    'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
    'access-control-allow-credentials': response.headers.get('access-control-allow-credentials')
  });
}).catch(error => {
  console.log('CORS test failed:', error.message);
});