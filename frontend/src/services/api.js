import axios from 'axios';

// The backend base URL is loaded from the environment variable (or defaults to localhost:8000)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const checkApiHealth = async () => {
  const response = await api.get('/');
  return response.data;
};

export const getModelMetrics = async () => {
  const response = await api.get('/metrics');
  return response.data;
};

export const predictRisk = async (payload) => {
  const response = await api.post('/predict', payload);
  return response.data;
};

export default api;
