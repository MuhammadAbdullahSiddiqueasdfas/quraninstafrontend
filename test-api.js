// Test script to verify API configuration
import axios from 'axios';

const API_BASE_URL = 'https://quraninstasnap.onrender.com/api';

const testAPI = async () => {
  try {
    console.log('Testing API connection to:', API_BASE_URL);
    
    // Test the health endpoint
    const healthResponse = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Health check:', healthResponse.data);
    
    // Test login endpoint
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'qasimr.r123@gmail.com',
      password: 'admin123'
    });
    console.log('✅ Login successful:', loginResponse.data.message);
    
    // Test dashboard stats with token
    const token = loginResponse.data.token;
    const statsResponse = await axios.get(`${API_BASE_URL}/admin/dashboard-stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Dashboard stats:', statsResponse.data);
    
  } catch (error) {
    console.error('❌ API Test failed:', error.response?.data || error.message);
  }
};

testAPI();