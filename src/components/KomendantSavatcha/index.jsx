import React, { useEffect, useState } from "react";
import APISavat from "../../services/savat";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Link } from "react-router-dom";

const KomendantSavatcha = () => {
  const [savat, setSavat] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editedQuantity, setEditedQuantity] = useState("");

  useEffect(() => {
    const getSavat = async () => {
      try {
        const response = await APISavat.get();
        setSavat(response?.data);
      } catch (error) {
        console.error("Failed to fetch savat", error);
      }
    };
    getSavat();
  }, []);
  console.log(savat);

  const handleEdit = (item) => {
    setEditingItem(item.id);
    setEditedQuantity(item.qiymat);
  };

  const handleSave = async (itemId) => {
    try {
      const updatedItem = {
        ...savat.find((item) => item.id === itemId),
        qiymat: editedQuantity,
      };

      await APISavat.put(`/${itemId}`, updatedItem);

      setEditingItem(null);
    } catch (error) {
      console.error("Failed to save item", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await APISavat.del(id);
      setSavat(savat.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  const handleSumbit = async (id) => {
    try {
      if (id) {
        const postData = {
          active: true,
          sorov: true,
          omborchi: false,
        };

        // Update the specific buyurtma by ID
      } else {
        console.error("No active buyurtma found to submit");
      }
    } catch (error) {
      console.error("Failed to submit and clear items", error);
    }
  };

  return (
    <div>
      <div className="breadcrumbs text-md ">
        <ul>
          <li>
            <Link to="/komendant">Ombor</Link>
          </li>
          <li>Savat</li>
        </ul>
      </div>
      <h2 className="text-xl xl:text-2xl text-center font-semibold mb-4">
        Savat
      </h2>
      <div className="">
        <div className="mt-5">
          {savat?.korzinka?.length === 0 ? (
            <div className="text-xl font-bold text-red-500 text-center">
              Sizning savatingiz bo'sh!
            </div>
          ) : (
            <div>
              <div className="mb-5">
                <div>
                  {savat?.korzinka?.map((item) => (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-5">
                      <div className="border p-4 rounded-lg bg-slate-50">
                        <h3 className="font-semibold">
                          {item.maxsulot.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div>
                            {editingItem === savat.id ? (
                              <label className="max-w-[200px] flex items-center gap-2 mb-2">
                                Miqdori:
                                <input
                                  type="number"
                                  min="0"
                                  className="p-1"
                                  value={editedQuantity}
                                  onChange={(e) =>
                                    setEditedQuantity(e.target.value)
                                  }
                                />
                              </label>
                            ) : (
                              item.qiymat
                            )}
                          </div>
                          {item.birlik?.name}
                        </div>
                        <div className="flex items-center justify-end">
                          <div className="flex items-center">
                            {editingItem === savat.id ? (
                              <div className="flex items-center">
                                <button
                                  className="mr-5 bg-blue-400 hover:bg-blue-500 p-1 rounded text-white cursor-pointer transition-colors duration-300"
                                  onClick={() => handleSave(savat.id)}
                                >
                                  Saqlash
                                </button>
                              </div>
                            ) : (
                              <button
                                className="mr-5 cursor-pointer"
                                onClick={() => handleEdit(savat)}
                              >
                                <CiEdit className="w-5 h-auto text-green-400" />
                              </button>
                            )}
                          </div>
                          <button
                            className={`cursor-pointer`}
                            onClick={() => handleDelete(savat.id)}
                          >
                            <RiDeleteBin5Line className="w-5 h-auto text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Only show submit button if the cart for this order is not empty */}
                  {/* {savat.some((item) => item.buyurtma === b.id) && (
                      <button
                        onClick={() => handleSumbit(b.id)}
                        disabled={b?.sorov}
                        className={`btn w-full bg-blue-400 hover:bg-blue-500 transition-colors duration-300 text-white ${
                          b?.sorov ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        So'rov yuborish
                      </button>
                    )} */}
                </div>
                {/* Tasdiqlanish jarayonida */}
                <div className={`flex flex-col text-center my-4`}>
                  <h2 className="text-xl text-gray-700 font-medium italic my-4">
                    Tasdiqlanish jarayonida
                  </h2>
                  {/* Timeline */}
                  {/* <ul className="steps steps-vertical md:steps-horizontal">
                        <li
                          data-content={itPark || xojalik ? "✓" : "?"}
                          className={`step ${
                            itPark || xojalik ? "step-accent" : ""
                          }`}
                        >
                          {sorov?.maxsulot_it_park === true
                            ? "IT Park"
                            : "Xo'jalik bo'limi"}
                        </li>
                        <li
                          data-content={`${prorektor ? "✓" : "?"}`}
                          className={`step ${prorektor && "step-accent"}`}
                        >
                          Prorektor
                        </li>
                        <li
                          data-content={`${bugalter ? "✓" : "?"}`}
                          className={`step ${bugalter && "step-accent"}`}
                        >
                          Bugalter
                        </li>
                        <li
                          data-content={`${omborchi ? "✓" : "?"}`}
                          className={`step ${omborchi && "step-accent"}`}
                        >
                          Omborchi
                        </li>
                      </ul> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KomendantSavatcha;
