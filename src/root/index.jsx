import React from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Ombor from "../pages/Ombor";

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
import KomendantOmbor from "../pages/KomendantDashboard/Ombor";
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

// PDF Talabnoma
import Talabnomalar from "../components/Talabnomalar";

const Root = () => {
  return (
    <Routes>
      {/* TALABNOMALAR */}
      <Route path="/talabnoma/:pk" element={<Talabnomalar />} />

      {/* SUPERADMIN */}
      <Route
        path="/superadmin/*"
        element={
          <PrivateRoute requiredRole="admin">
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
          <PrivateRoute requiredRole="omborchi">
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
          <PrivateRoute requiredRole="komendant">
            <KomendantDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<KomendantOmbor />} />
        <Route path="ombor" element={<KomendantOmbor />} />
        <Route path="chiqgan-mahsulotlar" element={<KomendantArxivTasdiq />} />
        <Route path="rad-etilgan-mahsulotlar" element={<KomendantArxivRad />} />
        <Route path="savatcha" element={<KomendantSavatcha />} />
      </Route>

      {/* PROREKTOR */}
      <Route
        path="/prorektor/*"
        element={
          <PrivateRoute requiredRole="prorektor">
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
          <PrivateRoute requiredRole="bugalter">
            <BugalterDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<BugalterTalabnoma />} />
        <Route path="talabnoma" element={<BugalterTalabnoma />} />
        <Route path="ombor" element={<Ombor />} />
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
          <PrivateRoute requiredRole="xojalik">
            <XojalikDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<XojalikTalabnoma />} />
        <Route path="talabnoma" element={<XojalikTalabnoma />} />
        <Route path="ombor" element={<Ombor />} />
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
          <PrivateRoute requiredRole="rttm">
            <ItParkDashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<ItParkTalabnoma />} />
        <Route path="talabnoma" element={<ItParkTalabnoma />} />
        <Route path="ombor" element={<Ombor />} />
        <Route path="chiqgan-mahsulotlar" element={<ChiqganMahsulotlar />} />
        <Route
          path="rad-etilgan-mahsulotlar"
          element={<RadEtilganMahsulotlar />}
        />
      </Route>

      {/* LOGIN and * */}
      <Route path="/" element={<Login />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Root;
