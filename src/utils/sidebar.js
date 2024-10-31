//Icons
// import Settings from "../assets/icons/setting.svg?react";

import { ReactComponent as Analitika } from "../assets/icons/analytics.svg";
import AnalitikaView from "../pages/Main";

// LOGIN
import Login from "../components/Login";

// HOME
// import AsosiyVideo from "../pages/Home/AsosiyVideo";
// import InteraktivXizmatlar from "../pages/Home/InteraktivXizmatlar";
// import Statistika from "../pages/Home/Statistika";

const sidebar = [
  {
    id: 1,
    title: "Mahsulot qo'shish",
    path: "/mahsulot-qo'shish",
    icon: Analitika,
    isPrivate: true,
    element: AnalitikaView,
    role: ["admin"],
  },
  // {
  //   id: 4,
  //   title: "Kategoriyalar",
  //   path: "/category",
  //   icon: Analitika,
  //   isPrivate: true,
  //   element: Analitika,
  //   role: ["admin"],
  //   children: [
  //     {
  //       id: `4-1`,
  //       title: "Asosiy video",
  //       path: "/home/asosiy-video",
  //       isPrivate: true,
  //       element: AsosiyVideo,
  //       role: ["admin"],
  //     },
  //     {
  //       id: `4-2`,
  //       title: "Interaktiv xizmatlar",
  //       path: "/home/interaktiv-xizmatlar",
  //       isPrivate: true,
  //       element: InteraktivXizmatlar,
  //       role: ["admin"],
  //     },
  //     {
  //       id: `4-3`,
  //       title: "Statistika",
  //       path: "/home/statistika",
  //       isPrivate: true,
  //       element: Statistika,
  //       role: ["admin"],
  //     },
  //   ],
  // },
  {
    id: 11,
    title: "Log In",
    path: "/login",
    isPrivate: true,
    element: Login,
    hidden: true,
  },
];
export default sidebar;
