import React, { useEffect, useState } from "react";
import APIOmbor from "../../services/ombor";
import APICategory from "../../services/category";
import APIMahsulot from "../../services/mahsulot";
import APIBirlik from "../../services/birlik";

const SuperadminOmbor = () => {
  const [ombor, setOmbor] = useState([]);
  const [category, setCategory] = useState([]);
  const [mahsulot, setMahsulot] = useState([]);
  const [birlik, setBirlik] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [omborData, categoryData, mahsulotData, birlikData] =
        await Promise.all([
          APIOmbor.get(),
          APICategory.get(),
          APIMahsulot.get(),
          APIBirlik.get(),
        ]);

      setOmbor(omborData?.data || []);
      setCategory(categoryData?.data || []);
      setMahsulot(mahsulotData?.data || []);
      setBirlik(birlikData?.data || []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
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
            <input type="checkbox" className="toggle toggle-success" />
          </label>
        </div>
      </div>

      <div>
        {category.map((item) => (
          <div key={item.id} className="p-2">
            <h2 className="text-lg font-semibold text-[#004269]">
              {item.name}
            </h2>
            <table className="table table-zebra w-full">
              <thead>
                <tr className="grid grid-cols-3">
                  <th>Mahsulot</th>
                  <th>Miqdor</th>
                </tr>
              </thead>
              <tbody>
                {ombor
                  .filter((o) =>
                    mahsulot
                      .filter((k) => k.kategoriya === item.id)
                      .map((item) => item.id)
                      .includes(o.maxsulot)
                  )
                  .map((omborItem) => {
                    const mahsulotNomi =
                      mahsulot.find((prod) => prod.id === omborItem.maxsulot)
                        ?.name || "Noma'lum";
                    const birlikNomi =
                      birlik.find((unit) => unit.id === omborItem.birlik)
                        ?.name || "Noma'lum";

                    return (
                      <tr
                        key={omborItem.id}
                        className="grid grid-cols-3 w-full"
                      >
                        <td>{mahsulotNomi}</td>
                        <td>
                          {omborItem.qiymat}
                          {birlikNomi}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuperadminOmbor;
