import React, { useEffect, useState } from "react";
import APISavat from "../../services/savat";
import APIBuyurtma from "../../services/buyurtma";
import APIMahsulot from "../../services/mahsulot";
import APIBirlik from "../../services/birlik";
import APIUsers from "../../services/user";
import APIArxiv from "../../services/arxiv";
import APIArxivRad from "../../services/arxivRad";
import { RxCross2, RxCheck } from "react-icons/rx";

const AdminSorov = () => {
  const [savat, setSavat] = useState([]);
  const [buyurtmalar, setBuyurtmalar] = useState([]);
  const [mahsulot, setMahsulot] = useState([]);
  const [birlik, setBirlik] = useState([]);
  const [users, setUsers] = useState({});

  const getBuyurtmalar = async () => {
    try {
      const response = await APIBuyurtma.get();
      const filteredBuyurtmalar = response?.data?.filter(
        (item) =>
          item.sorov &&
          item.active &&
          (item.it_park || item.xojalik_bolimi) &&
          item.prorektor &&
          item.bugalter &&
          !item.omborchi
      );
      setBuyurtmalar(filteredBuyurtmalar);
      // Fetch user data for each buyurtma
      const userPromises = filteredBuyurtmalar.map((buyurtma) =>
        APIUsers.getbyId(`${buyurtma.user}`).then((response) => {
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
  useEffect(() => {
    getBuyurtmalar();
  }, []);

  useEffect(() => {
    const getSavat = async () => {
      try {
        if (buyurtmalar.length > 0) {
          const response = await APISavat.get();
          const filteredSavat = response?.data?.filter((item) =>
            buyurtmalar.some((buyurtma) => item.buyurtma === buyurtma.id)
          );
          setSavat(filteredSavat);
        }
      } catch (error) {
        console.error("Failed to fetch savat", error);
      }
    };
    getSavat();
  }, [buyurtmalar]);

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

  const handleSumbit = async (action, buyurtmaId) => {
    const userId = localStorage.getItem("userId");
    try {
      const postData = savat
        .filter((item) => item.buyurtma === buyurtmaId)
        .map((item) => ({
          qiymat: item.qiymat,
          active: true,
          buyurtma: buyurtmaId,
          maxsulot: item.maxsulot,
          birlik: item.birlik,
          user: userId,
        }));

      if (action === "approve") {
        await Promise.all(
          postData.map(async (data, index) => {
            await APIArxiv.post(data);
            await APISavat.del(savat[index].id);
          })
        );
      } else if (action === "reject") {
        await Promise.all(
          postData.map(async (data, index) => {
            await APIArxivRad.post(data);
            await APISavat.del(savat[index].id);
          })
        );
      }

      // Update buyurtma status
      const updatedBuyurtma = {
        user: buyurtmalar.find((b) => b.id === buyurtmaId)?.user,
        sorov: false,
        active: action === "reject",
        omborchi: action === "approve",
        rad: action === "reject",
      };

      await APIBuyurtma.patch(`${buyurtmaId}`, updatedBuyurtma);
      await getBuyurtmalar();

      // Update state to remove processed buyurtma and savat
      setBuyurtmalar(buyurtmalar.filter((b) => b.id !== buyurtmaId));
      setSavat(savat.filter((item) => item.buyurtma !== buyurtmaId));
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
                    {users[buyurtma.user] || "Noma'lum"}
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
                        <th className="text-gray-700 dark:text-white">Mahsulot</th>
                        <th className="text-gray-700 dark:text-white">Miqdor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {savat
                        .filter((item) => item.buyurtma === buyurtma.id)
                        .map((item) => (
                          <tr
                            key={item.id}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          >
                            <td>{getMahsulotName(item.maxsulot)}</td>
                            <td>
                              {item.qiymat} {getBirlikName(item.birlik)}
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

export default AdminSorov;
