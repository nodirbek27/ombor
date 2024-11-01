// import { ReactComponent as Analitika } from "../assets/icons/analytics.svg";
import { ReactComponent as Category } from "../assets/icons/category.svg";
import { ReactComponent as Mahsulot } from "../assets/icons/items.svg";

// LOGIN
import Login from "../components/Login";

// HOME
import AdminMahsulotlar from "../pages/AdminDashboard/Mahsulotlar";
import AdminKategoriya from "../pages/AdminDashboard/Kategoriya";

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
    id: 4,
    title: "Kategoriya",
    path: "/admin/kategoriya",
    icon: Category,
    isPrivate: true,
    element: AdminKategoriya,
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