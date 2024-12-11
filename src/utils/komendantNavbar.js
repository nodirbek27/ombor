// LOGIN
import Login from "../components/Login";

import KomendantOmborXojalik from "../pages/KomendantDashboard/Ombor/Xojalik";
import KomendantOmborItPark from "../pages/KomendantDashboard/Ombor/ItPark";
import KomendantArxiv from "../pages/KomendantDashboard/Arxiv";
import KomendantSavat from "../pages/KomendantDashboard/Savat";

const menus = [
  {
    id: 1,
    title: "Ombor",
    isPrivate: true,
    element: "",
    children: [
      {
        id: 1 - 1,
        title: "Xo'jalik bo'limi",
        link: "/komendant/ombor/xojalik-bolimi",
        isPrivate: true,
        element: KomendantOmborXojalik,
      },
      {
        id: 1 - 2,
        title: "IT Park",
        link: "/komendant/ombor/it-park",
        isPrivate: true,
        element: KomendantOmborItPark,
      },
    ],
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
