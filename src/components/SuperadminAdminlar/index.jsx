import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import APIUsers from "../../services/user";
import APIBinolar from "../../services/binolar";
import { RiUserAddLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";

const SuperadminAdminlar = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [binolar, setBinolar] = useState([]);

  const getUsers = async () => {
    try {
      const response = await APIUsers.get();
      const sortedData = response.data.filter((item) => !item.superadmin);
      setUsers(sortedData);
    } catch (error) {
      console.error("Failed to fetch admins", error);
    }
  };

  const getBinolar = async () => {
    try {
      const response = await APIBinolar.get();
      setBinolar(response?.data);
    } catch (error) {
      console.error("Failed to fetch binolar", error);
    }
  };

  const toggleIsActive = async (userId, currentStatus) => {
    try {
      const response = await APIUsers.patch(`${userId}`, {
        is_active: !currentStatus,
      });
      getUsers();
      return response;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  };

  useEffect(() => {
    getBinolar();
    getUsers();
  }, []);

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .matches(/^[\w.@+-]+$/, "Invalid username format")
      .max(150, "Username must be 150 characters or fewer"),
    first_name: Yup.string()
      .required("First name is required")
      .max(150, "First name must be 150 characters or fewer"),
    last_name: Yup.string()
      .required("Last name is required")
      .max(150, "Last name must be 150 characters or fewer"),
    password: Yup.string()
      .required("Password is required")
      .max(128, "Password must be 128 characters or fewer"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      first_name: "",
      last_name: "",
      password: "",
      bino: "",
      role: "prorektor",
      is_active: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const dataToPost = {
        username: values.username,
        first_name: values.first_name,
        last_name: values.last_name,
        password: values.password,
        bino: values.bino,
        superadmin: values.role === "superadmin",
        prorektor: values.role === "prorektor",
        bugalter: values.role === "bugalter",
        xojalik_bolimi: values.role === "xojalik_bolimi",
        it_park: values.role === "it_park",
        omborchi: values.role === "omborchi",
        komendant: values.role === "komendant",
        is_active: values.is_active,
      };
      try {
        if (editingId) {
          // Update existing user
          await APIUsers.patch(`${editingId}`, dataToPost);
          alert("Muvaffaqiyatli o'zgartirildi.!");
        } else {
          // Create new user
          await APIUsers.post(dataToPost);

          alert("Muvaffaqiyatli qo'shildi.!");
        }
        getUsers();
        resetForm();
      } catch (error) {
        console.error("Failed to add/update user", error);
      }
    },
  });

  const handleEdit = (user) => {
    setEditingId(user.id);
    formik.setValues({
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      name: user.name,
      password: user.parol,
      role: user.superadmin
        ? "superadmin"
        : user.prorektor
        ? "prorektor"
        : user.bugalter
        ? "bugalter"
        : user.xojalik_bolimi
        ? "xojalik_bolimi"
        : user.it_park
        ? "it_park"
        : user.omborchi
        ? "omborchi"
        : user.komendant
        ? "komendant"
        : "prorektor",
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
        <p className="text-xl font-semibold text-[#004269]">Foydalanuvchilar</p>
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

        {/* MODAL FOR ADDING/EDITING ADMIN */}
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box bg-white">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 text-xl">
                {editingId
                  ? "Foydalanuvchini tahrirlash"
                  : "Foydalanuvchi qo'shish"}
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
              <div className="grid grid-cols-2 gap-3">
                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className="block w-full rounded-md border-0 bg-white p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                  />
                  {formik.touched.username && formik.errors.username ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.username}
                    </div>
                  ) : null}
                </div>

                {/* Bino */}
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Bino
                  </label>
                  <select
                    name="bino"
                    value={formik.values.bino}
                    onChange={formik.handleChange}
                    className="block w-full rounded-md border-0 bg-white p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  >
                    {binolar?.map((bino) => (
                      <option key={bino.id} value={bino.id}>
                        {bino.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ism */}
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Ism
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    className="block w-full rounded-md border-0 bg-white p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.first_name}
                  />
                  {formik.touched.first_name && formik.errors.first_name ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.first_name}
                    </div>
                  ) : null}
                </div>

                {/* Familiya */}
                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Familiya
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    className="block w-full rounded-md border-0 bg-white p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.last_name}
                  />
                  {formik.touched.last_name && formik.errors.last_name ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.last_name}
                    </div>
                  ) : null}
                </div>

                {/* Holat Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Holat
                  </label>
                  <select
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    className="block w-full rounded-md border-0 bg-white p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  >
                    <option value="prorektor">Prorektor</option>
                    <option value="bugalter">Bugalter</option>
                    <option value="xojalik_bolimi">Xo'jalik bo'limi</option>
                    <option value="it_park">IT Park</option>
                    <option value="omborchi">Omborchi</option>
                    <option value="komendant">Komendant</option>
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Parol
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="block w-full rounded-md border-0 bg-white p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.password}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Buttons */}
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
      </div>
      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="text-[#000]">
              <th>Ism/Familiya</th>
              <th>Username/Parol</th>
              <th>Bino</th>
              <th>Holat</th>
              <th className="text-center">Tahrirlash</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="font-semibold text-[#000]">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-bold">{user.last_name}</div>
                      <div className="text-sm">{user.first_name}</div>
                    </div>
                  </div>
                </td>
                <td className="font-semibold text-[#000]">
                  {user.username}
                  <br />
                  <span className="badge badge-outline badge-sm">
                    {user.parol}
                  </span>
                </td>
                <td className="font-semibold text-[#000]">
                  {binolar.find((bino) => bino.id === user.bino)?.name || "N/A"}
                </td>
                <td className="font-semibold text-[#000]">
                  {user.superadmin
                    ? "Superadmin"
                    : user.prorektor
                    ? "Prorektor"
                    : user.bugalter
                    ? "Bugalter"
                    : user.xojalik_bolimi
                    ? "Xo'jalik bo'limi"
                    : user.it_park
                    ? "IT Park"
                    : user.omborchi
                    ? "Omborchi"
                    : user.komendant
                    ? "Komendant"
                    : "Noma'lum"}{" "}
                </td>

                <th className="text-center">
                  <button
                    className="mr-5 cursor-pointer"
                    onClick={() => handleEdit(user)}
                  >
                    <CiEdit className="w-5 h-auto text-green-400" />
                  </button>
                </th>
                <th>
                  <input
                    type="checkbox"
                    checked={user.is_active}
                    onChange={() => toggleIsActive(user.id, user.is_active)}
                    className="toggle toggle-success"
                  />
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperadminAdminlar;
