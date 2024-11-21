import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

// Superadmin
import SuperadminDashboard from "../pages/SuperadminDashboard";
import SuperadminOmbor from "../pages/SuperadminDashboard/Ombor";
import Adminlar from "../pages/SuperadminDashboard/Adminlar";
import Arxiv from "../pages/SuperadminDashboard/ArxivPage";

// Admin
import AdminDashboard from "../pages/AdminDashboard";
import AdminOmbor from "../pages/AdminDashboard/Ombor";
import AdminKategoriya from "../pages/AdminDashboard/Kategoriya";
import AdminBirlik from "../pages/AdminDashboard/Birlik";
import AdminMahsulotlarYaratish from "../pages/AdminDashboard/MahsulotlarYaratish";
import AdminSorovlar from "../pages/AdminDashboard/Sorovlar";
import KiritilganMahsulotlar from "../pages/AdminDashboard/ArxivPage/KiritilganMahsulotlar";
import ChiqganMahsulotlar from "../pages/AdminDashboard/ArxivPage/ChiqganMahsulotlar";

// Komendant
import KomendantDashboard from "../pages/KomendantDashboard";
import KomendantOmbor from "../pages/KomendantDashboard/Ombor";
import KomendantSavatcha from "../pages/KomendantDashboard/Savat";
import KomendantArxiv from "../pages/KomendantDashboard/Arxiv";

// Login and NotFoundPage
import NotFoundPage from "../pages/NotFoundPage";
import Login from "../components/Login";

const Root = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (token && storedRole) {
      setIsAuthenticated(true);
      setRole(storedRole);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userRole) => {
    setIsAuthenticated(true);
    setRole(userRole);
    localStorage.setItem("role", userRole);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* SUPERADMIN */}
      <Route
        path="/superadmin/*"
        element={
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            role={role}
            requiredRole="superadmin"
          >
            <SuperadminDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<SuperadminOmbor />} />
        <Route path="ombor" element={<SuperadminOmbor />} />
        <Route path="adminlar" element={<Adminlar />} />
        <Route path="arxiv" element={<Arxiv />} />
      </Route>

      {/* ADMIN */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            role={role}
            requiredRole="admin"
          >
            <AdminDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminOmbor />} />
        <Route path="ombor" element={<AdminOmbor />} />
        <Route path="kategoriya" element={<AdminKategoriya />} />
        <Route path="birlik" element={<AdminBirlik />} />
        <Route path="mahsulot" element={<AdminMahsulotlarYaratish />} />
        <Route path="arxiv/kiritilgan-mahsulotlar" element={<KiritilganMahsulotlar />} />
        <Route path="arxiv/chiqgan-mahsulotlar" element={<ChiqganMahsulotlar />} />
        <Route path="so'rovlar" element={<AdminSorovlar />} />
      </Route>

      {/* KOMENDANT */}
      <Route
        path="/komendant/*"
        element={
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            role={role}
            requiredRole="komendant"
          >
            <KomendantDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<KomendantOmbor />} />
        <Route path="ombor" element={<KomendantOmbor />} />
        <Route path="arxiv" element={<KomendantArxiv />} />
        <Route path="savatcha" element={<KomendantSavatcha />} />
      </Route>

      {/* LOGIN and * */}
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Root;
