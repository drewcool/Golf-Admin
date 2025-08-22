import axios from "axios";

const userExists = localStorage.getItem("admin");
const authTokenExist = localStorage.getItem("authToken");
// Hybrid API configuration - auto-detect environment
const getApiUrl = () => {
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // If running on localhost, use local backend
  if (hostname === 'localhost' && port === '5173') {
    return 'http://localhost:5000/api';
  }
  
  // If running on production IP, use production backend
  if (hostname === '13.50.244.87') {
    return 'http://13.50.244.87:5000/api';
  }
  
  // Default fallback to production
  return 'http://13.50.244.87:5000/api';
};

const API_URL = getApiUrl();

export const getUserLogin = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/user/login`, data);
      if (res.data.status) {
        return res.data;
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed.");
    }
  };

export const getUserList = async () => {
    try {
        if (!userExists) {
            throw new Error("User is not logged in or does not exist in localStorage.");
        }
        if (!authTokenExist) {
            throw new Error("Auth token does not exist in localStorage.");
        }

        const response = await axios.get(`${API_URL}/admin/getUsersList`, {
            headers: {
                Authorization: `Bearer ${authTokenExist}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};


export const getClubList = async () => {
    try {

console.log("authTokenExist" , authTokenExist);
        const response = await axios.get(`${API_URL}/admin/get-clubs`, {
            headers: {
                Authorization: `Bearer ${authTokenExist}`
            }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const getGolfCoursesList = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/getGolfCourses`);
        return response.data.courses;
    } catch (error) {
        throw error;
    }
};
export const getLessionsList = async () => {
    try {
        const response = await axios.get(`${API_URL}/lession/get-lessions`, {
            headers: {
                Authorization: `Bearer ${authTokenExist}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
