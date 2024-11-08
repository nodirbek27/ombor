import React, { useEffect, useState, useRef } from "react";
import APIJami from "../../services/jami";
import APICategory from "../../services/category";
import APIMahsulot from "../../services/mahsulot";
import APIBirlik from "../../services/birlik";
import APISavat from "../../services/savat";
import { MdOutlineLocalGroceryStore } from "react-icons/md";

const KomendantOmbor = () => {
  const [jami, setJami] = useState([]);
  const [category, setCategory] = useState([]);
  const [mahsulot, setMahsulot] = useState([]);
  const [birlik, setBirlik] = useState([]);
  const [savat, setSavat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Hammasi");
  const [selectedItem, setSelectedItem] = useState(null);
  const modalRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jamiData, categoryData, mahsulotData, birlikData, savatData] =
        await Promise.all([
          APIJami.get(),
          APICategory.get(),
          APIMahsulot.get(),
          APIBirlik.get(),
          APISavat.get(),
        ]);

      setJami(jamiData?.data || []);
      setCategory(categoryData?.data || []);
      setMahsulot(mahsulotData?.data || []);
      setBirlik(birlikData?.data || []);
      setSavat(savatData?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleAddToCart = (jamiItem) => {
    setSelectedItem(jamiItem);
    modalRef.current.showModal();
  };

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

      <div>
        {category
          .filter(
            (item) =>
              selectedCategory === "Hammasi" || item.id === selectedCategory
          )
          .map((item) => (
            <div key={item.id} className="p-2">
              <h2 className="text-lg font-semibold text-[#004269]">
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
                            {jamiItem.qiymat} {birlikNomi}
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

      {/* Modal for Adding to Cart */}
      {selectedItem && (
        <dialog ref={modalRef} className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg mb-3">
              {mahsulot.find((prod) => prod.id === selectedItem.maxsulot)?.name ||
              "Noma'lum"}
            </h3>
            {/* Miqdor */}
            <div className="mb-3 flex items-center justify-between gap-3">
              <label className="input input-bordered flex items-center w-full gap-2">
                Miqdori:
                <input
                  type="text"
                  className="grow"
                  placeholder="..."
                />
              </label>
              <div className="border flex items-center justify-center rounded-md w-14 h-[48px]">
                {birlik.find((unit) => unit.id === selectedItem.birlik)?.name ||
                "Noma'lum"}
              </div>
            </div>
            {/* Button */}
            <button className="btn w-full bg-blue-400 hover:bg-blue-500 text-white">
              Savatga qo'shish
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default KomendantOmbor;
