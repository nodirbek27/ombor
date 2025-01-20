import React, { useEffect, useState } from "react";
import APIJami from "../../services/jami";
import APIOmborYopish from "../../services/omborYopish";
import * as XLSX from "xlsx";

const BugalterOmbor = () => {
  const [jami, setJami] = useState([]);
  const [yopish, setYopish] = useState([]);
  const [isClose, setIsClose] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Hammasi");

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

  const handleExportToExcel = () => {
    const exportData = [];

    jami.forEach((item) => {
      item?.maxsulotlar?.forEach((product) => {
        exportData.push({
          Kategoriya: item?.name,
          Mahsulot: product?.maxsulot?.name,
          Miqdor: product?.qiymat,
          Birlik: product?.maxsulot?.birlik?.name,
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ombor");

    // Excel faylni yuklash
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
      <div className="md:flex items-center justify-between">
        <div className="flex items-center justify-between mb-3 md:mb-0 w-full mr-3">
          <p className="text-2xl font-semibold text-[#004269] mr-5">Ombor</p>
          <button
            onClick={handleExportToExcel}
            className="btn flex items-center bg-green-500 hover:bg-green-600 text-white mr-3"
          >
            Excelga Yuklash
          </button>
        </div>
          <select
            className="select select-info w-full max-w-xs justify-end"
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
      <div className={`${isClose && "hidden"}`}>
        {filteredItems.map((item) => (
          <div key={item.id} className="p-2">
            <h2 className="text-lg font-semibold text-[#004269] mb-3">
              {item.name}
            </h2>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
              {item.maxsulotlar.map((product) => {
                return (
                  !product?.maxsulot?.maxviylik && (
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
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BugalterOmbor;
