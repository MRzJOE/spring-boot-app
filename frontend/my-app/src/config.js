// Central configuration file for the task app

// API configuration
// Using the GitHub Codespaces URL format to connect to the backend
const CODESPACE_NAME = 'symmetrical-xylophone-px74r4p7rqg27vp6';
const BASE_API_URL = `https://${CODESPACE_NAME}-8080.app.github.dev`;

export const API_ENDPOINTS = {
  TASKS: `${BASE_API_URL}/api/tasks`,
  PROJECTS: `${BASE_API_URL}/api/projects`,
  TASK_BY_ID: (id) => `${BASE_API_URL}/api/tasks/${id}`,
  REORDER_TASKS: `${BASE_API_URL}/api/tasks/reorder`,
  CLEAR_ALL_TASKS: `${BASE_API_URL}/api/tasks/clear-all`,
};

// Helper functions
export const getTodayFormatted = () => {
  const date = new Date();
  return formatDateForApi(date);
};

export const formatDateForApi = (date) => {
  // Fix timezone issue by using local date formatting
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Error handling
export const handleApiError = (error) => {
  console.error('API Error:', error.message);
  console.error('Full error object:', error);
  
  // You could add more sophisticated error handling here
  // like sending errors to a monitoring service
};