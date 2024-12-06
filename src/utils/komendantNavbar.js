// LOGIN
import Login from "../components/Login";

import KomendantOmbor from "../pages/KomendantDashboard/Ombor";
import KomendantArxiv from "../pages/KomendantDashboard/Arxiv";
import KomendantSavat from "../pages/KomendantDashboard/Savat";

const menus = [
  {
    id: 1,
    title: "Ombor",
    link: "/komendant/ombor",
    isPrivate: true,
    element: KomendantOmbor,
  },
  {
    id: 2,
    title: "Tasdiqlangan buyurtmalar",
    link: "/komendant/chiqgan-mahsulotlar",
    isPrivate: true,
    element: KomendantArxiv,
  },
  {
    id: 3,
    title: "Rad etilgan buyurtmalar",
    link: "/komendant/rad-etilgan-mahsulotlar",
    isPrivate: true,
    element: KomendantArxiv,
  },
  {
    id: 4,
    title: "Savat",
    link: "/komendant/savatcha",
    isPrivate: true,
    element: KomendantSavat,
    hidden: true,
  },
  {
    id: 5,
    title: "Log In",
    path: "/",
    isPrivate: true,
    element: Login,
    hidden: true,
  },
];

export default menus;
