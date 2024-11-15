import React, { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import APIUsers from "../../services/user";
import APIBuyurtma from "../../services/buyurtma";
import APIArxiv from "../../services/arxiv";
import APIMahsulot from "../../services/mahsulot";
import APIBirlik from "../../services/birlik";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

const Arxiv = () => {
  const [arxiv, setArxiv] = useState([]);
  const [buyurtmalar, setBuyurtmalar] = useState([]);
  const [mahsulot, setMahsulot] = useState([]);
  const [birlik, setBirlik] = useState([]);
  const [users, setUsers] = useState({});
  const [admin, setAdmin] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  useEffect(() => {
    const getBuyurtmalar = async () => {
      try {
        const response = await APIBuyurtma.get();
        const filteredBuyurtmalar = response?.data
          ?.reverse()
          .filter((item) => item.tasdiq && !item.active);
        setBuyurtmalar(filteredBuyurtmalar);

        // Fetch user data for each buyurtma
        const userPromises = filteredBuyurtmalar.map((buyurtma) =>
          APIUsers.getbyId(`/${buyurtma.user}`).then((response) => {
            const user = response?.data;
            return {
              [buyurtma.user]: `${user?.first_name || "Noma'lum"} ${
                user?.last_name || ""
              }`.trim(),
            };
          })
        );

        const usersData = await Promise.all(userPromises);
        setUsers(Object.assign({}, ...usersData));
      } catch (error) {
        console.error("Failed to fetch buyurtmalar or users", error);
      }
    };
    getBuyurtmalar();
  }, []);

  useEffect(() => {
    const getSavat = async () => {
      try {
        if (buyurtmalar.length > 0) {
          const response = await APIArxiv.get();
          const filteredArxiv = response?.data?.filter((item) =>
            buyurtmalar.some((buyurtma) => item.buyurtma === buyurtma.id)
          );
          setArxiv(filteredArxiv);
        }
      } catch (error) {
        console.error("Failed to fetch savat", error);
      }
    };
    getSavat();
  }, [buyurtmalar]);

  useEffect(() => {
    const getAdmin = async () => {
      try {
        const response = await APIUsers.get();
        const findAdmin = response?.data?.find((item) => item.admin === true);
        setAdmin(findAdmin);
      } catch (error) {
        console.error("Failed to fetch admin", error);
      }
    };
    getAdmin();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mahsulotData, birlikData] = await Promise.all([
          APIMahsulot.get(),
          APIBirlik.get(),
        ]);
        setMahsulot(mahsulotData?.data);
        setBirlik(birlikData?.data);
      } catch (error) {
        console.error("Failed to fetch mahsulot or birlik", error);
      }
    };
    fetchData();
  }, []);

  const getMahsulotName = (id) =>
    mahsulot.find((item) => item.id === id)?.name || "Noma'lum";
  const getBirlikName = (id) =>
    birlik.find((item) => item.id === id)?.name || "Noma'lum";

  const downloadPDF = (buyurtma) => {
    if (!arxiv.length) {
      alert("Arxivda ma'lumotlar mavjud emas!");
      return;
    }

    const doc = new jsPDF();
    const orderDate = buyurtma.created_at.split("T")[0];

    doc.setFontSize(12);
    doc.text(`Buyurtma ID: ${buyurtma.id}`, 14, 10);
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.text(`${orderDate}`, 180, 10);

    if (admin) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text(
        `${admin.first_name} ${admin.last_name}`,
        14,
        doc.internal.pageSize.height - 50
      );
    }

    const userName = users[buyurtma.user] || "Noma'lum";
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`${userName}`, 14, doc.internal.pageSize.height - 40);

    const signatureX = doc.internal.pageSize.width - 100;
    doc.text("Imzo (Omborchi):", signatureX, doc.internal.pageSize.height - 52);
    doc.line(
      signatureX,
      doc.internal.pageSize.height - 50,
      signatureX + 80,
      doc.internal.pageSize.height - 50
    );
    doc.text(
      "Imzo (Komendant):",
      signatureX,
      doc.internal.pageSize.height - 42
    );
    doc.line(
      signatureX,
      doc.internal.pageSize.height - 40,
      signatureX + 80,
      doc.internal.pageSize.height - 40
    );

    const tableColumn = ["Mahsulot", "Miqdor"];
    const tableRows = arxiv
      .filter((item) => item.buyurtma === buyurtma.id)
      .map((item) => [
        getMahsulotName(item.maxsulot),
        `${item.qiymat} ${getBirlikName(item.birlik)}`,
      ]);

    doc.autoTable({
      startY: doc.internal.pageSize.height - 275,
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("OlinganMaxsulotlar.pdf");
  };

  // Pagination logic
  const indexOfLastBuyurtma = currentPage * itemsPerPage;
  const indexOfFirstBuyurtma = indexOfLastBuyurtma - itemsPerPage;
  const currentBuyurtmalar = buyurtmalar.slice(
    indexOfFirstBuyurtma,
    indexOfLastBuyurtma
  );

  const totalPages = Math.ceil(buyurtmalar.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <p className="text-xl font-semibold text-[#004269]">Arxiv</p>
      </div>
      <div className="p-4 min-w-full bg-white">
        {currentBuyurtmalar.map((buyurtma) => (
          <div
            key={buyurtma.id}
            className="collapse collapse-arrow join-item border-base-300 border mb-3"
          >
            <input type="radio" name="my-accordion-4" />
            <div className="flex items-center justify-between collapse-title text-md font-medium">
              <h2 className="text-md font-medium">
                {users[buyurtma.user] || "Noma'lum"}
              </h2>
              <div className="italic">{buyurtma.created_at}</div>
            </div>
            <div className="collapse-content">
              <table className="table table-zebra w-full border-collapse border mb-3">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border">Mahsulot</th>
                    <th className="py-2 px-4 border">Miqdor</th>
                  </tr>
                </thead>
                <tbody>
                  {arxiv
                    .filter((item) => item.buyurtma === buyurtma.id)
                    .map((item) => (
                      <tr key={item.id}>
                        <td className="py-2 px-4 border">
                          {getMahsulotName(item.maxsulot)}
                        </td>
                        <td className="py-2 px-4 border">
                          {item.qiymat} {getBirlikName(item.birlik)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="justify-self-end">
                <button
                  onClick={() => downloadPDF(buyurtma)}
                  className="btn bg-blue-400 hover:bg-blue-500 transition-colors duration-300 text-white flex items-center gap-2"
                >
                  <FaDownload />
                  Yuklab olish
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 items-center">
          <MdKeyboardDoubleArrowLeft
            className="w-5 h-auto mr-4 cursor-pointer"
            onClick={handlePrevPage}
            disabled={currentPage === totalPages}
          />
          {/* Page Numbers */}
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
            className="w-5 h-auto ml-4 cursor-pointer"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          />
        </div>
      </div>
    </div>
  );
};

export default Arxiv;
