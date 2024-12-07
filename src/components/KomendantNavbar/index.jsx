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

const KomendantNavbar = () => {
  const [user, setUser] = useState([]);
  const [radUser, setRadUser] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rejectedBuyurtma, setRejectedBuyurtma] = useState(null);
  const [rejectedMahsulotlar, setRejectedMahsulotlar] = useState(null);
  const [findRadUser, setFindRadUser] = useState(null);
  const dispatch = useDispatch();
  const cartLength = useSelector((state) => state.cart.cartLength);

  useEffect(() => {
    dispatch(fetchCartLength());
  }, [dispatch]);

  const navigate = useNavigate();

  useEffect(() => {
    const getBuyurtma = async () => {
      try {
        const userId = Number(localStorage.getItem("userId"));
        const response = await APIBuyurtma.get();
        const filteredRadBuyurtma = response?.data?.filter(
          (item) => item.user === userId && !item.active
        );
        if (filteredRadBuyurtma.length > 0) {
          setRejectedBuyurtma(filteredRadBuyurtma[0]);
          setShowModal(true);
        }
      } catch (error) {
        console.error("Failed to fetch buyurtma", error);
      }
    };
    getBuyurtma();
  }, []);

  useEffect(() => {
    const getRadMahsulotlar = async () => {
      try {
        const response = await APIArxivRad.get();
        const filteredRadMahsulotlar = response?.data?.filter(
          (item) => item.active && item.buyurtma === rejectedBuyurtma?.id
        );
        if (filteredRadMahsulotlar.length > 0) {
          setRejectedMahsulotlar(filteredRadMahsulotlar);
          setFindRadUser(filteredRadMahsulotlar[0]);
          setShowModal(true);
        }
      } catch (error) {
        console.error("Failed to fetch buyurtma", error);
      }
    };
    getRadMahsulotlar();
  }, [rejectedBuyurtma?.id]);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const response = await APIUsers.get();
          const radQilganUser = response?.data.find(
            (item) => item.id === findRadUser?.user
          );
          setRadUser(
            radQilganUser?.first_name + " " + radQilganUser?.last_name
          );
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

  const handleChange = async () => {
    try {
      if (rejectedMahsulotlar && rejectedMahsulotlar.length > 0) {
        // Barcha mahsulotlarni yangilash uchun patch so‘rovlarini yaratish
        await Promise.all(
          rejectedMahsulotlar.map((item) =>
            APIArxivRad.patch(item.id, { active: false })
          )
        );
        setShowModal(false);
        setRejectedBuyurtma(null);
        setRejectedMahsulotlar(null);
      }
    } catch (error) {
      console.error("Failed to update rejected mahsulotlar", error);
    }
  };
  console.log(rejectedMahsulotlar);
  

  return (
    <div className="">
      <div className="bg-white header sticky top-0 z-50 shadow-xl border-b-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 relative">
          <div>
            <a
              href="/komendant"
              className="logo flex items-start text-xl font-semibold"
            >
              <img className="mr-3" src={logo} alt="" />
              QDPI <br /> Ombor
            </a>
          </div>

          <div className="flex items-center">
            {/* Navbar menu */}
            <ul className="hidden md:flex items-center mr-3">
              {menus.map(
                (menu) =>
                  !menu.hidden && (
                    <li key={menu.id} className="mr-3">
                      <Link
                        to={menu.link}
                        className={`flex rounded-md p-2 cursor-pointer hover:text-blue-700 transition-colors duration-300 text-[#111] font-semibold text-md items-center gap-x-4
                        ${
                          location.pathname === menu.link ? "text-blue-700" : ""
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
                {menus.map(
                  (menu) =>
                    !menu.hidden && (
                      <li key={menu.id}>
                        <Link
                          to={menu.link}
                          className={`w-full p-1 rounded-md cursor-pointer hover:text-blue-700 transition-colors duration-300 text-[#111] font-semibold text-md items-center gap-x-4 md:hidden
                          ${
                            location.pathname === menu.link && open
                              ? "text-blue-700"
                              : ""
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
                    )
                )}
                <li>
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

      {/* Modal for rejected order */}
      {showModal && rejectedMahsulotlar && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="max-w-[320px] md:max-w-[450px] flex flex-col items-center border p-3 rounded bg-white">
            <p className="text-red-500 italic md:text-lg mb-3 text-center">
              Sizning {findRadUser?.buyurtma} raqamli buyurtmangizni{" "}
              <strong>{radUser}</strong> rad etdi!
            </p>
            <button onClick={handleChange} className="btn btn-warning w-full">
              OK
            </button>
          </div>
        </div>
      )}

      <div className="p-4 max-w-7xl mx-auto bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default KomendantNavbar;
