import React, { useEffect, useState } from "react";
import APIJami from "../../services/jami";
import APIOmborYopish from "../../services/omborYopish";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import Modal from "../Modal";

const KomendantOmbor = () => {
  const [jami, setJami] = useState([]);
  const [yopish, setYopish] = useState([]);
  const [isClose, setIsClose] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Hammasi");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (yopish && yopish.length > 0) {
      setIsClose(yopish[0].yopish);
    }
  }, [yopish]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jamiData, yopishData] = await Promise.all([
          APIJami.get(),
          APIOmborYopish.get(),
        ]);
        setJami(jamiData?.data);
        setYopish(yopishData?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredItems =
    selectedCategory === "Hammasi"
      ? jami
      : jami.filter((item) => item.id === selectedCategory);

  const handleAddToCart = async (jamiItem, e) => {
    e.preventDefault();
    setSelectedItem(jamiItem);

    try {
    } catch (error) {
      console.error("Error handling Buyurtma:", error);
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
        <div className="flex items-center justify-between mb-3 md:mb-0 w-full mr-3">
          <p className="text-2xl font-semibold text-[#004269] mr-5">Ombor</p>
          <select
            className="select select-info w-full max-w-xs"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="Hammasi">Barchasi</option>
            {jami.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={`${isClose && "hidden"}`}>
        {filteredItems.map((item) => (
          <div key={item.id} className="p-2">
            <h2 className="text-lg font-semibold text-[#004269] mb-3">
              {item.name}
            </h2>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
              {item.maxsulotlar.map((product) => {
                return (
                  !product?.maxsulot?.maxviylik && product.qiymat && (
                    <div
                      key={product.id}
                      className="border rounded p-2 flex items-center justify-between bg-slate-50"
                    >
                      <div className="flex flex-col gap-2">
                        <div>{product.maxsulot.name}</div>
                      </div>
                      <div className="flex items-center gap-3 xl:gap-8">
                        <div>
                          <a
                            href={product.maxsulot?.rasm}
                            className={`italic underline ${
                              !product.maxsulot?.rasm && "hidden"
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Rasm
                          </a>
                        </div>
                        <div>
                          {product.qiymat} {product.maxsulot?.birlik.name}
                        </div>
                        <MdOutlineLocalGroceryStore
                          className="w-5 md:w-6 h-auto cursor-pointer"
                          onClick={(e) => handleAddToCart(product, e)}
                        />
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {selectedItem && (
        <Modal selectedItem={selectedItem} onClose={closeModal} />
      )}
    </div>
  );
};

export default KomendantOmbor;
