import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import APIUsers from "../../services/user";
import APISavat from "../../services/savat";
import APIBuyurtma from "../../services/buyurtma";
import menus from "../../utils/komendantNavbar";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { RiMenu2Fill } from "react-icons/ri";
import { CgClose } from "react-icons/cg";
import logo from "../../assets/images/logo.png"

const KomendantNavbar = () => {
  const [user, setUser] = useState([]);
  const [buyurtma, setBuyurtma] = useState(null);
  const [savat, setSavat] = useState(null);

  useEffect(() => {
    const getBuyurtma = async () => {
      try {
        const userId = Number(localStorage.getItem("userId"));
        const response = await APIBuyurtma.get();
        const filteredBuyurtma = response?.data?.filter(
          (item) => item.user === userId && item.active
        );
        setBuyurtma(filteredBuyurtma);
      } catch (error) {
        console.error("Failed to fetch buyurtma", error);
      }
    };
    getBuyurtma();
  }, []);

  useEffect(() => {
    const getSavat = async () => {
      try {
        if (buyurtma && buyurtma[0]?.id) {
          // Add check for buyurtma
          const response = await APISavat.get();
          const filteredSavat = response?.data?.filter(
            (item) => item.buyurtma === buyurtma[0].id
          );
          setSavat(filteredSavat?.length);
        }
      } catch (error) {
        console.error("Failed to fetch savat", error);
      }
    };
    getSavat();
  }, [buyurtma]);

  const navigate = useNavigate();

  const getUserProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response = await APIUsers.get();
        const loggedInUser = response.data.find(
          (item) => item.id === parseInt(userId)
        );

        if (loggedInUser) {
          setUser(loggedInUser);
        } else {
          console.error("User not found");
        }
      }
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const [open, setOpen] = useState(false);
  const location = useLocation();

  const onLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="">
      <div className="bg-white header sticky top-0 z-50 shadow-xl border-b-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 relative">
          <div>
            <a href="/komendant" className="logo flex items-start text-xl font-semibold">
            <img className="mr-3" src={logo} alt="" />
              QDPI <br /> Ombor
            </a>
          </div>

          <div className="flex items-center">
            {/* Navbar menu */}
            <ul className="hidden md:flex items-center mr-3">
              {menus.map((menu) => {
                return !menu.hidden ? (
                  <li key={menu.id} className="mr-3">
                    <Link
                      to={menu.link}
                      className={`flex rounded-md p-2 cursor-pointer hover:text-blue-700 transition-colors duration-300 text-[#111] font-semibold text-md items-center gap-x-4
                  ${location.pathname === menu.link ? "text-blue-700" : ""}`}
                    >
                      <span
                        className={`${
                          !open && "hidden"
                        } md:block origin-left duration-200`}
                      >
                        {menu.title}
                      </span>
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>

            {/* Cart and menu */}
            <div className="flex items-center">
              <Link to="savatcha" className="relative mr-5 text-2xl">
                <MdOutlineLocalGroceryStore />
                <div className="items_count absolute -top-3 -right-4 bg-yellow-500 rounded-full w-6 h-6 flex items-center justify-center">
                  <span className="text-white text-sm">
                    {savat ? savat : "0"}
                  </span>{" "}
                  {/* Displaying cart count */}
                </div>
              </Link>
              <Link className="mr-5 text-2xl" onClick={() => setOpen(!open)}>
                {open ? <CgClose /> : <RiMenu2Fill />}
              </Link>

              {/* Mobile menu */}
              <ul
                className={`absolute border-2 top-14 right-8 rounded-md p-3 bg-white ${
                  !open && "hidden"
                }`}
              >
                <li className="p-1 rounded-md cursor-pointer hover:text-blue-700 transition-colors duration-300 text-[#111] font-semibold text-md items-center gap-x-4">
                  {user.first_name} {user.last_name}
                </li>
                {menus.map((menu) => {
                  return !menu.hidden ? (
                    <li key={menu.id}>
                      <Link
                        to={menu.link}
                        className={`w-full p-1 rounded-md cursor-pointer hover:text-blue-700 transition-colors duration-300 text-[#111] font-semibold text-md items-center gap-x-4 md:hidden
                  ${
                    location.pathname === menu.link && open ? "text-blue-700" : ""
                  }`}
                      >
                        <span
                          className={`${
                            !open && "hidden"
                          } md:block origin-left duration-200`}
                        >
                          {menu.title}
                        </span>
                      </Link>
                    </li>
                  ) : null;
                })}
                <li>
                  {/* Logout */}
                  <button
                    className="p-1 rounded-md cursor-pointer hover:text-blue-700 transition-colors duration-300 text-[#111] font-semibold text-md items-center gap-x-4"
                    onClick={onLogOut}
                  >
                    Chiqish
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 max-w-7xl mx-auto bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default KomendantNavbar;
