import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import APICategory from "../../services/category";
import { MdOutlineAddCard } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

const AdminKategoriya = () => {
  const [category, setCategory] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const getCategory = async () => {
    try {
      const response = await APICategory.get();
      setCategory(response?.data);
    } catch (error) {
      console.error("Failed to fetch category", error);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .max(150, "Name must be 150 characters or fewer"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const dataToPost = {
        name: values.name,
      };

      try {
        if (editingId) {
          await APICategory.put(`${editingId}`, dataToPost);
          alert("Muvaffaqiyatli o'zgartirildi.!");
        } else {
          await APICategory.post(dataToPost);
          alert("Muvaffaqiyatli yaratildi.!");
        }
        getCategory();
        resetForm();
      } catch (error) {
        console.error("Failed to add/update category", error);
      }
    },
  });

  const handleEdit = (item) => {
    setEditingId(item.id);
    formik.setValues({
      name: item.name,
    });
    document.getElementById("my_modal_2").showModal();
  };

  const resetForm = () => {
    setEditingId(null);
    formik.resetForm();
    document.getElementById("my_modal_2").close();
  };

  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <p className="text-xl font-semibold text-[#004269]">Kategoriyalar</p>
        <button
          className="btn flex items-center bg-blue-400 hover:bg-blue-500 text-white"
          onClick={() => {
            resetForm();
            document.getElementById("my_modal_2").showModal();
          }}
        >
          <MdOutlineAddCard className="mr-1 w-4 h-auto" />
          Kategoriya yaratish
        </button>

        {/* MODAL FOR ADDING/EDITING ADMIN */}
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box bg-white">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 text-xl">
                {editingId ? "Kategoriyani tahrirlash" : "Kategoriya yaratish"}
              </h2>
              <button
                type="button"
                className="text-lg font-bold w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-[#000]"
                onClick={resetForm}
              >
                X
              </button>
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-900 bg-white"
                >
                  Nom
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="block w-full rounded-md border-0 p-2 text-gray-900 bg-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.name}
                  </div>
                ) : null}
              </div>
              <div className="modal-action w-full">
                <button type="submit" className="btn w-full bg-blue-400 hover:bg-blue-500 text-white">
                  {editingId ? "Saqlash" : "Yaratish"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>№</th>
              <th>Kategoriya</th>
              <th>Tahrirlash</th>
            </tr>
          </thead>
          <tbody>
            {category &&
              category.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{item.name}</td>
                  <th>
                    <button
                      className="mr-5 cursor-pointer"
                      onClick={() => handleEdit(item)}
                    >
                      <CiEdit className="w-5 h-auto text-green-400" />
                    </button>
                  </th>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminKategoriya;
