import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// Superadmin
import SuperadminDashboard from "../pages/SuperadminDashboard";
import SuperadminMahsulotlar from "../pages/SuperadminDashboard/Mahsulotlar";
import Adminlar from "../pages/SuperadminDashboard/Adminlar";
import Kategoriya from "../pages/SuperadminDashboard/Kategoriya";

// Admin
import AdminDashboard from "../pages/AdminDashboard";
import AdminMahsulotlar from "../pages/AdminDashboard/Mahsulotlar";
import AdminKategoriya from "../pages/AdminDashboard/Kategoriya";

// Komendant
import KomendantDashboard from "../pages/KomendantDashboard";
import KomendantMahsulotlar from "../pages/KomendantDashboard/Mahsulotlar";
import KomendantSavatcha from "../pages/KomendantDashboard/Savat";
import KomendantOlinganMahsulotlar from "../pages/KomendantDashboard/OlinganMahsulotlar";

// Login and NotFoundPage
import NotFoundPage from "../pages/NotFoundPage";
import Login from "../components/Login";

const Root = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");

  const handleLogin = (userRole) => {
    setIsAuthenticated(true);
    setRole(userRole);
  };

  return (
    <Routes>
      {/* SUPERADMIN */}
      <Route
        path="/superadmin"
        element={
          isAuthenticated && role === "superadmin" ? (
            <SuperadminDashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route index element={<SuperadminMahsulotlar />} />
        <Route path="mahsulotlar" element={<SuperadminMahsulotlar />} />
        <Route path="adminlar" element={<Adminlar />} />
        <Route path="kategoriya" element={<Kategoriya />} />
      </Route>

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          isAuthenticated && role === "admin" ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route index element={<AdminMahsulotlar />} />
        <Route path="mahsulotlar" element={<AdminMahsulotlar />} />
        <Route path="kategoriya" element={<AdminKategoriya />} />
      </Route>

      {/* KOMENDANT */}
      <Route
        path="/komendant"
        element={
          isAuthenticated && role === "komendant" ? (
            <KomendantDashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route index element={<KomendantMahsulotlar />} />
        <Route path="mahsulotlar" element={<KomendantMahsulotlar />} />
        <Route path="olingan-mahsulotlar" element={<KomendantOlinganMahsulotlar />} />
        <Route path="savatcha" element={<KomendantSavatcha />} />
      </Route>

      {/* LOGIN and * */}
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Root;
