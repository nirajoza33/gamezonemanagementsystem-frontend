// src/auth/jwtUtils.js
import { jwtDecode } from "jwt-decode";

// Get token from sessionStorage
export const getToken = () => {
  return sessionStorage.getItem("token");
};

// Decode the token
export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
};

// Check if the token is expired
export const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch (e) {
    return true;
  }
};

// Check if the user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  return token && !isTokenExpired(token);
};

// Get user role from the token
export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;

  const decoded = decodeToken(token);
  const roleClaim = decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  return roleClaim || null; 
};

// Optional: Get full user info from session
// export const getUserInfo = () => {
//   const user = sessionStorage.getItem("user");
//   return user ? JSON.parse(user) : null;
// };

export const getUserInfo = () => {
  const user = sessionStorage.getItem("user");
  if (user) {
    const parsedUser = JSON.parse(user);
    console.log("username in jwt : ",parsedUser.UserName)
    // Ensure the username exists in the token and return it
    const username = parsedUser.UserName || "User";  // Default to "User" if no username found
    const status = parsedUser.status || "false";
    return {
      ...parsedUser,
      username,  // Add username field
      status,
    };
  }
  return null;
};


// Logout function
export const logout = () => {
  sessionStorage.clear();
  window.location.href = "/login";
};