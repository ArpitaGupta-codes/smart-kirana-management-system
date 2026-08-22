import axios from 'axios';

// Har request jaane se pehle, agar token localStorage mein hai, use header mein add kar do
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;