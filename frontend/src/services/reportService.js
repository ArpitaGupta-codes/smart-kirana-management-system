import axios from './axiosConfig';

const API_URL = 'http://localhost:5000/api/reports';

export const getSalesReport = async (startDate, endDate) => {
  const response = await axios.get(`${API_URL}/sales?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};

export const getPurchaseReport = async (startDate, endDate) => {
  const response = await axios.get(`${API_URL}/purchases?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};

export const getExpenseReport = async (startDate, endDate) => {
  const response = await axios.get(`${API_URL}/expenses?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};

export const getStockReport = async () => {
  const response = await axios.get(`${API_URL}/stock`);
  return response.data;
};