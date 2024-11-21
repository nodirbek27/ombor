import React, { useEffect, useState } from "react";
import APIJami from "../../services/jami";
import APICategory from "../../services/category";
import APIMahsulot from "../../services/mahsulot";
import APIBirlik from "../../services/birlik";
import APIOmborYopish from "../../services/omborYopish";
import APIBuyurtma from "../../services/buyurtma";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import Modal from "../Modal";

const KomendantOmbor = () => {
  const [jami, setJami] = useState([]);
  const [category, setCategory] = useState([]);
  const [mahsulot, setMahsulot] = useState([]);
  const [birlik, setBirlik] = useState([]);
  const [yopish, setYopish] = useState([]);
  const [isClose, setIsClose] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Hammasi");
  const [selectedItem, setSelectedItem] = useState(null);
  const [buyurtmaId, setBuyurtmaId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jamiData, categoryData, mahsulotData, birlikData, yopishData] =
        await Promise.all([
          APIJami.get(),
          APICategory.get(),
          APIMahsulot.get(),
          APIBirlik.get(),
          APIOmborYopish.get(),
        ]);

      setJami(jamiData?.data);
      setCategory(categoryData?.data);
      setBirlik(birlikData?.data);
      setYopish(yopishData?.data);

      // Filter mahsulot by maxviylik
      const filteredMahsulot = mahsulotData?.data.filter(
        (item) => !item.maxviylik
      );
      setMahsulot(filteredMahsulot); // Set filtered mahsulot
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch buyurtma data and check if active buyurtma exists
  useEffect(() => {
    const getBuyurtma = async () => {
      try {
        const userId = Number(localStorage.getItem("userId"));
        const response = await APIBuyurtma.get();
        const filteredBuyurtma = response?.data?.filter(
          (item) => item.user === userId && item.active
        );
        // Set buyurtmaId if an active buyurtma exists
        if (filteredBuyurtma.length > 0) {
          setBuyurtmaId(filteredBuyurtma[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch buyurtma", error);
      }
    };
    getBuyurtma();
  }, []);

  useEffect(() => {
    if (yopish && yopish.length > 0) {
      setIsClose(yopish[0].yopish);
    }
  }, [yopish]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleAddToCart = async (jamiItem) => {
    setSelectedItem(jamiItem);
    const userId = Number(localStorage.getItem("userId"));
    if (!buyurtmaId) {
      try {
        const response = await APIBuyurtma.post({
          active: true,
          user: userId,
          sorov: false,
          tasdiq: false,
          rad: false,
        });
        setBuyurtmaId(response.data.id);
      } catch (error) {
        console.error("Error posting Buyurtma:", error);
      }
    }
  };

  const closeModal = () => setSelectedItem(null);

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-semibold text-[#004269]">Ombor</p>
        <select
          className="select select-info sm:w-full max-w-xs"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="Hammasi">Hammasi</option>
          {category.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className={`${isClose && "hidden"}`}>
        {category
          .filter(
            (item) =>
              selectedCategory === "Hammasi" || item.id === selectedCategory
          )
          .map((item) => (
            <div key={item.id} className="p-2">
              <h2 className="text-lg font-semibold text-[#004269] underline mb-3">
                {item.name}
              </h2>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                {jami
                  .filter((o) =>
                    mahsulot
                      .filter((k) => k.kategoriya === item.id)
                      .map((item) => item.id)
                      .includes(o.maxsulot)
                  )
                  .map((jamiItem) => {
                    const mahsulotNomi =
                      mahsulot.find((prod) => prod.id === jamiItem.maxsulot)
                        ?.name || "Noma'lum";
                    const birlikNomi =
                      birlik.find((unit) => unit.id === jamiItem.birlik)
                        ?.name || "Noma'lum";
                    return (
                      <div
                        key={jamiItem.id}
                        className="border rounded p-2 flex items-center justify-between bg-slate-50"
                      >
                        <div>{mahsulotNomi}</div>
                        <div className="flex items-center gap-3 xl:gap-8">
                          <div>
                            {jamiItem.yakuniy_qiymat} {birlikNomi}
                          </div>
                          <MdOutlineLocalGroceryStore
                            className="w-5 md:w-6 h-auto cursor-pointer"
                            onClick={() => handleAddToCart(jamiItem)}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
      </div>
      {selectedItem && (
        <Modal
          selectedItem={selectedItem}
          mahsulot={mahsulot}
          birlik={birlik}
          buyurtmaId={buyurtmaId}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default KomendantOmbor;
