import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import APIOmbor from "../../services/ombor";
import APICategory from "../../services/category";
import APIMahsulot from "../../services/mahsulot";
import APIBirlik from "../../services/birlik";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineAddCard } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

const AdminOmbor = () => {
  const [ombor, setOmbor] = useState([]);
  const [category, setCategory] = useState([]);
  const [mahsulot, setMahsulot] = useState([]);
  const [filteredMahsulot, setFilteredMahsulot] = useState([]);
  const [birlik, setBirlik] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const getOmbor = async () => {
    try {
      const response = await APIOmbor.get();
      setOmbor(response?.data);
    } catch (error) {
      console.error("Failed to fetch ombor", error);
    }
  };

  const getCategory = async () => {
    try {
      const response = await APICategory.get();
      setCategory(response?.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const getMahsulot = async () => {
    try {
      const response = await APIMahsulot.get();
      setMahsulot(response?.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const getBirlik = async () => {
    try {
      const response = await APIBirlik.get();
      setBirlik(response?.data);
    } catch (error) {
      console.error("Failed to fetch units", error);
    }
  };

  useEffect(() => {
    getOmbor();
    getCategory();
    getMahsulot();
    getBirlik();
  }, []);

  // Formik validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .max(150, "Name must be 150 characters or fewer"),
    category: Yup.string().required("Category is required"),
    mahsulot: Yup.string().required("Product is required"),
    birlik: Yup.string().required("Unit is required"),
    qiymat: Yup.number().required("Quantity is required"),
  });

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      name: "",
      category: "",
      mahsulot: "",
      birlik: "",
      qiymat: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const dataToPost = {
        name: values.name,
        category: values.category,
        mahsulot: values.mahsulot,
        birlik: values.birlik,
        qiymat: values.qiymat,
      };

      try {
        if (editingId) {
          await APIOmbor.put(`/${editingId}/`, dataToPost);
          alert("Muvaffaqiyatli o'zgartirildi!");
        } else {
          await APIOmbor.post(dataToPost);
          alert("Muvaffaqiyatli yaratildi!");
        }
        getOmbor();
        resetForm();
      } catch (error) {
        console.error("Failed to add/update ombor", error);
      }
    },
  });

  // Handle category change to filter products
  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;
    formik.setFieldValue("category", selectedCategoryId);

    // Filter products based on selected category
    const filteredProducts = mahsulot.filter(
      (prod) => prod.category === selectedCategoryId
    );
    setFilteredMahsulot(filteredProducts);
    formik.setFieldValue("mahsulot", ""); // Reset mahsulot value
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    formik.setValues({
      name: item.name,
      category: item.category,
      mahsulot: item.mahsulot,
      birlik: item.birlik,
      qiymat: item.qiymat,
    });
    document.getElementById("my_modal_2").showModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm("O'chirishga ishonchingiz komilmi?")) {
      try {
        await APIOmbor.del(id);
        alert("Muvaffaqiyatli o'chirildi!");
        getOmbor();
      } catch (error) {
        console.error("Failed to delete ombor", error);
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    formik.resetForm();
    setFilteredMahsulot([]); // Reset filtered products
    document.getElementById("my_modal_2").close();
  };

  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <p className="text-xl font-semibold text-[#004269]">Ombor</p>
        <button
          className="btn flex items-center"
          onClick={() => {
            resetForm();
            document.getElementById("my_modal_2").showModal();
          }}
        >
          <MdOutlineAddCard className="mr-1 w-4 h-auto" />
          Qo'shish
        </button>

        {/* Modal for adding/editing items */}
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 text-xl">
                {editingId ? "Tahrirlash" : "Qo'shish"}
              </h2>
              <button
                type="button"
                className="text-lg font-bold w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center"
                onClick={resetForm}
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
                onChange={handleCategoryChange} // Updated
                value={formik.values.category}
                className="select select-bordered w-full"
              >
                <option disabled value="">
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
                value={formik.values.mahsulot}
                className="select select-bordered w-full"
              >
                <option disabled value="">
                  Mahsulot
                </option>
                {filteredMahsulot.map((prod) => ( // Use filteredMahsulot
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
                value={formik.values.birlik}
                className="select select-bordered w-full"
              >
                <option disabled value="">
                  O'lchov birlik
                </option>
                {birlik.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
              <div className="modal-action w-full">
                <button type="submit" className="btn w-full">
                  {editingId ? "Saqlash" : "Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
      <div>
        {category &&
          category.map((item) => (
            <div key={item.id} className="p-2">
              <h2 className="text-lg font-medium">{item.name}</h2>
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Mahsulot</th>
                    <th>Miqdor</th>
                    <th>O'lchov birlik</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {ombor
                    .filter((o) => o.category === item.id) // Filter by category
                    .map((omborItem) => (
                      <tr key={omborItem.id}>
                        <td>{omborItem.mahsulot}</td>
                        <td>{omborItem.qiymat}</td>
                        <td>{omborItem.birlik}</td>
                        <td>
                          <button
                            onClick={() => handleEdit(omborItem)}
                            className="btn btn-sm"
                          >
                            <CiEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(omborItem.id)}
                            className="btn btn-sm"
                          >
                            <RiDeleteBin5Line />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminOmbor;
