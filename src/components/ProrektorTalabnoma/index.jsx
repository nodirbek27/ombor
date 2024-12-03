import React, { useEffect, useState, useCallback } from "react";
import APISavat from "../../services/savat";
import APIBuyurtma from "../../services/buyurtma";
import APIMahsulot from "../../services/mahsulot";
import APIBirlik from "../../services/birlik";
import APIUsers from "../../services/user";
import APIArxivRad from "../../services/arxivRad";

const ProrekktorTalabnoma = () => {
  const [savat, setSavat] = useState([]);
  const [buyurtmalar, setBuyurtmalar] = useState([]);
  const [mahsulot, setMahsulot] = useState([]);
  const [birlik, setBirlik] = useState([]);
  const [users, setUsers] = useState({});

  const getBuyurtmalar = useCallback(async () => {
    try {
      const response = await APIBuyurtma.get();
      const filteredBuyurtmalar = response?.data?.filter(
        (item) => item.sorov && item.active && !item.prorektor
      );

      const filteredByMahsulot = filteredBuyurtmalar.filter((item) => {
        const shouldHideBuyurtma = (buyurtmaId) => {
          const relatedSavat = savat.filter(
            (item) => item.buyurtma === buyurtmaId
          );
          return relatedSavat.every(
            (item) =>
              mahsulot.find((m) => m.id === item.maxsulot)?.it_park === true
          );
        };

        if (shouldHideBuyurtma(item.id)) return item.it_park;
        if (!shouldHideBuyurtma(item.id)) return item.xojalik_bolimi;
        return item.it_park && item.xojalik_bolimi;
      });

      setBuyurtmalar(filteredByMahsulot);

      // Fetch users
      const userPromises = filteredByMahsulot.map((buyurtma) =>
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
    } finally {
    }
  }, [savat, mahsulot]);

  useEffect(() => {
    getBuyurtmalar();
  }, [getBuyurtmalar]);

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
        prorektor: action === "approve",
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

  return (
    <div>
      <h2 className="mb-5 font-semibold text-xl text-center text-gray-700">
        Talabnomalar
      </h2>
      {buyurtmalar.length > 0 ? (
        <div className="grid gap-3">
          {buyurtmalar.map((buyurtma) => (
            <div className="grid gap-2">
            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="my-accordion-2" />
              <div className="collapse-title text-xl font-medium">
              <h2 className="text-xl font-medium text-gray-700">
                 {users[buyurtma.user] || "Noma'lum"}
             </h2>
              </div>
              <div className="collapse-content">
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
              </div>
            </div>
          </div>
            // <div
            //   key={buyurtma.id}
            //   className={`p-3 ${buyurtmalar ? "" : "hidden"}`}
            // >
            //   <h2 className="text-xl p-4 font-medium text-gray-700">
            //     {users[buyurtma.user] || "Noma'lum"}
            //   </h2>
            //   <table className="table table-zebra">
            //     <thead>
            //       <tr className="text-gray-700">
            //         <th>Mahsulot</th>
            //         <th>Miqdor</th>
            //       </tr>
            //     </thead>
            //     <tbody>
            //       {savat
            //         .filter((item) => item.buyurtma === buyurtma.id)
            //         .map((item) => (
            //           <tr key={item.id}>
            //             <td>{getMahsulotName(item.maxsulot)}</td>
            //             <td>
            //               {item.qiymat} {getBirlikName(item.birlik)}
            //             </td>
            //           </tr>
            //         ))}
            //     </tbody>
            //   </table>
            //   <div className="flex items-center justify-end gap-3 mt-3">
            //     <button
            //       onClick={() => handleSumbit("approve", buyurtma.id)}
            //       className="btn bg-green-400 hover:bg-green-500 transition-colors duration-300 text-white"
            //     >
            //       <i></i>
            //     </button>
            //     <button
            //       onClick={() => handleSumbit("reject", buyurtma.id)}
            //       className="btn bg-red-400 hover:bg-red-500 transition-colors duration-300 text-white"
            //     >
            //       <i></i>
            //     </button>
            //   </div>
            // </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center italic text-red-600 text-lg font-medium my-5">
          Sizda talabnoma yo'q.
        </div>
      )}
    </div>
  );
};

export default ProrekktorTalabnoma;
{
  /* <div className="grid gap-2">
  <div className="collapse collapse-arrow bg-base-200">
    <input type="radio" name="my-accordion-2" />
    <div className="collapse-title text-xl font-medium">
      Click to open this one and close others
    </div>
    <div className="collapse-content">
      <p>hello</p>
    </div>
  </div>
</div> */
}
