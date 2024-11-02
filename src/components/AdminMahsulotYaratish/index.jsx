import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import APICategory from "../../services/category";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineAddCard } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

const AdminMahsulotYaratish = () => {
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
            await APICategory.put(`/${editingId}/`, dataToPost);
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
  
    const handleDelete = async (id) => {
      if (window.confirm("O'chirishga ishonchingiz komilmi.??")) {
        try {
          await APICategory.del(id);
          alert("Muvaffaqiyatli o'chirildi.!");
          getCategory();
        } catch (error) {
          console.error("Failed to delete category", error);
        }
      }
    };
  
    const resetForm = () => {
      setEditingId(null);
      formik.resetForm();
      document.getElementById("my_modal_2").close();
    };

  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <p className="text-xl font-semibold text-[#004269]">Mahsulotlar</p>
        <button
          className="btn flex items-center"
          onClick={() => {
            resetForm();
            document.getElementById("my_modal_2").showModal();
          }}
        >
          <MdOutlineAddCard className="mr-1 w-4 h-auto" />
          Yaratish
        </button>

        {/* MODAL FOR ADDING/EDITING ADMIN */}
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 text-xl">
                {editingId ? "Kategoriyani tahrirlash" : "Kategoriya yaratish"}
              </h2>
              <button
                type="button"
                className="text-lg font-bold w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center"
                onClick={resetForm}
              >
                X
              </button>
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-900"
                >
                  Nom
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
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
                <button type="submit" className="btn w-full">
                  {editingId ? "Saqlash" : "Yaratish"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default AdminMahsulotYaratish;
