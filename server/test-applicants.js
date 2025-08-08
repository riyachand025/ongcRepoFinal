const BASE_URL = 'http://localhost:3001/api';

async function testApplicantSystem() {
  console.log('🧪 Testing Applicant Functionality...\n');
  
  let authToken = null;
  
  try {
    // Test 1: Login to get token
    console.log('🔐 Test 1: Login to get token');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@ongc.co.in',
        password: 'password123'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status} ${loginResponse.statusText}`);
    }
    
    const loginData = await loginResponse.json();
    authToken = loginData.token;
    console.log('✅ Login successful, token received');
    
    // Test 2: Get all applicants
    console.log('\n📋 Test 2: Get all applicants');
    const allApplicantsResponse = await fetch(`${BASE_URL}/applicants`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (!allApplicantsResponse.ok) {
      throw new Error(`Get all applicants failed: ${allApplicantsResponse.status}`);
    }
    
    const allApplicantsData = await allApplicantsResponse.json();
    const allApplicants = allApplicantsData.data || [];
    console.log(`✅ Found ${allApplicants.length} applicants`);
    
    // Test 3: Get shortlisted applicants
    console.log('\n📋 Test 3: Get shortlisted applicants');
    const shortlistedResponse = await fetch(`${BASE_URL}/applicants/shortlisted`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (!shortlistedResponse.ok) {
      throw new Error(`Get shortlisted failed: ${shortlistedResponse.status}`);
    }
    
    const shortlistedData = await shortlistedResponse.json();
    const shortlistedApplicants = shortlistedData.data || [];
    console.log(`✅ Found ${shortlistedApplicants.length} shortlisted applicants`);
    
    // Test 4: Get approved applicants
    console.log('\n📋 Test 4: Get approved applicants');
    const approvedResponse = await fetch(`${BASE_URL}/applicants/approved`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (!approvedResponse.ok) {
      throw new Error(`Get approved failed: ${approvedResponse.status}`);
    }
    
    const approvedData = await approvedResponse.json();
    const approvedApplicants = approvedData.data || [];
    console.log(`✅ Found ${approvedApplicants.length} approved applicants`);
    
    // Test 5: Test email functionality
    console.log('\n📧 Test 5: Test email functionality');
    const emailTestResponse = await fetch(`${BASE_URL}/test-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        to: 'test@example.com',
        subject: 'Test Email from ONGC System',
        text: 'This is a test email to verify the email system is working.',
        html: '<h1>Test Email</h1><p>This is a test email to verify the email system is working.</p>'
      })
    });
    
    if (!emailTestResponse.ok) {
      console.log('❌ Email test: FAILED');
      const errorText = await emailTestResponse.text();
      console.log(`   Error: ${emailTestResponse.status} - ${errorText}`);
    } else {
      const emailResult = await emailTestResponse.json();
      console.log('✅ Email test: PASSED');
      console.log(`   Message ID: ${emailResult.messageId}`);
    }
    
    // Test 6: Send custom email to an applicant
    if (allApplicants.length > 0) {
      console.log('\n📧 Test 6: Send custom email to applicant');
      const firstApplicant = allApplicants[0];
      
      const customEmailResponse = await fetch(`${BASE_URL}/applicants/${firstApplicant._id}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          subject: 'Welcome to ONGC Internship Program',
          message: 'Thank you for your interest in our internship program. We will review your application and get back to you soon.',
          recipientEmail: firstApplicant.email
        })
      });
      
      if (!customEmailResponse.ok) {
        console.log('❌ Custom email test: FAILED');
        const errorText = await customEmailResponse.text();
        console.log(`   Error: ${customEmailResponse.status} - ${errorText}`);
      } else {
        const emailResult = await customEmailResponse.json();
        console.log('✅ Custom email test: PASSED');
        console.log(`   Sent to: ${firstApplicant.name} (${firstApplicant.email})`);
        console.log(`   Message ID: ${emailResult.messageId}`);
      }
    }
    
    // Test 7: Get email history for an applicant
    if (allApplicants.length > 0) {
      console.log('\n📧 Test 7: Get email history for applicant');
      const firstApplicant = allApplicants[0];
      
      const emailHistoryResponse = await fetch(`${BASE_URL}/applicants/${firstApplicant._id}/emails`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!emailHistoryResponse.ok) {
        console.log('❌ Email history test: FAILED');
        const errorText = await emailHistoryResponse.text();
        console.log(`   Error: ${emailHistoryResponse.status} - ${errorText}`);
      } else {
        const emailHistory = await emailHistoryResponse.json();
        console.log('✅ Email history test: PASSED');
        console.log(`   Found ${emailHistory.length} emails for ${firstApplicant.name}`);
      }
    }
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testApplicantSystem(); 