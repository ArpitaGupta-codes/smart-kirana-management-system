import axios from './axiosConfig';
// Humara backend jahan chal raha hai
const API_URL = 'http://localhost:5000/api/categories';

// Saari categories laane ke liye
export const getCategories = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Nayi category add karne ke liye
export const addCategory = async (name) => {
  const response = await axios.post(API_URL, { Name: name });
  return response.data;
};

// Category delete karne ke liye
export const deleteCategory = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};