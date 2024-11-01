import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

// Superadmin
import SuperadminDashboard from "../pages/SuperadminDashboard";
import SuperadminMahsulotlar from "../pages/SuperadminDashboard/Mahsulotlar";
import Adminlar from "../pages/SuperadminDashboard/Adminlar";
import Arxiv from "../pages/SuperadminDashboard/ArxivPage";

// Admin
import AdminDashboard from "../pages/AdminDashboard";
import AdminMahsulotlar from "../pages/AdminDashboard/Mahsulotlar";
import AdminKategoriya from "../pages/AdminDashboard/Kategoriya";
import AdminArxiv from "../pages/AdminDashboard/ArxivPage";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (token) {
      setIsAuthenticated(true);
      setRole(storedRole);
    }
  }, []);

  const handleLogin = (userRole) => {
    setIsAuthenticated(true);
    setRole(userRole);
    localStorage.setItem("role", userRole);
  };

  return (
    <Routes>
      {/* SUPERADMIN */}
      <Route
        path="/superadmin"
        element={
          isAuthenticated && role === "superadmin" && <SuperadminDashboard />
        }
      >
        <Route index element={<SuperadminMahsulotlar />} />
        <Route path="mahsulotlar" element={<SuperadminMahsulotlar />} />
        <Route path="adminlar" element={<Adminlar />} />
        <Route path="arxiv" element={<Arxiv />} />
      </Route>

      {/* ADMIN */}
      <Route
        path="/admin"
        element={isAuthenticated && role === "admin" && <AdminDashboard />}
      >
        <Route index element={<AdminMahsulotlar />} />
        <Route path="mahsulotlar" element={<AdminMahsulotlar />} />
        <Route path="kategoriya" element={<AdminKategoriya />} />
        <Route path="arxiv" element={<AdminArxiv />} />
      </Route>

      {/* KOMENDANT */}
      <Route
        path="/komendant"
        element={
          isAuthenticated && role === "komendant" && <KomendantDashboard />
        }
      >
        <Route index element={<KomendantMahsulotlar />} />
        <Route path="mahsulotlar" element={<KomendantMahsulotlar />} />
        <Route
          path="olingan-mahsulotlar"
          element={<KomendantOlinganMahsulotlar />}
        />
        <Route path="savatcha" element={<KomendantSavatcha />} />
      </Route>

      {/* LOGIN and * */}
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Root;
