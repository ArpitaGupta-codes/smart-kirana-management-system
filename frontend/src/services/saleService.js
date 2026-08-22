import axios from './axiosConfig';
const API_URL = 'http://localhost:5000/api/sales';

export const getSales = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addSale = async (saleData) => {
  const response = await axios.post(API_URL, saleData);
  return response.data;
};