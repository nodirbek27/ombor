import React, { useEffect, useState } from "react";
import APISavat from "../../services/savat";
import APIBuyurtma from "../../services/buyurtma";

const KomendantSavatcha = () => {
  const [savat, setSavat] = useState([]);
  const [buyurtma, setBuyurtma] = useState([]);

  useEffect(() => {
    const getBuyurtma = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await APIBuyurtma.get();
        // console.log(response.data);

        const filteredBuyurtma = response?.data?.filter(
          (item) => item.user === userId
        );
        setBuyurtma(filteredBuyurtma);
      } catch (error) {
        console.error("Failed to fetch buyurtma", error);
      }
    };
    getBuyurtma();
  }, []);

  useEffect(() => {
    const getSavat = async () => {
      try {
        const response = await APISavat.get();
        const filteredSavat = response.data.filter(
          (item) => item.buyurtma === buyurtma.id && item.active
        );

        setSavat(filteredSavat);
      } catch (error) {
        console.error("Failed to fetch savat", error);
      }
    };
    getSavat();
  }, [buyurtma.id]);
  console.log(buyurtma);

  return (
    <div>
      <div className="w-10/12 m-auto">
        <div className="mt-8">
          {savat?.length === 0 ? (
            <div className="text-xl font-bold text-red-500 text-center">
              Sizning savatingiz bo'sh!
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Savat</h2>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {savat &&
                  savat.map((item) => (
                    <div
                      key={item.id}
                      className="border p-4 rounded-lg bg-slate-50"
                    >
                      <h3 className="font-semibold">
                        {item.mahsulot} - {item.qiymat} {item.birlik}
                      </h3>
                      <p className="mt-2">Buyurtma ID: {item.buyurtma}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KomendantSavatcha;
