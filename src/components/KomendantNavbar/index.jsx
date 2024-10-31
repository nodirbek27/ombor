import React, { useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { RiMenu2Fill } from "react-icons/ri";
import { CgClose } from "react-icons/cg";

const KomendantNavbar = () => {
  const { totalItems } = useSelector((state) => state.cart);

  const [open, setOpen] = useState(false);
  const location = useLocation();

  const Menus = [
    { title: "Mahsulotlar", link: "/komendant/mahsulotlar" },
    { title: "Qabul qilingan", link: "/komendant/olingan-mahsulotlar" },
  ];

  const onLogout = () => {
    Navigate("/login");
  };

  return (
    <div className="">
      <div className="bg-white header sticky top-0 z-50 shadow-xl border-b-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 relative">
          <div>
            <a href="/komendant" className="logo text-xl font-semibold">
              QDPI Ombor
            </a>
          </div>

          {/* navbar menu */}
          <ul className="hidden md:flex items-center">
            {Menus.map((Menu, index) => (
              <li key={index}>
                <Link
                  to={Menu.link}
                  className={`flex rounded-md p-2 cursor-pointer hover:bg-gray-400 transition-colors duration-300 text-[#004269] font-semibold text-md items-center gap-x-4
                  ${location.pathname === Menu.link ? "bg-gray-400" : ""}`}
                >
                  <span
                    className={`${
                      !open && "hidden"
                    } md:block origin-left duration-200`}
                  >
                    {Menu.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Savat va menu */}
          <div className="flex items-center">
            <Link to="savatcha" className="relative  mr-5 text-2xl">
              <MdOutlineLocalGroceryStore />
              <div className="items_count absolute -top-3 -right-4 bg-yellow-500 rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-white text-sm">{totalItems}</span>
              </div>
            </Link>
            <Link className="mr-5 text-2xl" onClick={() => setOpen(!open)}>
              {open ? <CgClose /> : <RiMenu2Fill />}
            </Link>

            {/* Mobile menu */}
            <ul
              className={`absolute border-2 top-12 right-8 rounded-md p-3 bg-white ${
                !open && "hidden"
              }`}
            >
              {Menus.map((Menu, index) => (
                <li key={index}>
                  <Link
                    to={Menu.link}
                    className={`w-full p-1 rounded-md cursor-pointer hover:bg-gray-400 transition-colors duration-300 text-[#004269] font-semibold text-md items-center gap-x-4 md:hidden
                  ${
                    location.pathname === Menu.link && open ? "bg-gray-400" : ""
                  }`}
                  >
                    <span
                      className={`${
                        !open && "hidden"
                      } md:block origin-left duration-200`}
                    >
                      {Menu.title}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                {/* Chiqish */}
                <Link
                  className="p-1 rounded-md cursor-pointer hover:bg-gray-400 transition-colors duration-300 text-[#004269] font-semibold text-md items-center gap-x-4"
                  onClick={() => onLogout()}
                >
                  Chiqish
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="p-4 max-w-7xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default KomendantNavbar;
