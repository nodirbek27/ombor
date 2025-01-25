import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CiEdit } from "react-icons/ci";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import APICategory from "../../services/category";
import APIMahsulot from "../../services/mahsulot";
import APIBirlik from "../../services/birlik";
import { MdOutlineAddCard } from "react-icons/md";

const AdminMahsulotYaratish = () => {
  const [category, setCategory] = useState([]);
  const [birliklar, setBirliklar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch categories
  const getCategory = async () => {
    try {
      const response = await APICategory.get();
      setCategory(response?.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch category", error);
    }
  };

  // Fetch products
  const getBirlik = async () => {
    try {
      const response = await APIBirlik.get();
      setBirliklar(response?.data);
    } catch (error) {
      console.error("Failed to fetch mahsulot", error);
    }
  };

  useEffect(() => {
    getCategory();
    getBirlik();
  }, []);

  const handleEdit = (product, id) => {
    setIsModalOpen(true);
    setEditingId(product.id);
    setOpenCategoryId(id);

    formik.setValues({
      name: product.name || "",
      kategoriya: id || "",
      maxviylik: product.maxviylik || false,
      birlik: product.birlik || "",
      rasm: "",
      maxsulot_role: product.maxsulot_role,
    });
  };

  const handleClick = (categoryId) => {
    setIsModalOpen(true);
    if (openCategoryId === categoryId) {
      setOpenCategoryId(null);
      formik.resetForm();
    } else {
      setOpenCategoryId(categoryId);
      formik.setFieldValue("kategoriya", categoryId);
    }
  };

  const validationSchema = (isEdit) =>
    Yup.object({
      name: isEdit
        ? Yup.string() // Tahrirlashda validatsiya yo'q
        : Yup.string()
            .required("Nom majburiy")
            .max(150, "Name must be 150 characters or fewer"),
      kategoriya: isEdit
        ? Yup.string() // Tahrirlashda validatsiya yo'q
        : Yup.string()
            .required("Kategoriya majburiy")
            .max(150, "Kategoriya must be 150 characters or fewer"),
      birlik: Yup.string().required("Birlikni tanlang"),
    });

  const formik = useFormik({
    initialValues: {
      name: "",
      kategoriya: "",
      rasm: "",
      birlik: "",
      maxviylik: false,
      maxsulot_role: "",
    },
    validationSchema: validationSchema(Boolean(editingId)),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("kategoriya", values.kategoriya);
      formData.append("birlik", values.birlik);
      formData.append("maxviylik", values.maxviylik);
      formData.append("maxsulot_role", values.maxsulot_role);
      if (values.rasm) {
        formData.append("rasm", values.rasm);
      }

      try {
        if (editingId) {
          await APIMahsulot.patch(`${editingId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          alert("Muvaffaqiyatli o'zgartirildi!");
          setEditingId(null);
          setIsModalOpen(false);
        } else {
          await APIMahsulot.post(formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          alert("Muvaffaqiyatli yaratildi!");
          setIsModalOpen(false);
        }
        getCategory();
        formik.resetForm();
        setOpenCategoryId(null);
      } catch (error) {
        console.error("Failed to add/update mahsulot", error);
      }
    },
  });

  const modalClose = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setOpenCategoryId(null);
  };

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

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
                {isModalOpen && (
                  <div
                    className={`transition-all duration-300 overflow-hidden`}
                  >
                    {/* Main modal */}
                    <div
                      className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${
                        isModalOpen ? "flex" : "hidden"
                      }`}
                    >
                      <div className="relative p-4 w-full max-w-md max-h-full">
                        {/* Modal content */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                          {/* Modal header */}
                          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {item.name}
                            </h3>
                            <button
                              type="button"
                              onClick={() => modalClose()}
                              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                              >
                                <path
                                  stroke="currentColor"
                                  stroklinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                              </svg>
                              <span className="sr-only">Close modal</span>
                            </button>
                          </div>
                          {/* Modal body */}
                          <form
                            onSubmit={formik.handleSubmit}
                            className="p-4 md:p-5"
                          >
                            <div className="grid gap-4 mb-4 grid-cols-2">
                              <div className="col-span-2">
                                <label
                                  htmlFor="name"
                                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Nomi
                                </label>
                                <input
                                  type="text"
                                  name="name"
                                  id="name"
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                  placeholder="Mahsulot nomi"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.name}
                                  maxLength={50}
                                />
                              </div>

                              {/* Rasm input */}
                              <div className="col-span-2 sm:col-span-1">
                                <label
                                  htmlFor="rasm"
                                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Rasm
                                </label>
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
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                />
                              </div>
                              <div className="col-span-2 sm:col-span-1">
                                <label
                                  htmlFor="birlik"
                                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Birlik
                                </label>
                                <select
                                  id="birlik"
                                  value={formik.values.birlik}
                                  onChange={formik.handleChange}
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                >
                                  <option defaultValue="">
                                    Birlikni tanlang
                                  </option>
                                  {birliklar.map((birlik) => (
                                    <option key={birlik.id} value={birlik.id}>
                                      {birlik.name}
                                    </option>
                                  ))}
                                </select>
                                {formik.errors.birlik &&
                                  formik.touched.birlik && (
                                    <div className="text-red-500 text-sm italic">
                                      Birlikni tanlang
                                    </div>
                                  )}
                              </div>
                            </div>

                            {/* Checkbox */}
                            <div className="flex flex-col items-start">
                              <h3 className="mb-3 text-sm text-gray-900 dark:text-white">
                                Qaysi bo'limga tegishli?
                              </h3>
                              <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-3">
                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                  <div className="flex items-center ps-3">
                                    <input
                                      id="radio-xo'jalik"
                                      type="radio"
                                      value="xojalik"
                                      name="maxsulot_role"
                                      onChange={formik.handleChange}
                                      checked={
                                        formik.values.maxsulot_role ===
                                        "xojalik"
                                      }
                                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    />
                                    <label
                                      htmlFor="radio-xo'jalik"
                                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                      Xo'jalik bo'limi
                                    </label>
                                  </div>
                                </li>
                                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                  <div className="flex items-center ps-3">
                                    <input
                                      id="radio-rttm"
                                      type="radio"
                                      value="rttm"
                                      name="maxsulot_role"
                                      onChange={formik.handleChange}
                                      checked={
                                        formik.values.maxsulot_role === "rttm"
                                      }
                                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    />
                                    <label
                                      htmlFor="radio-rttm"
                                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                      RTTM
                                    </label>
                                  </div>
                                </li>
                              </ul>
                              {/* Checkbox */}
                              <label className="cursor-pointer label">
                                <input
                                  type="checkbox"
                                  name="maxviylik"
                                  onChange={formik.handleChange}
                                  checked={formik.values.maxviylik}
                                  className="checkbox checkbox-success mr-2"
                                />
                                <span className="label-text text-[#000] dark:text-white">
                                  Maxfiylik
                                </span>
                              </label>
                            </div>
                            <button
                              type="submit"
                              className="btn text-white items-center bg-blue-400 hover:bg-blue-500 font-medium rounded-lg px-5 py-2.5 text-center"
                            >
                              {editingId
                                ? "O'zgartirish"
                                : "Yangi mahsulot qo'shish"}
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  className="btn items-center bg-blue-400 hover:bg-blue-500 text-white"
                  onClick={() => handleClick(item.id)}
                >
                  <MdOutlineAddCard className="mr-1 w-4 h-auto" />
                  Yaratish
                </button>
              </div>
            </div>
            <div className="flex items-center flex-wrap gap-3">
              {item.maxsulot.map((product) => (
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
                      onClick={() => handleEdit(product, item.id)}
                    >
                      <CiEdit className="w-7 h-auto text-green-500 border hover:border-green-500 transition-all duration-200 p-1 rounded-md" />
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
