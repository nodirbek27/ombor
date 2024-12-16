import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import APIUsers from "../../services/user";
import APIBuyurtma from "../../services/buyurtma";
import APIArxivRad from "../../services/arxivRad";
import menus from "../../utils/komendantNavbar";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { RiMenu2Fill } from "react-icons/ri";
import { CgClose } from "react-icons/cg";
import logo from "../../assets/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartLength } from "../../redux/cartSlice";
import { IoIosArrowDown } from "react-icons/io";

const KomendantNavbar = () => {
  const [user, setUser] = useState(null);
  const [radUsers, setRadUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [rejectedBuyurtma, setRejectedBuyurtma] = useState([]);
  const [rejectedMahsulotlar, setRejectedMahsulotlar] = useState([]);
  const [findRadUser, setFindRadUser] = useState(null);
  const dispatch = useDispatch();
  const cartLength = useSelector((state) => state.cart.cartLength);

  useEffect(() => {
    dispatch(fetchCartLength());
  }, [dispatch]);

  const navigate = useNavigate();

  // Fetch rejected buyurtma
  useEffect(() => {
    const getBuyurtma = async () => {
      try {
        const userId = Number(localStorage.getItem("userId"));
        const response = await APIBuyurtma.get();
        const filteredRadBuyurtma = response?.data?.filter(
          (item) =>
            item.user === userId && !item.sorov && item.active && item.rad
        );
        if (filteredRadBuyurtma.length > 0) {
          setRejectedBuyurtma(filteredRadBuyurtma);
          setShowModal(true);
        }
      } catch (error) {
        console.error("Failed to fetch buyurtma", error);
      }
    };
    getBuyurtma();
  }, []);

  // Fetch rejected mahsulotlar
  useEffect(() => {
    const getRadMahsulotlar = async () => {
      try {
        const response = await APIArxivRad.get();
        // *** TUZATISH: To'g'ri buyurtma ID sini olish ***
        // Agar siz barcha buyurtmalarni ko'rib chiqayotgan bo'lsangiz, u holda quyidagi kabi qilish mumkin:
        const buyurtmaIds = rejectedBuyurtma.map((b) => b.id);
        const filteredRadMahsulotlar = response?.data?.filter(
          (item) => item.active && buyurtmaIds.includes(item.buyurtma)
        );
        if (filteredRadMahsulotlar.length > 0) {
          setRejectedMahsulotlar(filteredRadMahsulotlar);
          setFindRadUser(filteredRadMahsulotlar[0]);
          setShowModal(true);
        }
      } catch (error) {
        console.error("Failed to fetch mahsulotlar", error);
      }
    };
    if (rejectedBuyurtma.length > 0) {
      getRadMahsulotlar();
    }
  }, [rejectedBuyurtma]);

  // Fetch user profile
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const response = await APIUsers.get();
          setRadUsers(response?.data || []);
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
    getUserProfile();
  }, [findRadUser?.user]);

  const [open, setOpen] = useState(false);
  const location = useLocation();

  const onLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleChange = async (buyurtma) => {
    try {
      if (buyurtma) {
        // Update the active status of the buyurtma
        await APIBuyurtma.patch(buyurtma.id, { active: false, rad: false });
      }

      if (rejectedMahsulotlar && rejectedMahsulotlar.length > 0) {
        await Promise.all(
          rejectedMahsulotlar.map((item) =>
            APIArxivRad.patch(item.id, { active: false })
          )
        );
      }

      // Yangi buyurtma yoki mahsulotlar holatini yangilagandan so'ng modalni yopish
      setShowModal(false);
      setRejectedBuyurtma([]);
      setRejectedMahsulotlar([]);
    } catch (error) {
      console.error("Failed to update rejected mahsulotlar", error);
    }
  };

  const toggleDropdown = (menuId) => {
    setShowDropdown(showDropdown === menuId ? null : menuId);
  };

  return (
    <div className="">
      <div className="bg-white header sticky top-0 z-50 shadow-xl border-b-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 relative">
          <div>
            <Link
              to="/komendant/ombor/xojalik-bolimi"
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
                className={`absolute border-2 top-14 right-8 rounded-md p-3 bg-white ${
                  !open && "hidden"
                }`}
              >
                <li className="p-1 rounded-md cursor-pointer hover:text-blue-700 transition-colors duration-300 text-[#111] font-semibold text-md items-center gap-x-4">
                  {user
                    ? `${user.first_name} ${user.last_name}`
                    : "Foydalanuvchi"}
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

        {/* Modal for rejected order */}
        {showModal && rejectedBuyurtma.length > 0 && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="max-w-[320px] md:max-w-[450px] flex flex-col items-center border p-6 rounded bg-white">
              {rejectedBuyurtma.map((buyurtma) => {
                const rejectedMahsulot = rejectedMahsulotlar.find(
                  (rM) => rM.buyurtma === buyurtma.id
                );
                const radUser = radUsers.find(
                  (u) => u.id === rejectedMahsulot?.user
                );
                return (
                  <div key={buyurtma.id} className="w-full text-center mb-3">
                    <p className="text-red-500 italic md:text-lg">
                      Sizning <strong>{buyurtma.id}</strong> raqamli
                      buyurtmangizni{" "}
                      <strong>
                        {radUser ? `${radUser?.first_name} ${radUser?.last_name}` : "Yuklanmoqda..."}
                      </strong>{" "}
                      rad etdi!
                    </p>
                    <button
                      onClick={() => handleChange(buyurtma)}
                      className="btn btn-warning w-full mt-4"
                    >
                      Yopish
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="p-4 max-w-7xl mx-auto bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default KomendantNavbar;
