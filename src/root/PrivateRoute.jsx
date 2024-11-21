import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, isAuthenticated, role, requiredRole }) => {
  return isAuthenticated && role === requiredRole ? (
    children
  ) : (
    <Navigate to="/not-found" />
  );
};

export default PrivateRoute;
