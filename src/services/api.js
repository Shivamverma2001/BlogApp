import axios from 'axios';

// Set the API base URL
const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Received response:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response || error);
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  signup: async (userData) => {
    try {
      const response = await api.post('/api/signup', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Signup error:', error.response || error);
      throw error;
    }
  },

  login: async (credentials) => {
    const response = await api.post('/api/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Post Services
export const postService = {
  getAllPosts: async () => {
    const response = await api.get('/api/posts');
    return response.data;
  },

  getPostById: async (postId) => {
    const response = await api.get(`/api/posts/${postId}`);
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post('/api/posts', postData);
    return response.data;
  },

  updatePost: async (postId, postData) => {
    const response = await api.put(`/api/posts/${postId}`, postData);
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/api/posts/${postId}`);
    return response.data;
  }
};

export default api; 