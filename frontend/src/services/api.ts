import axios from 'axios';

// ✅ Correct - use your deployed backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mern-final-project-rich-ar-dev-1.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API - ADD /api prefix to all endpoints
export const authAPI = {
  login: async (email: string, password: string): Promise<any> => {
    const response = await api.post('/api/auth/login', { email, password }); // ✅ Added /api
    return response.data;
  },
  
  register: async (username: string, email: string, password: string): Promise<any> => {
    const response = await api.post('/api/auth/register', { username, email, password }); // ✅ Added /api
    return response.data;
  },
  
  getCurrentUser: async (): Promise<any> => {
    const response = await api.get('/api/auth/me'); // ✅ Added /api
    return response.data;
  },
};

// Projects API - ADD /api prefix to all endpoints
export const projectsAPI = {
  getProjects: async (): Promise<any[]> => {
    const response = await api.get('/api/projects'); // ✅ Added /api
    return response.data;
  },
  
  getProject: async (id: string): Promise<any> => {
    const response = await api.get(`/api/projects/${id}`); // ✅ Added /api
    return response.data;
  },
  
  createProject: async (projectData: { title: string; description: string; deadline?: string }): Promise<any> => {
    const response = await api.post('/api/projects', projectData); // ✅ Added /api
    return response.data;
  },
  
  updateProject: async (id: string, projectData: any): Promise<any> => {
    const response = await api.put(`/api/projects/${id}`, projectData); // ✅ Added /api
    return response.data;
  },
  
  deleteProject: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/projects/${id}`); // ✅ Added /api
    return response.data;
  },
};

// Tasks API - ADD /api prefix to all endpoints
export const tasksAPI = {
  getTasks: async (): Promise<any[]> => {
    const response = await api.get('/api/tasks'); // ✅ Added /api
    return response.data;
  },
  
  getTask: async (id: string): Promise<any> => {
    const response = await api.get(`/api/tasks/${id}`); // ✅ Added /api
    return response.data;
  },
  
  createTask: async (taskData: { 
    title: string; 
    description: string; 
    project: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
  }): Promise<any> => {
    const response = await api.post('/api/tasks', taskData); // ✅ Added /api
    return response.data;
  },
  
  updateTask: async (id: string, taskData: any): Promise<any> => {
    const response = await api.put(`/api/tasks/${id}`, taskData); // ✅ Added /api
    return response.data;
  },
  
  deleteTask: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/tasks/${id}`); // ✅ Added /api
    return response.data;
  },
};

export default api;