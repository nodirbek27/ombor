import React, { useEffect, useState } from "react";
import APIJami from "../../services/jami";
import APICategory from "../../services/category";
import APIMahsulot from "../../services/mahsulot";
import APIBirlik from "../../services/birlik";
import APIOmborYopish from "../../services/omborYopish";
import * as XLSX from "xlsx";

const SuperadminOmbor = () => {
  const [jami, setJami] = useState([]);
  const [category, setCategory] = useState([]);
  const [mahsulot, setMahsulot] = useState([]);
  const [birlik, setBirlik] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOmborClosed, setIsOmborClosed] = useState(false);
  const [omborYopishId, setOmborYopishId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        jamiData,
        categoryData,
        mahsulotData,
        birlikData,
        omborYopishData,
      ] = await Promise.all([
        APIJami.get(),
        APICategory.get(),
        APIMahsulot.get(),
        APIBirlik.get(),
        APIOmborYopish.get(),
      ]);

      setJami(jamiData?.data || []);
      setCategory(categoryData?.data || []);
      setMahsulot(mahsulotData?.data || []);
      setBirlik(birlikData?.data || []);

      if (omborYopishData?.data && omborYopishData.data.length > 0) {
        setIsOmborClosed(omborYopishData.data[0].yopish);
        setOmborYopishId(omborYopishData.data[0].id);
      } else {
        setIsOmborClosed(false);
        const response = await APIOmborYopish.post({ yopish: false });
        setOmborYopishId(response.data.id);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOmbor = async () => {
    const newStatus = !isOmborClosed;
    setIsOmborClosed(newStatus);

    try {
      if (omborYopishId) {
        await APIOmborYopish.put(`/${omborYopishId}/`, { yopish: newStatus });
      } else {
        const response = await APIOmborYopish.post({ yopish: newStatus });
        setOmborYopishId(response.data.id);
      }
    } catch (error) {
      console.error("Failed to update ombor status", error);
      setIsOmborClosed(!newStatus);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Excel faylni yaratish funksiyasi
  const handleExportToExcel = () => {
    const exportData = [];

    category.forEach((item) => {
      jami
        .filter((o) =>
          mahsulot
            .filter((k) => k.kategoriya === item.id)
            .map((prod) => prod.id)
            .includes(o.maxsulot)
        )
        .forEach((jamiItem) => {
          const mahsulotItem = mahsulot.find(
            (prod) => prod.id === jamiItem.maxsulot
          );
          const birlikNomi =
            birlik.find((unit) => unit.id === jamiItem.birlik)?.name ||
            "Noma'lum";

          exportData.push({
            Kategoriya: item.name,
            Mahsulot: mahsulotItem?.name || "Noma'lum",
            Miqdor: jamiItem.yakuniy_qiymat,
            Birlik: birlikNomi,
          });
        });
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ombor");

    // Faylni yuklash
    XLSX.writeFile(workbook, "ombor_ma'lumotlari.xlsx");
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
      <div className="flex items-center justify-between p-4">
        <p className="text-xl font-semibold text-[#004269]">Ombor</p>
        <div className="flex items-center">
          <button
            onClick={handleExportToExcel}
            className="btn flex items-center bg-green-500 hover:bg-green-600 text-white mr-3"
          >
            Excelga Yuklash
          </button>
          <div className="form-control w-52">
            <label className="label cursor-pointer">
              <span className="label-text text-md font-semibold">
                Omborni yopish
              </span>
              <input
                type="checkbox"
                className="toggle toggle-success"
                checked={!!isOmborClosed}
                onChange={handleToggleOmbor} // Toggle state
              />
            </label>
          </div>
        </div>
      </div>

      {/* Display items only if the warehouse is open (isOmborClosed is false) */}
      {!isOmborClosed && (
        <div>
          {category.map((item) => (
            <div key={item.id} className="p-2">
              <h2 className="text-lg font-semibold text-[#004269]">
                {item.name}
              </h2>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                {jami
                  .filter((o) =>
                    mahsulot
                      .filter((k) => k.kategoriya === item.id)
                      .map((item) => item.id)
                      .includes(o.maxsulot)
                  )
                  .map((jamiItem) => {
                    const mahsulotItem = mahsulot.find(
                      (prod) => prod.id === jamiItem.maxsulot
                    );
                    const mahsulotNomi =
                      mahsulot.find((prod) => prod.id === jamiItem.maxsulot)
                        ?.name || "Noma'lum";
                    const birlikNomi =
                      birlik.find((unit) => unit.id === jamiItem.birlik)
                        ?.name || "Noma'lum";
                    const mahsulotRasm = mahsulotItem?.rasm;
                    return (
                      <div
                        key={jamiItem.id}
                        className="border rounded p-2 flex items-center justify-between bg-slate-50"
                      >
                        <div className="text-[#000]">{mahsulotNomi}</div>
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
                        <div className="text-[#000]">
                          {jamiItem.yakuniy_qiymat} {birlikNomi}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuperadminOmbor;
