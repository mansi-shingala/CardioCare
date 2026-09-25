import axios from 'axios';

// The backend base URL is loaded from the environment variable (or defaults to localhost:8001)
const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds default to allow for cloud cold-starts (e.g. Render free tier)
});

export const checkApiHealth = async (timeout = 15000) => {
  // Adding cache-busting timestamp parameter prevents aggressive browser/proxy caching of failed health checks
  const response = await api.get('/', { 
    timeout,
    params: { _t: Date.now() }
  });
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
