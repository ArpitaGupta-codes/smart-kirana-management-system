import axios from './axiosConfig';
const API_URL = 'http://localhost:5000/api/purchases';

export const getPurchases = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addPurchase = async (purchaseData) => {
  const response = await axios.post(API_URL, purchaseData);
  return response.data;
};