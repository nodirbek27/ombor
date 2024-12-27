import React from "react";
import { Navigate } from "react-router-dom";
import CryptoJS from "crypto-js";

const PrivateRoute = ({ children, requiredRole }) => {
  const data = JSON.parse(localStorage.getItem("data"));
  if (!data) {
    return <Navigate to="/not-found" />;
  }

  const decryptedRole = CryptoJS.AES.decrypt(data?.role, "role-001")
    .toString(CryptoJS.enc.Utf8)
    .trim()
    .replace(/^"|"$/g, "");

  if (decryptedRole === requiredRole.replace(/^|"$/g, "")) {
    return children;
  }
};

export default PrivateRoute;
