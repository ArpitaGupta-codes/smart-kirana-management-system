import axios from './axiosConfig';
const API_URL = 'http://localhost:5000/api/credits';

export const getCreditSummary = async () => {
  const response = await axios.get(`${API_URL}/summary`);
  return response.data;
};

export const getAllCredits = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const recordPayment = async (paymentData) => {
  const response = await axios.post(`${API_URL}/payment`, paymentData);
  return response.data;
};