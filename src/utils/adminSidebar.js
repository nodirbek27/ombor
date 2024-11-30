import { ReactComponent as Birlik } from "../assets/icons/scale.svg";
import { ReactComponent as Category } from "../assets/icons/category.svg";
import { ReactComponent as Ombor } from "../assets/icons/warehouse-icon.svg";
import { ReactComponent as Mahsulot } from "../assets/icons/items.svg";
import { ReactComponent as Arxiv } from "../assets/icons/arxiv.svg";

// LOGIN
import Login from "../components/Login";

// HOME
import AdminOmbor from "../pages/AdminDashboard/Ombor";
import AdminBirlik from "../pages/AdminDashboard/Birlik";
import AdminKategoriya from "../pages/AdminDashboard/Kategoriya";
import KiritilganMahsulotlar from "../pages/AdminDashboard/ArxivPage/KiritilganMahsulotlar";
import ChiqganMahsulotlar from "../pages/AdminDashboard/ArxivPage/ChiqganMahsulotlar";
import RadEtilganMahsulotlar from "../pages/AdminDashboard/ArxivPage/RadEtilganMahsulotlar";
import AdminMahsulotYaratish from "../pages/AdminDashboard/MahsulotlarYaratish";

const sidebar = [
  {
    id: 1,
    title: "Ombor",
    path: "/omborchi/ombor",
    icon: Ombor,
    isPrivate: true,
    element: AdminOmbor,
    role: ["omborchi"],
  },
  {
    id: 2,
    title: "Kategoriya",
    path: "/omborchi/kategoriya",
    icon: Category,
    isPrivate: true,
    element: AdminKategoriya,
    role: ["omborchi"],
  },
  {
    id: 3,
    title: "O'lchov birliklari",
    path: "/omborchi/birlik",
    icon: Birlik,
    isPrivate: true,
    element: AdminBirlik,
    role: ["omborchi"],
  },
  {
    id: 4,
    title: "Mahsulot",
    path: "/omborchi/mahsulot",
    icon: Mahsulot,
    isPrivate: true,
    element: AdminMahsulotYaratish,
    role: ["omborchi"],
  },
  {
    id: 5,
    title: "Arxiv",
    path: "/omborchi/arxiv",
    icon: Arxiv,
    isPrivate: true,
    element: "",
    role: ["omborchi"],
    children: [
      {
        id: 5 - 1,
        title: "Kiritilgan mahsulotlar",
        path: "/omborchi/arxiv/kiritilgan-mahsulotlar",
        isPrivate: true,
        element: KiritilganMahsulotlar,
        role: ["omborchi"],
      },
      {
        id: 5 - 2,
        title: "Tasdiqlangan buyurtmalar",
        path: "/omborchi/arxiv/chiqgan-mahsulotlar",
        isPrivate: true,
        element: ChiqganMahsulotlar,
        role: ["omborchi"],
      },
      {
        id: 5 - 3,
        title: "Rad etilgan buyurtmalar",
        path: "/omborchi/arxiv/rad-etilgan-mahsulotlar",
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
