// import { ReactComponent as Analitika } from "../assets/icons/analytics.svg";
import { ReactComponent as Category } from "../assets/icons/category.svg";
import { ReactComponent as Mahsulot } from "../assets/icons/items.svg";
import { ReactComponent as Arxiv } from "../assets/icons/arxiv.svg";

// LOGIN
import Login from "../components/Login";

// HOME
import AdminMahsulotlar from "../pages/AdminDashboard/Mahsulotlar";
import AdminKategoriya from "../pages/AdminDashboard/Kategoriya";
import AdminArxiv from "../pages/AdminDashboard/ArxivPage";

const sidebar = [
  {
    id: 1,
    title: "Mahsulotlar",
    path: "/admin/mahsulotlar",
    icon: Mahsulot,
    isPrivate: true,
    element: AdminMahsulotlar,
    role: ["admin"],
  },
  {
    id: 3,
    title: "Kategoriya",
    path: "/admin/kategoriya",
    icon: Category,
    isPrivate: true,
    element: AdminKategoriya,
    role: ["admin"],
  },
  {
    id: 4,
    title: "Arxiv",
    path: "/admin/arxiv",
    icon: Arxiv,
    isPrivate: true,
    element: AdminArxiv,
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