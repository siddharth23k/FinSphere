import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://finsphere-rqh2.onrender.com/api'
});

// Debug: Log which URL is being used
console.log('🔗 API Base URL:', API.defaults.baseURL);

// Attach token from localStorage automatically
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('finsphere_user') || '{}');
  if (user.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export { API };
