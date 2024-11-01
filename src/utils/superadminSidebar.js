//Icons
// import Settings from "../assets/icons/setting.svg?react";

// import { ReactComponent as Analitika } from "../assets/icons/analytics.svg";
import { ReactComponent as Admin } from "../assets/icons/admin.svg";
import { ReactComponent as Arxiv } from "../assets/icons/arxiv.svg";
import { ReactComponent as Mahsulot } from "../assets/icons/items.svg";

// LOGIN
import Login from "../components/Login";

// HOME
import SuperadminMahsulotlar from "../pages/SuperadminDashboard/Mahsulotlar";
import SuperadminAdminlar from "../pages/SuperadminDashboard/Adminlar";
import SuperadminKategoriya from "../pages/SuperadminDashboard/ArxivPage";

const sidebar = [
  {
    id: 1,
    title: "Mahsulotlar",
    path: "/superadmin/mahsulotlar",
    icon: Mahsulot,
    isPrivate: true,
    element: SuperadminMahsulotlar,
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
    id: 4,
    title: "Arxiv",
    path: "/superadmin/arxiv",
    icon: Arxiv,
    isPrivate: true,
    element: SuperadminKategoriya,
    role: ["admin"],
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
