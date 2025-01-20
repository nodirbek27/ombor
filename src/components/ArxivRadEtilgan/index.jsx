import React, { useEffect, useState } from "react";
import APIArxivRad from "../../services/arxivRad";

const ArxivRadEtilgan = () => {
  const [radMahsulotlar, setRadMahsulotlar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const response = await APIArxivRad.get();
        setRadMahsulotlar(response?.data?.reverse());
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

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
          {radMahsulotlar?.map((item) => (
            <div key={item.id}>
              <div className="collapse collapse-arrow bg-base-200">
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title text-xl font-medium flex justify-between items-center">
                  <h2 className="text-xl font-medium text-gray-700 dark:text-white">
                    {item.buyurtma.komendant_user.last_name}{" "}
                    {item.buyurtma.komendant_user.first_name}
                  </h2>
                  <i>{item.created_at}</i>
                </div>
                <div className="collapse-content">
                  <table className="table relative overflow-x-auto shadow-md mb-3">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr className="text-gray-700 md:text-base">
                        <th className="dark:text-gray-300">Mahsulot</th>
                        <th className="dark:text-gray-300">Miqdor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.buyurtma.maxsulotlar.map((maxsulot) => (
                        <tr
                          key={`${maxsulot.id}-${maxsulot.buyurtma}`}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                          <td>{maxsulot.maxsulot.name}</td>
                          <td>
                            {maxsulot.qiymat} {maxsulot.maxsulot.birlik.name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="italic">
                    Ushbu buyurtma{" "}
                    <strong className="text-red-400">
                      {item.rad_etgan_user.last_name}{" "}
                      {item.rad_etgan_user.first_name}
                    </strong>
                    ({item.rad_etgan_user.role}) tomonidan rad etilgan
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArxivRadEtilgan;
