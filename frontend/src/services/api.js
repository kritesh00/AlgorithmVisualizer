import axios from 'axios';


const API_BASE_URL = 'https://django-backend-86sb.onrender.com/';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // Reduced timeout
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.log('Backend server is not reachable at', API_BASE_URL);
    }
    return Promise.reject(error);
  }
);

// Algorithm API calls
export const algorithmAPI = {
  // Health check
  healthCheck: () => api.get('/algorithms/').catch(() => ({ data: [] })),
  
  // Get all algorithms
  getAll: () => api.get('/algorithms/'),
  
  // Get algorithms by type
  getByType: (type) => api.get(`/algorithms/by_type/?type=${type}`),
  
  // Get specific algorithm
  getById: (id) => api.get(`/algorithms/${id}/`),
  
  // Create new algorithm
  create: (data) => api.post('/algorithms/', data),
  
  // Update algorithm
  update: (id, data) => api.put(`/algorithms/${id}/`, data),
  
  // Delete algorithm
  delete: (id) => api.delete(`/algorithms/${id}/`),
  
  // Get algorithm stats
  getStats: () => api.get('/algorithms/stats/'),
};

// Algorithm Execution API calls
export const executionAPI = {
  // Get all executions
  getAll: () => api.get('/executions/'),
  
  // Record new execution
  record: (data) => api.post('/executions/record_execution/', data),
  
  // Get performance stats
  getPerformanceStats: (type = null) => {
    const url = type ? `/executions/performance_stats/?type=${type}` : '/executions/performance_stats/';
    return api.get(url);
  },
  
  // Get executions for specific algorithm
  getByAlgorithm: (algorithmId) => api.get(`/executions/?algorithm=${algorithmId}`),
};

// Error handling helper
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    console.error('API Error:', error.response.data);
    return error.response.data.message || 'Server error occurred';
  } else if (error.request) {
    // Request was made but no response received
    console.error('Network Error:', error.request);
    return 'Network error - please check if the backend server is running';
  } else {
    // Something else happened
    console.error('Error:', error.message);
    return error.message;
  }
};

export default api;
