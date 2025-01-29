import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import APIJami from "../../services/jami";
import APIOmbor from "../../services/ombor";
import APICategory from "../../services/category";
import { MdOutlineAddCard } from "react-icons/md";
import * as XLSX from "xlsx";

const AdminOmbor = () => {
  const [jami, setJami] = useState([]);
  const [category, setCategory] = useState([]);
  const [birlik, setBirlik] = useState([]);
  const [filteredMahsulot, setFilteredMahsulot] = useState([]);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jamiData, categoryData] = await Promise.all([
        APIJami.get(),
        APICategory.get(),
      ]);

      setJami(jamiData?.data || []);
      setCategory(categoryData?.data || []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const validationSchema = Yup.object({
    mahsulot: Yup.string().required("Product is required"),
    qiymat: Yup.number().required("Quantity is required"),
  });

  const formik = useFormik({
    initialValues: { mahsulot: "", qiymat: "" },
    validationSchema,
    onSubmit: async (values) => {
      const dataToPost = {
        maxsulot: values.mahsulot,
        qiymat: values.qiymat,
      };

      try {
        await APIOmbor.post(dataToPost);
        alert("Successfully added!");
        formik.resetForm();
        fetchData();
        setBirlik([]);
        modalRef.current.close();
      } catch (error) {
        console.error("Failed to add/update ombor", error);
      }
    },
  });

  const handleCategoryChange = async (event) => {
    const selectedCategory = event.target.value;

    try {
      const response = await APICategory.getbyName(selectedCategory);
      const filteredProducts = response?.data;

      setFilteredMahsulot(filteredProducts);
      formik.setFieldValue("mahsulot", "");
    } catch (err) {
      console.error("Kategoriya ma'lumotlarini olishda xatolik:", err);
    }
  };

  const handleExportToExcel = () => {
    const exportData = [];

    jami.forEach((item) => {
      item?.maxsulotlar?.forEach((product) => {
        if (product?.qiymat > 0) {
          exportData.push({
            Kategoriya: item?.name,
            Mahsulot: product?.maxsulot?.name,
            Miqdor: product?.qiymat,
            Birlik: product?.maxsulot?.birlik?.name,
          });
        }
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
          <button
            className="btn flex items-center bg-blue-400 hover:bg-blue-500 text-white"
            onClick={() => {
              formik.resetForm();
              setFilteredMahsulot([]);
              modalRef.current.showModal();
            }}
          >
            <MdOutlineAddCard className="mr-1 w-4 h-auto" />
            Qo'shish
          </button>
        </div>
      </div>

      {/* Modal for adding/editing items */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box bg-white">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 text-xl">Qo'shish</h2>
            <button
              type="button"
              className="text-lg font-bold w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center"
              onClick={() => modalRef.current.close()}
            >
              X
            </button>
          </div>
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col w-full gap-3"
          >
            <select
              name="category"
              onChange={handleCategoryChange}
              value={formik.values.category}
              className="select select-bordered w-full bg-white text-[#000]"
            >
              <option value="">Kategoriya</option>
              {category.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              name="mahsulot"
              onChange={(event) => {
                formik.handleChange(event);
                const selectedProduct = filteredMahsulot[0]?.maxsulot?.find(
                  (prod) => prod.id === event.target.value
                );
                setBirlik(selectedProduct?.birlik?.name || "");
              }}
              value={formik.values.mahsulot || ""}
              className="select select-bordered w-full bg-white text-[#000]"
            >
              <option value="" disabled>
                Mahsulot
              </option>
              {filteredMahsulot[0]?.maxsulot?.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name}
                </option>
              ))}
            </select>

            <label className="input input-bordered flex items-center gap-2 bg-white text-[#000]">
              Miqdor:
              <input
                type="number"
                name="qiymat"
                value={formik.values.qiymat}
                onChange={formik.handleChange}
                className="grow"
                placeholder="..."
              />
            </label>

            <p className="text-red-500">
              <i>Birligi:</i> <strong>{birlik ? birlik : "..."}</strong>
            </p>

            <div className="modal-action w-full">
              <button
                type="submit"
                className="btn w-full bg-blue-400 hover:bg-blue-500 text-white"
              >
                Saqlash
              </button>
            </div>
          </form>
        </div>
      </dialog>

      <div>
        {jami.map((item) => (
          <div key={item.id} className="p-2">
            <h2 className="text-lg font-semibold text-[#004269]">
              {item.name}
            </h2>
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
              {item.maxsulotlar.map((maxsulotItem) => {
                return (
                  maxsulotItem.qiymat > 0 && (
                    <div
                      key={maxsulotItem.id}
                      className="border rounded p-2 flex items-center justify-between bg-slate-50"
                    >
                      <div className="text-[#000]">
                        {maxsulotItem.maxsulot.name}
                      </div>
                      <div className="flex items-center">
                        <a
                          href={`https://apiombor.kspi.uz${maxsulotItem.maxsulot.rasm}`}
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

export default AdminOmbor;
