import React, { useState, useEffect } from "react";
import APITalabnoma from "../../services/talabnoma";
import APIArxivRad from "../../services/arxivRad";
import CryptoJS from "crypto-js";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";

const KomendantTasdiqRadModal = () => {
  const [tasdiqlanganBuyurtmalar, setTasdiqlanganBuyurtmalar] = useState([]);
  const [radEtilganBuyurtmalar, setRadEtilganBuyurtmalar] = useState([]);
  const [id, setId] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = JSON.parse(localStorage.getItem("data"));
      if (data) {
        const unShifredId = CryptoJS.AES.decrypt(data?.id, "id-001")
          .toString(CryptoJS.enc.Utf8)
          .trim()
          .replace(/^"|"$/g, "");
        setId(unShifredId);
        // Tasdiqlangan
        const responseTasdiqlangan = await APITalabnoma.getByUserActive(
          unShifredId
        );
        const filteredTasBuyurtma = responseTasdiqlangan?.data;
        setTasdiqlanganBuyurtmalar(filteredTasBuyurtma[0]);

        // Rad etilgan
        const responseRadEtilgan = await APIArxivRad.getByUser(unShifredId);
        const filteredTRadBuyurtma = responseRadEtilgan?.data?.filter(
          (item) => item.active
        );
        setRadEtilganBuyurtmalar(filteredTRadBuyurtma[0]);
      }
    };

    fetchData();
  }, []);

  const handleClose = async (tasdiqId) => {
    try {
      // Tasdiqlangan
      await APITalabnoma.patch(tasdiqId, { active: false });
      const responseTasdiqlangan = await APITalabnoma.getByUserActive(id);
      const filteredTasBuyurtma = responseTasdiqlangan?.data;
      setTasdiqlanganBuyurtmalar(filteredTasBuyurtma[0]);
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  };

  const handleRadClose = async (radId) => {
    try {
      //   Rad etilgan
      await APIArxivRad.patch(radId, { active: false });
      const responseRadEtilgan = await APIArxivRad.getByUser(id);
      const filteredTRadBuyurtma = responseRadEtilgan?.data?.filter(
        (item) => item.active
      );
      setRadEtilganBuyurtmalar(filteredTRadBuyurtma[0]);
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  };

  return (
    <div>
      {/* Tasdiqlangan buyurtma modali */}
      {tasdiqlanganBuyurtmalar && (
        <div
          id="popup-modal"
          tabIndex="-1"
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="p-4 md:p-5 text-center">
                <IoCheckmarkDoneCircleOutline className="text-green-400 w-[60px] h-auto mx-auto" />
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Sizning {tasdiqlanganBuyurtmalar?.buyurtma?.id} raqamli
                  buyurtmangiz tasdqilandi!
                </h3>
                <button
                  data-modal-hide="popup-modal"
                  onClick={() => handleClose(tasdiqlanganBuyurtmalar?.id)}
                  type="button"
                  className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rad etilgan buyurtma modali */}
      {radEtilganBuyurtmalar?.active && (
        <div
          id="popup-modal"
          tabIndex="-1"
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="p-4 md:p-5 text-center">
                <svg
                  className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Sizning {radEtilganBuyurtmalar?.buyurtma?.id} raqamli
                  buyurtmangizni{" "}
                  {radEtilganBuyurtmalar?.rad_etgan_user?.last_name}{" "}
                  {radEtilganBuyurtmalar?.rad_etgan_user?.first_name} rad etdi!
                </h3>
                <button
                  data-modal-hide="popup-modal"
                  onClick={() => handleRadClose(radEtilganBuyurtmalar?.id)}
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KomendantTasdiqRadModal;
