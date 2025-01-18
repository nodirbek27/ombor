import React, { useEffect, useState } from "react";
import APIJami from "../../services/jami";
import APIOmborYopish from "../../services/omborYopish";
import * as XLSX from "xlsx";

const SuperadminOmbor = () => {
  const [jami, setJami] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOmborClosed, setIsOmborClosed] = useState(false);
  const [omborYopishId, setOmborYopishId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jamiData, omborYopishData] = await Promise.all([
        APIJami.get(),
        APIOmborYopish.get(),
      ]);

      setJami(jamiData?.data || []);

      if (omborYopishData?.data && omborYopishData.data.length > 0) {
        setIsOmborClosed(omborYopishData.data[0].yopish);
        setOmborYopishId(omborYopishData.data[0].id);
      } else {
        setIsOmborClosed(false);
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
        await APIOmborYopish.patch(`${omborYopishId}/`, { yopish: newStatus });
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
                onChange={handleToggleOmbor}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Display items only if the warehouse is open (isOmborClosed is false) */}
      {/* Ombor start */}
      {!isOmborClosed && (
        <div>
          {jami.map((item) => (
            <div key={item.id} className="p-2">
              <h2 className="text-lg font-semibold text-[#004269]">
                {item.name}
              </h2>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                {item.maxsulotlar.map((maxsulotItem) => {
                  return (
                    <div
                      key={maxsulotItem.id}
                      className="border rounded p-2 flex items-center justify-between bg-slate-50"
                    >
                      <div className="text-[#000]">
                        {maxsulotItem.maxsulot.name}
                      </div>
                      <div className="flex items-center">
                        <a
                          href={maxsulotItem.maxsulot.rasm}
                          className={`italic underline text-blue-300 mr-3 ${
                            !maxsulotItem.maxsulot.rasm && "hidden"
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Rasmi
                        </a>
                        <div className="text-[#000]">
                          {maxsulotItem.qiymat}{" "}
                          {maxsulotItem.maxsulot.birlik.name}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Ombor end */}
    </div>
  );
};

export default SuperadminOmbor;
