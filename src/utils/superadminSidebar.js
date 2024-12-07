//Icons
// import Settings from "../assets/icons/setting.svg?react";

// import { ReactComponent as Analitika } from "../assets/icons/analytics.svg";
import { ReactComponent as Admin } from "../assets/icons/admin.svg";
import { ReactComponent as Bino } from "../assets/icons/building.svg";
import { ReactComponent as Arxiv } from "../assets/icons/arxiv.svg";
import { ReactComponent as Ombor } from "../assets/icons/warehouse-icon.svg";

// LOGIN
import Login from "../components/Login";

// HOME
import SuperadminOmbor from "../pages/SuperadminDashboard/Ombor";
import SuperadminAdminlar from "../pages/SuperadminDashboard/Adminlar";
import SuperadminBinolar from "../pages/SuperadminDashboard/Binolar";
import SuperadminKategoriya from "../pages/SuperadminDashboard/ArxivPage";
import ChiqganMahsulotlar from "../pages/AdminDashboard/ArxivPage/ChiqganMahsulotlar";
import RadEtilganMahsulotlar from "../pages/AdminDashboard/ArxivPage/RadEtilganMahsulotlar";

const sidebar = [
  {
    id: 1,
    title: "Ombor",
    path: "/superadmin/ombor",
    icon: Ombor,
    isPrivate: true,
    element: SuperadminOmbor,
    role: ["admin"],
  },
  {
    id: 2,
    title: "Adminlar",
    path: "/superadmin/adminlar",
    icon: Admin,
    isPrivate: true,
    element: SuperadminAdminlar,
    role: ["admin"],
  },
  {
    id: 3,
    title: "Binolar",
    path: "/superadmin/binolar",
    icon: Bino,
    isPrivate: true,
    element: SuperadminBinolar,
    role: ["admin"],
  },
  {
    id: 4,
    title: "Arxiv",
    path: "/superadmin/arxiv",
    icon: Arxiv,
    isPrivate: true,
    element: SuperadminKategoriya,
    role: ["admin"],
    children: [
      {
        id: 4 - 1,
        title: "Tasdiqlangan buyurtmalar",
        path: "/superadmin/arxiv/chiqgan-mahsulotlar",
        isPrivate: true,
        element: ChiqganMahsulotlar,
        role: ["omborchi"],
      },
      {
        id: 4 - 2,
        title: "Rad etilgan buyurtmalar",
        path: "/superadmin/arxiv/rad-etilgan-mahsulotlar",
        isPrivate: true,
        element: RadEtilganMahsulotlar,
        role: ["omborchi"],
      },
    ],
  },
  {
    id: 11,
    title: "Log In",
    path: "/",
    isPrivate: true,
    element: Login,
    hidden: true,
  },
];
export default sidebar;
