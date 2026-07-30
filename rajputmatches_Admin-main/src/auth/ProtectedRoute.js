import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminAuthToken");
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  // Check if either `isAuthenticated` is false or no token exists
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
