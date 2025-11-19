import axios from 'axios';

// In your frontend services/api.js or similar file
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

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<any> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (username: string, email: string, password: string): Promise<any> => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },
  
  getCurrentUser: async (): Promise<any> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  getProjects: async (): Promise<any[]> => {
    const response = await api.get('/projects');
    return response.data;
  },
  
  getProject: async (id: string): Promise<any> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  
  createProject: async (projectData: { title: string; description: string; deadline?: string }): Promise<any> => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },
  
  updateProject: async (id: string, projectData: any): Promise<any> => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },
  
  deleteProject: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

// Tasks API
export const tasksAPI = {
  getTasks: async (): Promise<any[]> => {
    const response = await api.get('/tasks');
    return response.data;
  },
  
  getTask: async (id: string): Promise<any> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  
  createTask: async (taskData: { 
    title: string; 
    description: string; 
    project: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
  }): Promise<any> => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  
  updateTask: async (id: string, taskData: any): Promise<any> => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  
  deleteTask: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default api;