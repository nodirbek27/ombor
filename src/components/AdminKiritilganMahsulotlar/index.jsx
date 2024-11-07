import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import APIOmbor from "../../services/ombor";
import * as Yup from "yup";
import APICategory from "../../services/category";
import APIMahsulot from "../../services/mahsulot";
import APIBirlik from "../../services/birlik";
import { MdOutlineAddCard } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

const AdminKiritilganMahsulotlar = () => {
  const [ombor, setOmbor] = useState([]);
  const [category, setCategory] = useState([]);
  const [mahsulot, setMahsulot] = useState([]);
  const [filteredMahsulot, setFilteredMahsulot] = useState([]);
  const [birlik, setBirlik] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);

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

  const validationSchema = Yup.object({
    mahsulot: Yup.string().required("Product is required"),
    birlik: Yup.string().required("Unit is required"),
    qiymat: Yup.number().required("Quantity is required"),
  });

  const formik = useFormik({
    initialValues: { mahsulot: "", qiymat: "", birlik: "" },
    validationSchema,
    onSubmit: async (values) => {
      const dataToPost = {
        maxsulot: values.mahsulot,
        qiymat: values.qiymat,
        birlik: values.birlik,
      };

      try {
        if (editingId) {
          await APIOmbor.put(`/${editingId}/`, dataToPost);
          alert("Successfully updated!");
        } else {
          await APIOmbor.post(dataToPost);
          alert("Successfully added!");
        }
        formik.resetForm();
        setEditingId(null);
        fetchData();
        modalRef.current.close();
      } catch (error) {
        console.error("Failed to add/update ombor", error);
      }
    },
  });

  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;
    formik.setFieldValue("category", selectedCategoryId);

    const filteredProducts = mahsulot.filter(
      (prod) => prod.kategoriya === selectedCategoryId
    );
    setFilteredMahsulot(filteredProducts);
    formik.setFieldValue("mahsulot", "");
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    formik.setValues({
      mahsulot: item.mahsulot,
      qiymat: item.qiymat,
      birlik: item.birlik,
    });
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
      <div className="flex items-center justify-between p-4">
        <p className="text-xl font-semibold text-[#004269]">Ombor</p>
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

      {/* Modal for adding/editing items */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 text-xl">
              {editingId ? "Tahrirlash" : "Qo'shish"}
            </h2>
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
              value={formik.values.category || ""}
              className="select select-bordered w-full"
            >
              <option value="" disabled>
                Kategoriya
              </option>
              {category.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              name="mahsulot"
              onChange={formik.handleChange}
              value={formik.values.mahsulot || ""}
              className="select select-bordered w-full"
            >
              <option value="" disabled>
                Mahsulot
              </option>
              {filteredMahsulot.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name}
                </option>
              ))}
            </select>

            <label className="input input-bordered flex items-center gap-2">
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

            <select
              name="birlik"
              onChange={formik.handleChange}
              value={formik.values.birlik || ""}
              className="select select-bordered w-full"
            >
              <option value="" disabled>
                O'lchov birlik
              </option>
              {birlik.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>

            <div className="modal-action w-full">
              <button
                type="submit"
                className="btn w-full bg-blue-400 hover:bg-blue-500 text-white"
              >
                {editingId ? "Saqlash" : "Qo'shish"}
              </button>
            </div>
          </form>
        </div>
      </dialog>

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
                  <th>Amallar</th>
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
                        {console.log(omborItem)}
                        <td>{mahsulotNomi}</td>
                        <td>
                          {omborItem.qiymat}
                          {birlikNomi}
                        </td>
                        <td className="flex items-center">
                          <CiEdit
                            className="w-5 h-auto text-green-400 hover:text-green-600 cursor-pointer mr-4"
                            onClick={() => handleEdit(omborItem)}
                          />
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

export default AdminKiritilganMahsulotlar;
