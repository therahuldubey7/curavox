import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const simulationService = {
  // Send a message to the simulation endpoint
  simulate: async (data) => {
    try {
      const response = await api.post('/simulate', data);
      return response.data;
    } catch (error) {
      console.error('Simulation API error:', error);
      throw error;
    }
  },

  // Get progress data
  getProgress: async () => {
    try {
      const response = await api.get('/progress');
      return response.data;
    } catch (error) {
      console.error('Progress API error:', error);
      throw error;
    }
  },
};
