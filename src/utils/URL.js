// Hybrid URL configuration - auto-detect environment
const getBaseUrl = () => {
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // If running on localhost, use local backend
  if (hostname === 'localhost' && port === '5173') {
    return 'http://localhost:5000/';
  }
  
  // If running on production IP, use production backend
  if (hostname === '13.50.244.87') {
    return 'http://13.50.244.87:5000/';
  }
  
  // Default fallback to production
  return 'http://13.50.244.87:5000/';
};

// Function to return base media URL
export const mediaUrl = () => getBaseUrl();

// Function to return base API URL
export const APIURL = () => getBaseUrl();
