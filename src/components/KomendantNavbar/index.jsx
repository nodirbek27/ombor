import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import menus from "../../utils/komendantNavbar";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { RiMenu2Fill } from "react-icons/ri";
import { CgClose } from "react-icons/cg";
import logo from "../../assets/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartLength } from "../../redux/cartSlice";
import { IoIosArrowDown } from "react-icons/io";
import CryptoJS from "crypto-js";
import KomendantTasdiqRadModal from "../KomendantTasdiqRadModal";

const KomendantNavbar = () => {
  const [showDropdown, setShowDropdown] = useState(null);
  const dispatch = useDispatch();
  const cartLength = useSelector((state) => state.cart.cartLength);

  const [name, setName] = useState([]);
  const [lastName, setLastName] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    if (data) {
      const unShifredName = CryptoJS.AES.decrypt(
        data?.first_name,
        "first_name-001"
      )
        .toString(CryptoJS.enc.Utf8)
        .trim()
        .replace(/^"|"$/g, "");
      setName(unShifredName);

      const unShifredLastName = CryptoJS.AES.decrypt(
        data?.last_name,
        "last_name-001"
      )
        .toString(CryptoJS.enc.Utf8)
        .trim()
        .replace(/^"|"$/g, "");
      setLastName(unShifredLastName);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchCartLength());
  }, [dispatch]);

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const location = useLocation();

  const onLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleDropdown = (menuId) => {
    setShowDropdown(showDropdown === menuId ? null : menuId);
  };

  return (
    <div className="">
      <div className="bg-white header sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 relative border-b-2">
          <div>
            <Link
              to="/komendant/ombor"
              className="logo flex items-start text-xl font-semibold"
            >
              <img className="mr-3" src={logo} alt="Logo" />
              QDPI <br /> Ombor
            </Link>
          </div>

          <div className="flex items-center">
            {/* Navbar menu */}
            <ul className="hidden md:flex items-center mr-3">
              {menus.map(
                (menu) =>
                  !menu.hidden && (
                    <li key={menu.id} className="relative mr-3">
                      <div
                        className={`flex rounded-md p-2 cursor-pointer hover:text-blue-700 transition-colors duration-300 text-[#111] font-semibold text-md items-center gap-x-4 ${
                          location.pathname === menu.link ? "text-blue-700" : ""
                        }`}
                        onClick={() =>
                          menu.children
                            ? toggleDropdown(menu.id)
                            : navigate(menu.link)
                        }
                      >
                        <span>{menu.title}</span>
                        {menu.children && (
                          <IoIosArrowDown
                            className={`transition-transform duration-300 ${
                              showDropdown === menu.id
                                ? "rotate-180"
                                : "rotate-0"
                            }`}
                          />
                        )}
                      </div>
                      {/* Dropdown for children */}
                      {menu.children && showDropdown === menu.id && (
                        <ul className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md border z-10">
                          {menu.children.map((child) => (
                            <li key={child.id}>
                              <Link
                                to={child.link}
                                className="block px-4 py-2 hover:bg-gray-100 text-sm text-[#111] whitespace-nowrap"
                              >
                                {child.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )
              )}
            </ul>

            {/* Cart and menu */}
            <div className="flex items-center">
              <Link to="savatcha" className="relative mr-5 text-2xl">
                <MdOutlineLocalGroceryStore />
                <div className="items_count absolute -top-3 -right-4 bg-yellow-500 rounded-full w-6 h-6 flex items-center justify-center">
                  <span className="text-white text-sm">
                    {cartLength ? cartLength : "0"}
                  </span>
                </div>
              </Link>
              <button
                className="mr-5 text-2xl"
                onClick={() => setOpen(!open)}
                aria-label="Toggle Menu"
              >
                {open ? <CgClose /> : <RiMenu2Fill />}
              </button>

              {/* Mobile menu */}
              <ul
                className={`absolute border-2 top-14 right-8 rounded-md p-3 bg-white z-10 ${
                  !open && "hidden"
                }`}
              >
                <li className="p-1 rounded-md cursor-pointer hover:text-blue-700 transition-colors duration-300 text-[#111] font-semibold text-md items-center gap-x-4">
                  {name} {lastName}
                </li>
                {menus.map(
                  (menu) =>
                    !menu.hidden && (
                      <li key={menu.id} className="relative mr-3 md:hidden">
                        <div
                          className={`flex justify-between rounded-md p-2 cursor-pointer hover:text-blue-700 transition-colors duration-300 text-[#111] font-semibold text-md items-center gap-x-4 ${
                            location.pathname === menu.link
                              ? "text-blue-700"
                              : ""
                          }`}
                          onClick={() =>
                            menu.children
                              ? toggleDropdown(menu.id)
                              : navigate(menu.link)
                          }
                        >
                          <span>{menu.title}</span>
                          {menu.children && (
                            <IoIosArrowDown
                              className={`transition-transform duration-300 ${
                                showDropdown === menu.id
                                  ? "rotate-180"
                                  : "rotate-0"
                              }`}
                            />
                          )}
                        </div>
                        {/* Dropdown for children */}
                        {menu.children && showDropdown === menu.id && (
                          <ul className="top-full left-0 mt-2 z-10">
                            {menu.children.map((child) => (
                              <li
                                key={child.id}
                                className="font-semibold text-md"
                              >
                                <Link
                                  to={child.link}
                                  className="block px-4 py-2 hover:bg-gray-100 text-sm text-[#111]"
                                >
                                  {child.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                )}
                <li>
                  <button
                    className="w-full text-left p-1 rounded-md cursor-pointer hover:text-blue-700 transition-colors duration-300 text-[#111] font-semibold text-md"
                    onClick={onLogOut}
                  >
                    Chiqish
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="pb-4 max-w-7xl mx-auto bg-white">
          <div className="marquee-container mb-3">
            <div className="marquee">Sayt test rejimida ishlayapti</div>
          </div>
          <KomendantTasdiqRadModal />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default KomendantNavbar;
