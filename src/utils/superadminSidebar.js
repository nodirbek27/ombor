//Icons
// import Settings from "../assets/icons/setting.svg?react";

// import { ReactComponent as Analitika } from "../assets/icons/analytics.svg";
import { ReactComponent as Admin } from "../assets/icons/admin.svg";
import { ReactComponent as Arxiv } from "../assets/icons/arxiv.svg";
import { ReactComponent as Ombor } from "../assets/icons/warehouse-icon.svg";

// LOGIN
import Login from "../components/Login";

// HOME
import SuperadminOmbor from "../pages/SuperadminDashboard/Ombor";
import SuperadminAdminlar from "../pages/SuperadminDashboard/Adminlar";
import SuperadminKategoriya from "../pages/SuperadminDashboard/ArxivPage";

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
