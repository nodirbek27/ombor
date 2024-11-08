import React, { useEffect, useState } from "react";
import APIJami from "../../services/jami";
import APICategory from "../../services/category";
import APIMahsulot from "../../services/mahsulot";
import APIBirlik from "../../services/birlik";
import APIOmborYopish from "../../services/omborYopish";

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
                        <div>
                          {jamiItem.qiymat} {birlikNomi}
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
