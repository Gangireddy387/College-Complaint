const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API endpoints...');
    
    // Test basic endpoint
    const response1 = await axios.get('http://localhost:5000/');
    console.log('Basic endpoint:', response1.data);
    
    // Test forgot password endpoint
    const response2 = await axios.post('http://localhost:5000/api/principal/forgot-password', {
      email: 'principal@college.com'
    });
    console.log('Forgot password endpoint:', response2.data);
    
  } catch (error) {
    console.error('Error testing API:', error.response?.data || error.message);
  }
}

testAPI();
