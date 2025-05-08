// src/auth/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "./JwtUtils";

const PrivateRoute = ({ children, allowedRoles }) => {
    console.log(children)
    console.log(allowedRoles)
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const userRole = getUserRole();
  console.log(userRole)

  // Convert allowedRoles to lowercase for comparison
  const allowed = allowedRoles.map(role => role);
  console.log(allowed)
  const normalizedUserRole = userRole

  if (!allowed.includes(normalizedUserRole)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default PrivateRoute;