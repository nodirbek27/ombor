import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const ItParkNavbar = () => {
  const navigate = useNavigate();
  const onLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="">
      <div className="">
        {/* Navbar */}
        <div className="bg-white border-b text-gray-700">
          <div className="navbar max-w-7xl mx-auto">
            <div className="navbar-start p-2">
              <div className="dropdown">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost lg:hidden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h8m-8 6h16"
                    />
                  </svg>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <Link to="talabnoma">Talabnoma</Link>
                  </li>
                  <li>
                    <Link to="arxiv">Arxiv</Link>
                  </li>
                </ul>
              </div>
              <Link className="text-lg text-start" to="/">
                QDPI <br /> Ombor
              </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1">
                <li>
                  <Link to="talabnoma">Talabnoma</Link>
                </li>
                <li>
                  <Link to="arxiv">Arxiv</Link>
                </li>
              </ul>
            </div>
            <div className="navbar-end">
              <button className="btn" onClick={onLogOut}>
                Chiqish
              </button>
            </div>
          </div>
        </div>
        {/* END Navbar */}
      </div>
      {/* Outlet */}
      <div className="flex-1 bg-white max-w-7xl mx-auto p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default ItParkNavbar;
