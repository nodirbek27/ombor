import React, { useEffect, useState } from "react";
import APISavat from "../../services/savat";
import APIBuyurtma from "../../services/buyurtma";
import APIMahsulot from "../../services/mahsulot";
import APIBirlik from "../../services/birlik";
import APIArxiv from "../../services/arxiv";
import APIArxivRad from "../../services/arxivRad";
import APIUsers from "../../services/user";

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
          item.prorektor &&
          item.bugalter &&
          (item.it_park || item.xojalik_bolimi) &&
          !item.omborchi
      );
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
    try {
      const postData = savat
        .filter((item) => item.buyurtma === buyurtmaId)
        .map((item) => ({
          qiymat: item.qiymat,
          active: true,
          buyurtma: buyurtmaId,
          maxsulot: item.maxsulot,
          birlik: item.birlik,
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

      // Update the buyurtma status based on action
      const updatedBuyurtma = {
        user: buyurtmalar.find((b) => b.id === buyurtmaId)?.user,
        sorov: false,
        active: false,
        omborchi: action === "approve",
      };

      await APIBuyurtma.put(`/${buyurtmaId}`, updatedBuyurtma);
      await getBuyurtmalar();
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
      <h2 className="font-semibold text-xl text-center text-gray-700">
        Talabnomalar
      </h2>
      {buyurtmalar.length > 0 ? (
        <div className="grid xl:grid-cols-2 gap-3">
          {buyurtmalar.map((buyurtma) => (
            <div
              key={buyurtma.id}
              className={`p-3 ${buyurtmalar ? "" : "hidden"}`}
            >
              <h2 className="text-xl p-4 font-medium text-gray-700">
                {users[buyurtma.user] || "Noma'lum"}
              </h2>
              <table className="table table-zebra">
                <thead>
                  <tr className="text-gray-700">
                    <th>Mahsulot</th>
                    <th>Miqdor</th>
                  </tr>
                </thead>
                <tbody>
                  {savat
                    .filter((item) => item.buyurtma === buyurtma.id)
                    .map((item) => (
                      <tr key={item.id}>
                        <td>{getMahsulotName(item.maxsulot)}</td>
                        <td>
                          {item.qiymat} {getBirlikName(item.birlik)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="flex items-center justify-end gap-3 mt-3">
                <button
                  onClick={() => handleSumbit("approve", buyurtma.id)}
                  className="btn bg-green-400 hover:bg-green-500 transition-colors duration-300 text-white"
                >
                  Tasdiqlash
                </button>
                <button
                  onClick={() => handleSumbit("reject", buyurtma.id)}
                  className="btn bg-red-400 hover:bg-red-500 transition-colors duration-300 text-white"
                >
                  Rad etish
                </button>
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
