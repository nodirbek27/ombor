import React, { useEffect, useState } from "react";
import APIJami from "../../services/jami";
import APICategory from "../../services/category";
import APIMahsulot from "../../services/mahsulot";
import APIBirlik from "../../services/birlik";
import APIOmborYopish from "../../services/omborYopish";
import APIBuyurtma from "../../services/buyurtma";
import APISavat from "../../services/savat";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import Modal from "../Modal";

const KomendantOmborXojalik = () => {
  const [savat, setSavat] = useState([]);
  const [jami, setJami] = useState([]);
  const [category, setCategory] = useState([]);
  const [allMahsulot, setAllMahsulot] = useState([]);
  const [birlik, setBirlik] = useState([]);
  const [yopish, setYopish] = useState([]);
  const [isClose, setIsClose] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Hammasi");
  const [selectedItem, setSelectedItem] = useState(null);
  const [buyurtmaId, setBuyurtmaId] = useState(null);
  const [buyurtma, setBuyurtma] = useState(null);

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
          setBuyurtma(filteredBuyurtma[0]);
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
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          savatData,
          jamiData,
          categoryData,
          mahsulotData,
          birlikData,
          yopishData,
        ] = await Promise.all([
          APISavat.get(),
          APIJami.get(),
          APICategory.get(),
          APIMahsulot.get(),
          APIBirlik.get(),
          APIOmborYopish.get(),
        ]);
        // Filter savat by maxviylik
        const filteredSavat = savatData?.data.filter(
          (item) => item.buyurtma === buyurtmaId
        );

        setSavat(filteredSavat);
        setJami(jamiData?.data);
        setCategory(categoryData?.data);
        setBirlik(birlikData?.data);
        setYopish(yopishData?.data);

        // Filter mahsulot by maxviylik
        const filteredMahsulot = mahsulotData?.data.filter(
          (item) => !item.maxviylik && !item.it_park
        );
        setAllMahsulot(filteredMahsulot);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [buyurtmaId]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleAddToCart = async (jamiItem, e) => {
    e.preventDefault(); // Sahifaning yangilanishini to'xtatish
    setSelectedItem(jamiItem);
    const userId = Number(localStorage.getItem("userId"));

    // Mahsulotni topish va it_park qiymatini aniqlash
    const mahsulotItem = allMahsulot.find(
      (item) => item.id === jamiItem.maxsulot
    );
    const isItPark = mahsulotItem?.it_park || false;
    console.log(buyurtma);

    if (!buyurtmaId || buyurtma?.sorov === true) {
      try {
        const response = await APIBuyurtma.post({
          active: true,
          user: userId,
          sorov: false,
          maxsulot_it_park: isItPark,
        });
        setBuyurtmaId(response.data.id);
      } catch (error) {
        console.error("Error posting Buyurtma:", error);
      }
    } else {
      // If savat length is 0, update the maxsulot_it_park value via PUT request
      if (savat?.length === 0) {
        try {
          await APIBuyurtma.patch(buyurtmaId, {
            maxsulot_it_park: isItPark, // Update the maxsulot_it_park field
            user: userId,
          });
        } catch (error) {
          console.error("Error updating Buyurtma:", error);
        }
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
      <div className="md:flex md:items-center justify-between">
        <div className="flex items-center justify-between mb-3 md:mb-0 w-full mr-3">
          <p className="text-2xl font-semibold text-[#004269]">Ombor</p>
        </div>
        <select
          className="select select-info w-full md:max-w-xs"
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
                    allMahsulot
                      .filter((k) => k.kategoriya === item.id)
                      .map((item) => item.id)
                      .includes(o.maxsulot)
                  )
                  .map((jamiItem) => {
                    const mahsulotItem = allMahsulot.find(
                      (prod) => prod.id === jamiItem.maxsulot
                    );
                    const mahsulotNomi = mahsulotItem?.name || "Noma'lum";
                    const birlikNomi =
                      birlik.find((unit) => unit.id === jamiItem.birlik)
                        ?.name || "Noma'lum";
                    const mahsulotRasm = mahsulotItem?.rasm;

                    return (
                      <div
                        key={jamiItem.id}
                        className="border rounded p-2 flex items-center justify-between bg-slate-50"
                      >
                        <div className="flex flex-col gap-2">
                          <div>{mahsulotNomi}</div>
                        </div>
                        <div className="flex items-center gap-3 xl:gap-8">
                          <div>
                            <a
                              href={mahsulotRasm}
                              className={`italic underline ${
                                !mahsulotRasm && "hidden"
                              }`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Rasm
                            </a>
                          </div>
                          <div>
                            {jamiItem.yakuniy_qiymat} {birlikNomi}
                          </div>
                          <MdOutlineLocalGroceryStore
                            className="w-5 md:w-6 h-auto cursor-pointer"
                            onClick={(e) => handleAddToCart(jamiItem, e)}
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
          mahsulot={allMahsulot}
          birlik={birlik}
          buyurtmaId={buyurtmaId}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default KomendantOmborXojalik;
