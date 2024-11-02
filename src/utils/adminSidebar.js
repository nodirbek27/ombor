import { ReactComponent as Birlik } from "../assets/icons/scale.svg";
import { ReactComponent as Category } from "../assets/icons/category.svg";
import { ReactComponent as Ombor } from "../assets/icons/items.svg";
import { ReactComponent as Mahsulot } from "../assets/icons/items.svg";
import { ReactComponent as Arxiv } from "../assets/icons/arxiv.svg";

// LOGIN
import Login from "../components/Login";

// HOME
import AdminOmbor from "../pages/AdminDashboard/Ombor";
import AdminBirlik from "../pages/AdminDashboard/Birlik";
import AdminKategoriya from "../pages/AdminDashboard/Kategoriya";
import AdminArxiv from "../pages/AdminDashboard/ArxivPage";
import AdminMahsulotYaratish from "../pages/AdminDashboard/";

const sidebar = [
  {
    id: 1,
    title: "Ombor",
    path: "/admin/ombor",
    icon: Ombor,
    isPrivate: true,
    element: AdminOmbor,
    role: ["admin"],
  },
  {
    id: 2,
    title: "Kategoriya",
    path: "/admin/kategoriya",
    icon: Category,
    isPrivate: true,
    element: AdminKategoriya,
    role: ["admin"],
  },
  {
    id: 3,
    title: "O'lchov birliklari",
    path: "/admin/birlik",
    icon: Birlik,
    isPrivate: true,
    element: AdminBirlik,
    role: ["admin"],
  },
  {
    id: 4,
    title: "Mahsulot",
    path: "/admin/mahsulot",
    icon: Mahsulot,
    isPrivate: true,
    element: AdminMahsulotYaratish,
    role: ["admin"],
  },
  {
    id: 5,
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
