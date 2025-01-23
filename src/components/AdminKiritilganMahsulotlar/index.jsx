import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import APIOmbor from "../../services/ombor";
import { CiEdit } from "react-icons/ci";

const AdminKiritilganMahsulotlar = () => {
  const [ombor, setOmbor] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch categories
  const getOmbor = async () => {
    try {
      const response = await APIOmbor.get();
      setOmbor(response?.data?.reverse());
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch category", error);
    }
  };

  useEffect(() => {
    getOmbor();
  }, []);

  const formik = useFormik({
    onSubmit: async (values) => {
      if (editingId) {
        const dataToPut = {
          maxsulot: values.mahsulot,
          qiymat: values.qiymat,
        };

        try {
          await APIOmbor.patch(`${editingId}`, dataToPut);
          alert("Successfully updated!");
          formik.resetForm();
          setEditingId(null);
          getOmbor();
          setModalOpen(false);
        } catch (error) {
          console.error("Failed to update ombor", error);
        }
      }
    },
  });

  const handleEdit = (item) => {
    setEditingId(item.id);
    formik.setValues({
      mahsulot: item.mahsulot,
      qiymat: item.qiymat,
      birlik: item.birlik,
    });
    setModalOpen(true);
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
          Kiritilgan mahsulotlar
        </p>
      </div>

      {/* Modal for editing items */}
      {modalOpen && (
        <dialog open className="modal">
          <div className="modal-box bg-white">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 text-xl">
                Tahrirlash
              </h2>
              <button
                type="button"
                className="text-lg text-[#000] font-bold w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center"
                onClick={() => setModalOpen(false)}
              >
                X
              </button>
            </div>
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col w-full gap-3"
            >
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
      )}

      {/* Filtered Ombor Items */}
      <div className="overflow-x-auto my-4">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="text-[#333]">Mahsulot</th>
              <th className="text-[#333]">Miqdori</th>
              <th className="text-center text-[#333]">Tahrirlash</th>
              <th className="text-center text-[#333]">Sana</th>
            </tr>
          </thead>
          <tbody>
            {ombor.map((omborItem) => (
              <tr key={omborItem.id}>
                <td>{omborItem.maxsulot.name}</td>
                <td>
                  {omborItem.qiymat} {omborItem.maxsulot.birlik.name}
                </td>
                <td className="text-center">
                  <button
                    type="button"
                    onClick={() => handleEdit(omborItem)}
                    className="text-xl"
                  >
                    <CiEdit className="w-7 h-auto text-green-500 border hover:border-green-500 transition-all duration-200 p-1 rounded-md" />
                  </button>
                </td>
                <td className="text-center">{omborItem.maxsulot.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminKiritilganMahsulotlar;
