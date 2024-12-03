import React, { useEffect, useState } from "react";
import APIUsers from "../../services/user";
import { Link, Outlet, useNavigate } from "react-router-dom";
import profilePicture from "../../assets/images/profile-picture.png";

const BugalterNavbar = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState([]);

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

  const toggleNavbar = () => setIsNavbarOpen(!isNavbarOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const navigate = useNavigate();
  const onLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="https://flowbite.com/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            {/* <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" /> */}
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-emerald-600 dark:text-white">
              QDPI
            </span>
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              ombor
            </span>
          </a>

          {/* User Menu Button */}
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
            <button
              type="button"
              className="flex text-sm rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              onClick={toggleUserMenu}
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src={profilePicture}
                alt="user view"
              />
            </button>

            {/* Dropdown menu */}
            {isUserMenuOpen && (
              <div className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 absolute top-12 right-0">
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 truncate dark:text-white">
                    {user.first_name} {user.last_name}
                  </span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                    {user.name}
                  </span>
                </div>
                <ul className="py-2">
                  <li>
                    <button
                      onClick={onLogOut}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleNavbar}
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>

          {/* Navbar Links */}
          <div
            className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
              isNavbarOpen ? "block" : "hidden"
            }`}
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link
                  to="talabnoma"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  aria-current="page"
                >
                  Talabnomalar
                </Link>
              </li>
              <li>
                <Link
                  to="chiqgan-mahsulotlar"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Tasdiqlanganlar
                </Link>
              </li>
              <li>
                <Link
                  to="rad-etilgan-mahsulotlar"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Rad etilganlar
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* Outlet */}
      <div className="flex-1 bg-[#FAFAFA] max-w-7xl mx-auto p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default BugalterNavbar;
