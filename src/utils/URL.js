// Function to return base media URL
// Dynamic media base (serves /images from backend). Use local when developing.
export const mediaUrl = () => (
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000/'
    : 'https://golfserver.appsxperts.live/'
);

// Function to return base API URL
export const APIURL = () => (
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000/'
    : 'https://golfserver.appsxperts.live/'
);
