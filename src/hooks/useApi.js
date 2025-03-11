import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "https://localhost:7232").replace(/\/+$/, "");


export const getQuestions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Questions`);
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.questions && Array.isArray(response.data.questions)) {
      return response.data.questions;
    } else {
      throw new Error("Unexpected data format");
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};
