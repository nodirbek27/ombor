import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import APIUsers from "../../services/user";
import APISavat from "../../services/savat";
import menus from "../../utils/komendantNavbar";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { RiMenu2Fill } from "react-icons/ri";
import { CgClose } from "react-icons/cg";

const KomendantNavbar = () => {
  const [user, setUser] = useState([]);
  const [savat, setSavat] = useState([]);

  const getSavat = async () => {
    try {
      const response = await APISavat.get();
      setSavat(response.data || []);
    } catch (error) {
      console.error("Failed to fetch savat", error);
    }
  };

  useEffect(() => {
    getSavat();
  }, []);

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
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("refreshToken");
    navigate("/");
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

          <div className="flex items-center">
            {/* Navbar menu */}
            <ul className="hidden md:flex items-center mr-3">
              {menus.map((menu) => {
                return !menu.hidden ? (
                  <li key={menu.id} className="mr-3">
                    <Link
                      to={menu.link}
                      className={`flex rounded-md p-2 cursor-pointer hover:bg-gray-400 transition-colors duration-300 text-[#004269] font-semibold text-md items-center gap-x-4
                  ${location.pathname === menu.link ? "bg-gray-400" : ""}`}
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
                  <span className="text-white text-sm">0</span>{" "}
                  {/* Displaying cart count */}
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
                <li className="p-1 rounded-md cursor-pointer hover:bg-gray-400 transition-colors duration-300 text-[#004269] font-semibold text-md items-center gap-x-4">
                  {user.first_name} {user.last_name}
                </li>
                {menus.map((menu) => {
                  return !menu.hidden ? (
                    <li key={menu.id}>
                      <Link
                        to={menu.link}
                        className={`w-full p-1 rounded-md cursor-pointer hover:bg-gray-400 transition-colors duration-300 text-[#004269] font-semibold text-md items-center gap-x-4 md:hidden
                  ${
                    location.pathname === menu.link && open ? "bg-gray-400" : ""
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
                    className="p-1 rounded-md cursor-pointer hover:bg-gray-400 transition-colors duration-300 text-[#004269] font-semibold text-md items-center gap-x-4"
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
