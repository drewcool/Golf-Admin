import axios from "axios";

const token = localStorage.getItem("authToken");
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

export const addLessonApi = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/lession/add-lession`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (res.data.status) {
        return res.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
  };

export const addCourseApi = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/golf/addCourse`, data, {
        headers: { 
           "Content-Type": "multipart/form-data"
         },
      });
  
      if (res.data.status) {
        return res.data;
      } else {
        throw new Error(res.data.message || "Course add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Course add failed.");
    }
  };

  export const DeleteGolfCourseApi = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/admin/delete-GolfCourse/${id}`, {
        headers: { 
           Authorization: `Bearer ${token}`
         },
      });
  
      if (res.data.status) {
        return res.data;
      } else {
        throw new Error(res.data.message || "Delete failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Delete failed");
    }
  };

export const AddClubApi = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/admin/addClub`, data, {
        headers: { 
           Authorization: `Bearer ${token}`
         },
      });
  
      if (res.data.status) {
        return res.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
  };
export const UpdateClubApi = async (data, id) => {
    try {
      // Use PUT for update instead of DELETE
      const res = await axios.put(`${API_URL}/admin/update-club/${id}`, data, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
         },
      });
  
      if (res.data.status) {
        return res.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
  };
  
export const DeleteClubApi = async ( id) => {
    try {
      const res = await axios.delete(`${API_URL}/admin/delete-clubs/${id}`, {
        headers: { 
          "Content-Type": "multipart/form-data",
           Authorization: `Bearer ${token}`
         },
      });
  
      if (res.data.status) {
        return res.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
  };

export const DeleteLessionApi = async ( id) => {
    try {
      const res = await axios.delete(`${API_URL}/admin/deleteLession/${id}`, {
        headers: { 
          "Content-Type": "multipart/form-data",
           Authorization: `Bearer ${token}`
         },
      });
  
      if (res.data.status) {
        console.log("Lesson Added:", res.data);
        return res.data;
      } else {
        throw new Error(res.data.message || "Lesson add failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lesson add failed.");
    }
  };

export const updateGolfCourseApi = async (courseId, data) => {
    try {
      const res = await axios.put(`${API_URL}/golf/updateCourse/${courseId}`, data, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });
  
      if (res.data.status) {
        return res.data;
      } else {
        throw new Error(res.data.message || "Update failed");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Update failed");
    }
  };
