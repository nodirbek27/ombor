import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RiUserAddLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import APIBinolar from "../../services/binolar";

const SuperadminBinolar = () => {
  const [editingId, setEditingId] = useState(null);
  const [binolar, setBinolar] = useState([]);

  const getBinolar = async () => {
    try {
      const response = await APIBinolar.get();
      setBinolar(response?.data);
    } catch (error) {
      console.error("Failed to fetch binolar", error);
    }
  };

  useEffect(() => {
    getBinolar();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .max(150, "Name must be 255 characters or fewer"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const dataToPost = { name: values.name };
      try {
        if (editingId) {
          await APIBinolar.patch(`${editingId}`, dataToPost);
          alert("Muvaffaqiyatli o'zgartirildi!");
        } else {
          await APIBinolar.post(dataToPost);
          alert("Muvaffaqiyatli qo'shildi!");
        }
        getBinolar();
        resetForm();
      } catch (error) {
        console.error("Failed to add/update bino", error);
      }
    },
  });

  const handleEdit = (bino) => {
    setEditingId(bino.id);
    formik.setValues({ name: bino.name });
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
        <p className="text-xl font-semibold text-[#004269]">Binolar</p>
        <button
          className="btn flex items-center bg-blue-400 hover:bg-blue-500 text-white"
          onClick={() => {
            resetForm();
            document.getElementById("my_modal_2").showModal();
          }}
        >
          <RiUserAddLine className="mr-1 w-4 h-auto" />
          Qo'shish
        </button>
      </div>

      {/* MODAL FOR ADDING/EDITING */}
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box bg-white">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 text-xl">
              {editingId ? "Binoni tahrirlash" : "Bino qo'shish"}
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
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-900"
            >
              Bino nomi
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="block w-full rounded-md border-0 bg-white p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm">{formik.errors.name}</div>
            )}
            <button
              type="submit"
              className="btn w-full bg-blue-400 hover:bg-blue-500 text-white mt-4"
            >
              {editingId ? "Saqlash" : "Qo'shish"}
            </button>
          </form>
        </div>
      </dialog>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th className="dark:text-[#333] font-semibold">№</th>
              <th className="dark:text-[#333] font-semibold">Bino</th>
              <th className="dark:text-[#333] font-semibold">Tahrirlash</th>
            </tr>
          </thead>
          <tbody>
            {binolar.map((bino, index) => (
              <tr key={bino.id}>
                <td>{index + 1}</td>
                <td className="dark:text-[#333] font-semibold xl:text-lg">{bino.name}</td>
                <td>
                  <CiEdit
                    className="cursor-pointer w-7 h-auto text-green-400 hover:text-green-500 border hover:border-green-500 p-1 rounded-md"
                    onClick={() => handleEdit(bino)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperadminBinolar;
