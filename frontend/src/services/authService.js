import axios from './axiosConfig';

const API_URL = 'http://localhost:5000/api/auth';

export const loginUser = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, { Username: username, Password: password });
  return response.data;
};