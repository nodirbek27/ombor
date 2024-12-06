import React, { useEffect, useState } from "react";
import APIBuyurtma from "../../services/buyurtma";
import APIMahsulot from "../../services/mahsulot";
import APIBirlik from "../../services/birlik";
import APIUsers from "../../services/user";
import APIArxivRad from "../../services/arxivRad";

const ArxivRadEtilgan = () => {
  const [radMahsulotlar, setRadMahsulotlar] = useState([]);
  const [buyurtmalar, setBuyurtmalar] = useState([]);
  const [mahsulot, setMahsulot] = useState([]);
  const [birlik, setBirlik] = useState([]);
  const [users, setUsers] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const [
          buyurtmaResponse,
          arxivRadResponse,
          mahsulotResponse,
          birlikResponse,
        ] = await Promise.all([
          APIBuyurtma.get(),
          APIArxivRad.get(),
          APIMahsulot.get(),
          APIBirlik.get(),
        ]);

        const filteredBuyurtmalar = buyurtmaResponse?.data?.filter(
          (item) => !item.sorov && !item.active
        );
        setBuyurtmalar(filteredBuyurtmalar);
        setRadMahsulotlar(arxivRadResponse?.data);
        setMahsulot(mahsulotResponse?.data);
        setBirlik(birlikResponse?.data);
        console.log(radMahsulotlar);  
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
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const getMahsulotName = (id) =>
    mahsulot.find((item) => item.id === id)?.name || "Noma'lum";
  const getBirlikName = (id) =>
    birlik.find((item) => item.id === id)?.name || "Noma'lum";

  return (
    <div className="px-4">
      <div className="flex items-center justify-between py-4">
        <p className="text-xl font-semibold text-[#004269]">
          Rad etilgan buyurtmalar
        </p>
      </div>
      {isLoading ? (
        <p>Yuklanmoqda...</p>
      ) : (
        <div className="grid gap-3">
          {buyurtmalar.map((buyurtma) => (
            <div key={buyurtma.id}>
              <div className="collapse collapse-arrow bg-base-200">
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title text-xl font-medium flex justify-between items-center">
                  <h2 className="text-xl font-medium text-gray-700 dark:text-white">
                    {users[buyurtma.user] || "Noma'lum"}
                  </h2>
                  <i>{buyurtma.created_at}</i>
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
                    {radMahsulotlar
                      .filter((item) => item.buyurtma === buyurtma.id)
                      .map((item) => (
                        <tr
                          key={`${item.id}-${item.buyurtma}`}
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArxivRadEtilgan;
