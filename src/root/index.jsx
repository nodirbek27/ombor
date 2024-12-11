import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

// Superadmin
import SuperadminDashboard from "../pages/SuperadminDashboard";
import SuperadminOmbor from "../pages/SuperadminDashboard/Ombor";
import Adminlar from "../pages/SuperadminDashboard/Adminlar";
import Binolar from "../pages/SuperadminDashboard/Binolar";

// Admin
import AdminDashboard from "../pages/AdminDashboard";
import AdminOmbor from "../pages/AdminDashboard/Ombor";
import AdminKategoriya from "../pages/AdminDashboard/Kategoriya";
import AdminBirlik from "../pages/AdminDashboard/Birlik";
import AdminMahsulotlarYaratish from "../pages/AdminDashboard/MahsulotlarYaratish";
import AdminSorovlar from "../pages/AdminDashboard/Sorovlar";
import KiritilganMahsulotlar from "../pages/AdminDashboard/ArxivPage/KiritilganMahsulotlar";

// Superadmin, Omborchi,
import ChiqganMahsulotlar from "../pages/AdminDashboard/ArxivPage/ChiqganMahsulotlar";
import RadEtilganMahsulotlar from "../pages/AdminDashboard/ArxivPage/RadEtilganMahsulotlar";

// Komendant
import KomendantDashboard from "../pages/KomendantDashboard";
import KomendantOmborXojalik from "../pages/KomendantDashboard/Ombor/Xojalik";
import KomendantOmborItPark from "../pages/KomendantDashboard/Ombor/ItPark";
import KomendantSavatcha from "../pages/KomendantDashboard/Savat";
import KomendantArxivTasdiq from "../pages/KomendantDashboard/Arxiv";
import KomendantArxivRad from "../pages/KomendantDashboard/ArxivRad";

// Prorektor
import ProrektorDashboard from "../pages/ProrektorDashboard";
import ProrektorTalabnoma from "../pages/ProrektorDashboard/Talabnoma";

// Prorektor
import BugalterDashboard from "../pages/BugalterDashboard";
import BugalterTalabnoma from "../pages/BugalterDashboard/Talabnoma";

// Prorektor
import XojalikDashboard from "../pages/XojalikDashboard";
import XojalikTalabnoma from "../pages/XojalikDashboard/Talabnoma";

// Prorektor
import ItParkDashboard from "../pages/ItParkDashboard";
import ItParkTalabnoma from "../pages/ItParkDashboard/Talabnoma";

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
        <Route path="binolar" element={<Binolar />} />
        <Route
          path="arxiv/chiqgan-mahsulotlar"
          element={<ChiqganMahsulotlar />}
        />
        <Route
          path="arxiv/rad-etilgan-mahsulotlar"
          element={<RadEtilganMahsulotlar />}
        />
      </Route>

      {/* Omborchi */}
      <Route
        path="/omborchi/*"
        element={
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            role={role}
            requiredRole="omborchi"
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
        <Route
          path="arxiv/kiritilgan-mahsulotlar"
          element={<KiritilganMahsulotlar />}
        />
        <Route
          path="arxiv/chiqgan-mahsulotlar"
          element={<ChiqganMahsulotlar />}
        />
        <Route
          path="arxiv/rad-etilgan-mahsulotlar"
          element={<RadEtilganMahsulotlar />}
        />
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
        <Route index element={<KomendantOmborXojalik />} />
        <Route
          path="ombor/xojalik-bolimi"
          element={<KomendantOmborXojalik />}
        />
        <Route path="ombor/it-park" element={<KomendantOmborItPark />} />
        <Route path="chiqgan-mahsulotlar" element={<KomendantArxivTasdiq />} />
        <Route path="rad-etilgan-mahsulotlar" element={<KomendantArxivRad />} />
        <Route path="savatcha" element={<KomendantSavatcha />} />
      </Route>

      {/* PROREKTOR */}
      <Route
        path="/prorektor/*"
        element={
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            role={role}
            requiredRole="prorektor"
          >
            <ProrektorDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<ProrektorTalabnoma />} />
        <Route path="talabnoma" element={<ProrektorTalabnoma />} />
        <Route path="chiqgan-mahsulotlar" element={<ChiqganMahsulotlar />} />
        <Route
          path="rad-etilgan-mahsulotlar"
          element={<RadEtilganMahsulotlar />}
        />
      </Route>

      {/* BUGALTER */}
      <Route
        path="/bugalter/*"
        element={
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            role={role}
            requiredRole="bugalter"
          >
            <BugalterDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<BugalterTalabnoma />} />
        <Route path="talabnoma" element={<BugalterTalabnoma />} />
        <Route path="chiqgan-mahsulotlar" element={<ChiqganMahsulotlar />} />
        <Route
          path="rad-etilgan-mahsulotlar"
          element={<RadEtilganMahsulotlar />}
        />
      </Route>

      {/* XOJALIK */}
      <Route
        path="/xojalik_bolimi/*"
        element={
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            role={role}
            requiredRole="xojalik_bolimi"
          >
            <XojalikDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<XojalikTalabnoma />} />
        <Route path="talabnoma" element={<XojalikTalabnoma />} />
        <Route path="chiqgan-mahsulotlar" element={<ChiqganMahsulotlar />} />
        <Route
          path="rad-etilgan-mahsulotlar"
          element={<RadEtilganMahsulotlar />}
        />
      </Route>

      {/* IT Park */}
      <Route
        path="/it_park/*"
        element={
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            role={role}
            requiredRole="it_park"
          >
            <ItParkDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<ItParkTalabnoma />} />
        <Route path="talabnoma" element={<ItParkTalabnoma />} />
        <Route path="chiqgan-mahsulotlar" element={<ChiqganMahsulotlar />} />
        <Route
          path="rad-etilgan-mahsulotlar"
          element={<RadEtilganMahsulotlar />}
        />
      </Route>

      {/* LOGIN and * */}
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Root;
