import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import APIBirlik from "../../services/birlik";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineAddBox } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

const AdminBirlik = () => {
  const [birlik, setBirlik] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const getBirlik = async () => {
    try {
      const response = await APIBirlik.get();
      setBirlik(response?.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch birlik", error);
    }
  };

  useEffect(() => {
    getBirlik();
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
          await APIBirlik.put(`${editingId}`, dataToPost);
          alert("Muvaffaqiyatli o'zgartirildi.!");
        } else {
          await APIBirlik.post(dataToPost);
          alert("Muvaffaqiyatli yaratildi.!");
        }
        getBirlik();
        resetForm();
      } catch (error) {
        console.error("Failed to add/update birlik", error);
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

  const handleDelete = async (id) => {
    if (window.confirm("O'chirishga ishonchingiz komilmi.??")) {
      try {
        await APIBirlik.del(id);
        alert("Muvaffaqiyatli o'chirildi.!");
        getBirlik();
      } catch (error) {
        console.error("Failed to delete birlik", error);
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    formik.resetForm();
    document.getElementById("my_modal_2").close();
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
        <p className="text-xl font-semibold text-[#004269]">
          O'lchov birliklari
        </p>
        <button
          className="btn flex items-center bg-blue-400 hover:bg-blue-500 text-white"
          onClick={() => {
            resetForm();
            document.getElementById("my_modal_2").showModal();
          }}
        >
          <MdOutlineAddBox className="mr-1 w-5 h-auto" />
          Birlik qo'shish
        </button>

        {/* MODAL FOR ADDING/EDITING ADMIN */}
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box bg-white">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 text-xl">
                {editingId ? "Tahrirlash" : "Birlik qo'shish"}
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
                  Nomi
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
                <button
                  type="submit"
                  className="btn w-full bg-blue-400 hover:bg-blue-500 text-white"
                >
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
              <th>Birlik</th>
              <th>Tahrirlash</th>
              <th>O'chirish</th>
            </tr>
          </thead>
          <tbody>
            {birlik &&
              birlik.map((item, idx) => (
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
                  <th>
                    <button
                      className="cursor-pointer"
                      onClick={() => handleDelete(item.id)}
                    >
                      <RiDeleteBin5Line className="w-5 h-auto text-red-400" />
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

export default AdminBirlik;
