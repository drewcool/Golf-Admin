import axios from 'axios';

// Hybrid API configuration - auto-detect environment
const getApiUrl = () => {
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // If running on localhost, use local backend
  if (hostname === 'localhost' && port === '5173') {
    return 'http://localhost:5000/api/golf';
  }
  
  // If running on production IP, use production backend
  if (hostname === '13.50.244.87') {
    return 'http://13.50.244.87:5000/api/golf';
  }
  
  // Default fallback to production
  return 'http://13.50.244.87:5000/api/golf';
};

const API_BASE_URL = getApiUrl();

// Save holes for a course
export const saveCourseHoles = async (courseId, holes) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/saveHoles`, {
      courseId,
      holes
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to save holes');
  }
};

// Get holes for a course
export const getCourseHoles = async (courseId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getHoles/${courseId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get holes');
  }
};

// Delete holes for a course
export const deleteCourseHoles = async (courseId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deleteHoles/${courseId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete holes');
  }
};
