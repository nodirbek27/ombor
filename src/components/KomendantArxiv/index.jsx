import React, { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa6";
import APITalabnoma from "../../services/talabnoma";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { format } from "date-fns";
import CryptoJS from "crypto-js";

const KomendantArxiv = () => {
  const [buyurtmalar, setBuyurtmalar] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      const data = JSON.parse(localStorage.getItem("data"));
      try {
        if (data) {
          const unShifredId = CryptoJS.AES.decrypt(data?.id, "id-001")
            .toString(CryptoJS.enc.Utf8)
            .trim()
            .replace(/^"|"$/g, "");
          const response = await APITalabnoma.getByUser(unShifredId);
          setBuyurtmalar(response?.data?.reverse());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSumbit = async (id) => {
    try {
      const response = await APITalabnoma.getbyId(id);
      if (response) {
        const pdfUrl = response?.data?.talabnoma_pdf;
        window.open(pdfUrl, "_blank");
      } else {
        console.error("No talabnoma PDF URL in response");
      }
    } catch (err) {
      console.error("Error submitting buyurtma:", err);
    }
  };

  const indexOfLastBuyurtma = currentPage * itemsPerPage;
  const indexOfFirstBuyurtma = indexOfLastBuyurtma - itemsPerPage;
  const currentBuyurtmalar = buyurtmalar.slice(
    indexOfFirstBuyurtma,
    indexOfLastBuyurtma
  );

  const totalPages = Math.ceil(buyurtmalar.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <p className="text-xl font-semibold text-[#004269]">
          Tasdiqlangan buyurtmalar
        </p>
      </div>
      <div className="p-4 min-w-full bg-white">
        {currentBuyurtmalar.map((talabnoma) => (
          <div
            key={talabnoma.id}
            className="join-item border-base-300 border mb-3 rounded"
          >
            <div className="flex items-center justify-between text-md font-medium p-2">
              <h2 className="text-md font-medium text-[#000]">
                {talabnoma?.buyurtma?.komendant_user?.last_name}{" "}
                {talabnoma?.buyurtma?.komendant_user?.first_name}
              </h2>
              <div className="flex items-center">
                <div className="italic text-[#000] mr-3">
                  <span>
                    {format(new Date(talabnoma.created_at), "yyyy-MM-dd")}
                  </span>
                </div>
                <button
                  onClick={() => handleSumbit(talabnoma.id)}
                  className="btn bg-blue-400 hover:bg-blue-500 transition-colors duration-300 text-white flex items-center gap-2"
                >
                  <FaDownload />
                  <span className="hidden lg:block">Yuklab olish</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-center mt-4 items-center">
          <MdKeyboardDoubleArrowLeft
            className={`w-5 h-auto mr-4 cursor-pointer ${
              currentPage === 1 ? "text-gray-300" : "text-black"
            }`}
            onClick={handlePrevPage}
          />
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 text-gray-400 ${
                currentPage === index + 1 ? "text-blue-800" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
          <MdKeyboardDoubleArrowRight
            className={`w-5 h-auto ml-4 cursor-pointer ${
              currentPage === totalPages ? "text-gray-300" : "text-black"
            }`}
            onClick={handleNextPage}
          />
        </div>
      </div>
    </div>
  );
};

export default KomendantArxiv;
