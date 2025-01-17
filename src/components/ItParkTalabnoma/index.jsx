import React, { useEffect, useState } from "react";
import APIBuyurtma from "../../services/buyurtma";
// import APIArxivRad from "../../services/arxivRad";
import { RxCross2, RxCheck } from "react-icons/rx";

const ItParkTalabnoma = () => {
  const [buyurtmalar, setBuyurtmalar] = useState([]);

  // Fetch buyurtmalar and related users
  const getBuyurtmalar = async () => {
    try {
      const response = await APIBuyurtma.get();
      const filteredBuyurtmalar = response?.data?.filter(
        (item) => item.buyurtma_role === "rttm"
      );
      setBuyurtmalar(filteredBuyurtmalar);
    } catch (error) {
      console.error("Failed to fetch buyurtmalar or users", error);
    }
  };

  // Fetch savat data based on buyurtmalar
  useEffect(() => {
    getBuyurtmalar();
  }, []);

  // Handle approve or reject actions
  const handleSumbit = async (action, buyurtmaId) => {
    try {
      // Update buyurtma status
      const updatedBuyurtma = {
        rttm: action === "approve",
        rad_etish: action === "reject",
      };

      await APIBuyurtma.patch(`${buyurtmaId}`, updatedBuyurtma);
      await getBuyurtmalar();

      // Update state to remove processed buyurtma and savat
      setBuyurtmalar(buyurtmalar.filter((b) => b.id !== buyurtmaId));
    } catch (error) {
      console.error(
        `Failed to ${action === "approve" ? "approve" : "reject"} buyurtma`,
        error
      );
    }
  };

  return (
    <div>
      <h2 className="mb-5 font-semibold text-xl md:text-2xl text-center text-gray-700">
        Talabnomalar
      </h2>
      {buyurtmalar.length > 0 ? (
        <div className="grid gap-3">
          {buyurtmalar.map((buyurtma) => (
            <div key={buyurtma.id} className={`${buyurtmalar ? "" : "hidden"}`}>
              <div className="collapse collapse-arrow bg-base-200">
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title text-xl font-medium flex justify-between items-center">
                  <h2 className="text-xl font-medium text-gray-700 dark:text-white">
                    {buyurtma?.komendant_user?.last_name}{" "}
                    {buyurtma?.komendant_user?.first_name}
                  </h2>
                  <div className="hidden sm:flex gap-2 z-10">
                    <button
                      onClick={() => handleSumbit("approve", buyurtma.id)}
                      className="bg-green-400 px-6 py-1 rounded-md hover:bg-green-500 transition-colors duration-300 text-white"
                    >
                      <RxCheck className="font-bold" />
                    </button>
                    <button
                      onClick={() => handleSumbit("reject", buyurtma.id)}
                      className="bg-red-400 px-6 py-1 rounded-md focus:bg-red-500 transition-colors duration-300 text-white"
                    >
                      <RxCross2 />
                    </button>
                  </div>
                </div>
                <div className="collapse-content">
                  <table className="table relative overflow-x-auto shadow-md">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr className="text-gray-700 md:text-base">
                        <th>Mahsulot</th>
                        <th>Miqdor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buyurtma?.maxsulotlar?.map((maxsulot) => (
                        <tr
                          key={maxsulot.id}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                          <td>{maxsulot.maxsulot?.name}</td>
                          <td>
                            {maxsulot.qiymat} {maxsulot.maxsulot.birlik.name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-end">
                    <div className="flex gap-2 sm:hidden mt-3">
                      <button
                        onClick={() => handleSumbit("approve", buyurtma.id)}
                        className="bg-green-400 px-6 py-1 rounded-md hover:bg-green-500 focus:ring-4 focus:ring-red-300 dark:focus:ring-gray-600 transition-colors duration-300 text-white"
                      >
                        <RxCheck className="font-bold" />
                      </button>
                      <button
                        onClick={() => handleSumbit("reject", buyurtma.id)}
                        className="bg-red-400 px-6 py-1 rounded-md hover:bg-red-500 transition-colors duration-300 text-white"
                      >
                        <RxCross2 />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center italic text-red-600 text-lg font-medium my-5">
          Sizda talabnomalar mavjud emas.!
        </div>
      )}
    </div>
  );
};

export default ItParkTalabnoma;
