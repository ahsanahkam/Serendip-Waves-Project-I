// src/api/foodInventoryApi.js
import axios from 'axios';

const API_URL = 'http://localhost/Project-I/backend/Serendip-Waves-Backend/food-inventory.php';

export const getFoodInventory = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addFoodItem = async (item) => {
  const res = await axios.post(API_URL, item);
  return res.data;
};

export const updateFoodItem = async (item) => {
  const res = await axios.put(API_URL, item);
  return res.data;
};

export const deleteFoodItem = async (id) => {
  const res = await axios.delete(API_URL, { data: { id } });
  return res.data;
};
