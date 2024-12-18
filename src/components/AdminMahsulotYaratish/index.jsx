import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import APICategory from "../../services/category";
import APIMahsulot from "../../services/mahsulot";
import { MdOutlineAddCard } from "react-icons/md";

const AdminMahsulotYaratish = () => {
  const [category, setCategory] = useState([]);
  const [mahsulot, setMahsulot] = useState([]);
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Fetch categories
  const getCategory = async () => {
    try {
      const response = await APICategory.get();
      setCategory(response?.data);
    } catch (error) {
      console.error("Failed to fetch category", error);
    }
  };

  // Fetch products
  const getMahsulot = async () => {
    try {
      const response = await APIMahsulot.get();
      setMahsulot(response?.data);
    } catch (error) {
      console.error("Failed to fetch mahsulot", error);
    }
  };

  useEffect(() => {
    getCategory();
    getMahsulot();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      kategoriya: "",
      rasm: "",
      maxviylik: false,
      it_park: false,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Nom majburiy")
        .max(150, "Name must be 150 characters or fewer"),
      kategoriya: Yup.string()
        .required("Kategoriya majburiy")
        .max(150, "Name must be 150 characters or fewer"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("kategoriya", values.kategoriya);
      formData.append("maxviylik", values.maxviylik);
      formData.append("it_park", values.it_park);
      if (values.rasm) {
        formData.append("rasm", values.rasm);
      }

      try {
        if (editingId) {
          await APIMahsulot.put(`${editingId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          alert("Muvaffaqiyatli o'zgartirildi!");
          setEditingId(null); // Reset edit mode
        } else {
          await APIMahsulot.post(formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          alert("Muvaffaqiyatli yaratildi!");
        }
        getMahsulot();
        formik.resetForm();
        setOpenCategoryId(null);
      } catch (error) {
        console.error("Failed to add/update mahsulot", error);
      }
    },
  });

  const handleClick = (categoryId) => {
    if (openCategoryId === categoryId) {
      setOpenCategoryId(null);
      formik.resetForm();
    } else {
      setOpenCategoryId(categoryId);
      formik.setFieldValue("kategoriya", categoryId);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    formik.setValues({
      name: item.name,
      kategoriya: item.kategoriya,
      maxviylik: item.maxviylik,
      it_park: item.it_park,
    });
    setOpenCategoryId(item.kategoriya);
  };

  const handleDelete = async (id) => {
    if (window.confirm("O'chirishga ishonchingiz komilmi?")) {
      try {
        await APIMahsulot.del(`${id}`);
        alert("Muvaffaqiyatli o'chirildi!");
        getMahsulot(); // Refresh mahsulot list
      } catch (error) {
        console.error("Failed to delete mahsulot", error);
      }
    }
  };

  return (
    <div className="p-1">
      <div className="flex items-center p-4 mb-3 rounded">
        <p className="text-xl font-semibold text-[#004269]">Mahsulotlar</p>
      </div>
      {category &&
        category.map((item) => (
          <div key={item.id} className="bg-slate-100 p-4 mb-3 rounded">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-[#004269]">
                {item.name}
              </p>
              <div className="relative">
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    openCategoryId === item.id
                      ? "w-full opacity-100"
                      : "w-0 opacity-0"
                  }`}
                  style={{
                    display: openCategoryId === item.id ? "flex" : "none",
                  }}
                >
                  <form
                    onSubmit={formik.handleSubmit}
                    className="flex items-center gap-3"
                  >
                    <label className="input input-bordered flex items-center gap-2 bg-white text-[#000]">
                      Nomi:
                      <input
                        type="text"
                        className="grow"
                        placeholder="..."
                        name="name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                      />
                    </label>

                    {/* Checkbox */}
                    <div className="flex flex-col xl:flex-row">
                      <label className="cursor-pointer label">
                        <span className="label-text mr-2 text-[#000]">
                          Maxfiylik:
                        </span>
                        <input
                          type="checkbox"
                          name="maxviylik"
                          onChange={formik.handleChange}
                          checked={formik.values.maxviylik}
                          className="checkbox checkbox-success"
                        />
                      </label>
                      <label className="cursor-pointer label">
                        <span className="label-text mr-2 text-[#000]">
                          RTTM:
                        </span>
                        <input
                          type="checkbox"
                          name="it_park"
                          onChange={formik.handleChange}
                          checked={formik.values.it_park}
                          className="checkbox checkbox-success"
                        />
                      </label>
                    </div>

                    {/* File input */}
                    <div className="file-input p-0">
                      <input
                        type="file"
                        name="rasm"
                        id="rasm"
                        onChange={(event) => {
                          formik.setFieldValue(
                            "rasm",
                            event.currentTarget.files[0]
                          );
                        }}
                        className="file-input__input w-0 h-0 opacity-0 overflow-hidden absolute -z-1"
                      />

                      <label
                        className="file-input__label flex items-center rounded-md text-sm font-semibold text-white p-2 h-full bg-cyan-400 shadow-sm cursor-pointer hover:bg-cyan-500"
                        htmlFor="rasm"
                      >
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          className="h-4 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path
                            fill="currentColor"
                            d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                          ></path>
                        </svg>
                        <span>Upload file</span>
                      </label>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="btn flex items-center bg-blue-400 hover:bg-blue-500 text-white"
                    >
                      {editingId ? "O'zgartirish" : "Qo'shish"}
                    </button>
                    <button
                      type="button"
                      className="btn flex items-center bg-red-400 hover:bg-red-500 text-[#000]"
                      onClick={() => handleClick(item.id)}
                    >
                      X
                    </button>
                  </form>
                </div>
                {openCategoryId !== item.id && (
                  <button
                    className="btn items-center bg-blue-400 hover:bg-blue-500 text-white"
                    onClick={() => handleClick(item.id)}
                  >
                    <MdOutlineAddCard className="mr-1 w-4 h-auto" />
                    Yaratish
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center flex-wrap gap-3">
              {mahsulot &&
                mahsulot
                  .filter((product) => product.kategoriya === item.id)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center text-sm text-gray-700 border p-2 rounded font-medium bg-white"
                    >
                      <p className="text-md mr-3">{product.name}</p>
                      <div className="flex items-center">
                        <div className="mr-4">
                          {!product.maxviylik ? (
                            <FaEye className="w-5 h-auto" />
                          ) : (
                            <FaEyeSlash className="w-5 h-auto" />
                          )}
                        </div>
                        <div>
                          <a
                            href={product?.rasm}
                            className={`italic underline mr-2 ${
                              !product.rasm && "hidden"
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Rasm
                          </a>
                        </div>
                        {/* Edit */}
                        <button
                          className="mr-4 cursor-pointer"
                          onClick={() => handleEdit(product)}
                        >
                          <CiEdit className="w-5 h-auto text-green-400" />
                        </button>
                        {/* Delete */}
                        <button
                          className="cursor-pointer"
                          onClick={() => handleDelete(product.id)}
                        >
                          <RiDeleteBin5Line className="w-5 h-auto text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default AdminMahsulotYaratish;
