// client/src/api/api.js

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL + '/codes'; 

export const getCurrentCode = async (type) => {
  try {
    const response = await axios.get(`${API_BASE}/current/${type}`); 
    return response.data.code;
  } catch (error) {
    console.error(`Error fetching current code for ${type}:`, error);
    throw error;
  }
};

export const getNextCode = async (type) => {
  try {
    // Menggunakan POST untuk mencegah double increment
    const response = await axios.post(`${API_BASE}/next/${type}`);
    return response.data.code;
  } catch (error) {
    console.error(`Error fetching next code for ${type}:`, error);
    throw error;
  }
};