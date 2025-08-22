import axios from "axios";

const userExists = localStorage.getItem("admin");
const authTokenExist = localStorage.getItem("authToken");
// Choose local API in development to avoid CORS, production otherwise
const API_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://golfserver.appsxperts.live/api';

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
