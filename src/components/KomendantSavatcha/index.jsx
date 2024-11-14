import React, { useEffect, useState } from "react";
import APISavat from "../../services/savat";
import APIBuyurtma from "../../services/buyurtma";
import APIMahsulot from "../../services/mahsulot";
import APIBirlik from "../../services/birlik";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Link } from "react-router-dom";

const KomendantSavatcha = () => {
  const [savat, setSavat] = useState([]);
  const [buyurtma, setBuyurtma] = useState(null);
  const [mahsulot, setMahsulot] = useState([]);
  const [birlik, setBirlik] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editedQuantity, setEditedQuantity] = useState("");

  useEffect(() => {
    const getBuyurtma = async () => {
      try {
        const userId = Number(localStorage.getItem("userId"));
        const response = await APIBuyurtma.get();

        const filteredBuyurtma = response?.data?.filter(
          (item) => item.user === userId && item.active
        );

        setBuyurtma(filteredBuyurtma?.[0] || null);
      } catch (error) {
        console.error("Failed to fetch buyurtma", error);
      }
    };
    getBuyurtma();
  }, []);

  useEffect(() => {
    const getSavat = async () => {
      try {
        if (buyurtma?.id) {
          const response = await APISavat.get();
          const filteredSavat = response?.data?.filter(
            (item) => item.buyurtma === buyurtma.id
          );
          setSavat(filteredSavat);
        }
      } catch (error) {
        console.error("Failed to fetch savat", error);
      }
    };
    getSavat();
  }, [buyurtma]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mahsulotData, birlikData] = await Promise.all([
          APIMahsulot.get(),
          APIBirlik.get(),
        ]);
        setMahsulot(mahsulotData?.data);
        setBirlik(birlikData?.data);
      } catch (error) {
        console.error("Failed to fetch mahsulot or birlik", error);
      }
    };
    fetchData();
  }, []);

  const getMahsulotName = (id) =>
    mahsulot.find((item) => item.id === id)?.name || "Noma'lum";
  const getBirlikName = (id) =>
    birlik.find((item) => item.id === id)?.name || "Noma'lum";

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
      setSavat(savat.map((item) => (item.id === itemId ? updatedItem : item)));

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

  const handleSumbit = async () => {
    try {
      if (buyurtma?.id) {
        const postData = {
          ...buyurtma,
          active: true,
          sorov: true,
          tasdiq: false,
          rad: false,
        };

        // Update the specific buyurtma by ID
        await APIBuyurtma.put(`/${buyurtma.id}`, postData);
        // Update the state to reflect the changes
        setBuyurtma((prevBuyurtma) => ({
          ...prevBuyurtma,
          sorov: true,
        }));
        console.log("Buyurtma edited successfully");
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
      <div className="">
        <div className="mt-5">
          {savat?.length === 0 ? (
            <div className="text-xl font-bold text-red-500 text-center">
              Sizning savatingiz bo'sh!
            </div>
          ) : (
            <div>
              <h2 className="text-xl xl:text-2xl text-center font-semibold mb-4">
                Savat
              </h2>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-5">
                {savat.map((item) => (
                  <div
                    key={item.id}
                    className="border p-4 rounded-lg bg-slate-50"
                  >
                    <h3 className="font-semibold">
                      {getMahsulotName(item.maxsulot)}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div>
                        {editingItem === item.id ? (
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
                      {getBirlikName(item.birlik)}
                    </div>
                    <div className="flex items-center justify-end">
                      <div className="flex items-center">
                        {editingItem === item.id ? (
                          <div className="flex items-center">
                            <button
                              className="mr-5 bg-blue-400 hover:bg-blue-500 p-1 rounded text-white cursor-pointer transition-colors duration-300"
                              onClick={() => handleSave(item.id)}
                            >
                              Saqlash
                            </button>
                          </div>
                        ) : (
                          <button
                            className="mr-5 cursor-pointer"
                            onClick={() => handleEdit(item)}
                          >
                            <CiEdit className="w-5 h-auto text-green-400" />
                          </button>
                        )}
                      </div>
                      <button
                        className="cursor-pointer"
                        onClick={() => handleDelete(item.id)}
                      >
                        <RiDeleteBin5Line className="w-5 h-auto text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleSumbit}
                disabled={buyurtma?.sorov}
                className={`btn w-full bg-blue-400 hover:bg-blue-500 transition-colors duration-300 text-white ${
                  buyurtma?.sorov ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                So'rov yuborish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KomendantSavatcha;
