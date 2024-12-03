import React, { useEffect, useState } from "react";
import APISavat from "../../services/savat";
import APIBuyurtma from "../../services/buyurtma";
import APIMahsulot from "../../services/mahsulot";
import APIBirlik from "../../services/birlik";
import APIUsers from "../../services/user";
import APIArxivRad from "../../services/arxivRad";

const XojalikTalabnoma = () => {
  const [savat, setSavat] = useState([]);
  const [buyurtmalar, setBuyurtmalar] = useState([]);
  const [mahsulot, setMahsulot] = useState([]);
  const [birlik, setBirlik] = useState([]);
  const [users, setUsers] = useState({});

  // Fetch buyurtmalar and related users
  const getBuyurtmalar = async () => {
    try {
      const response = await APIBuyurtma.get();
      const filteredBuyurtmalar = response?.data?.filter(
        (item) =>
          item.sorov &&
          item.active &&
          !item.xojalik_bolimi
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

  // Fetch savat data based on buyurtmalar
  useEffect(() => {
    getBuyurtmalar();
  }, []);

  useEffect(() => {
    const getSavat = async () => {
      try {
        const response = await APISavat.get();
        if (buyurtmalar.length > 0) {
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

  // Fetch mahsulot and birlik data
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

  // Get mahsulot and birlik names
  const getMahsulotName = (id) =>
    mahsulot.find((item) => item.id === id)?.name || "Noma'lum";
  const getBirlikName = (id) =>
    birlik.find((item) => item.id === id)?.name || "Noma'lum";

  // Handle approve or reject actions
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

      if (action === "reject") {
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
        sorov: action === "approve",
        active: action === "approve",
        xojalik_bolimi: action === "approve",
      };

      await APIBuyurtma.put(`/${buyurtmaId}`, updatedBuyurtma);
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

  const shouldHideBuyurtma = (buyurtmaId) => {
    const relatedSavat = savat.filter((item) => item.buyurtma === buyurtmaId);
    return relatedSavat.every(
      (item) => mahsulot.find((m) => m.id === item.maxsulot)?.it_park === true
    );
  };

  return (
    <div>
      <h2 className="font-semibold text-xl text-center text-gray-700">
        Talabnomalar
      </h2>
      {buyurtmalar.length > 0 ? (
        <div className="grid xl:grid-cols-2 gap-3">
          {buyurtmalar.map((buyurtma) =>
            shouldHideBuyurtma(buyurtma.id) ? null : (
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
            )
          )}
        </div>
      ) : (
        <div className="flex justify-center italic text-red-600 text-lg font-medium my-5">
          Sizda talabnomalar mavjud emas.!
        </div>
      )}
    </div>
  );
};

export default XojalikTalabnoma;