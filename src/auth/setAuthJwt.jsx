import axios from "axios";

// Function to set the JWT token in Axios headers
const setAuthToken = (token) => {
  if (token) {
    // Apply the token to every request header
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // Remove the token from the headers if it's not provided
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
