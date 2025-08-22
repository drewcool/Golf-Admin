import axios from 'axios';

// Use EC2 backend
const API_BASE_URL = 'http://13.234.113.29:5000/api/golf';

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
