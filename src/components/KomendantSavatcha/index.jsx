import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchCartLength } from "../../redux/cartSlice";
import APISavat from "../../services/savat";
import APIBuyurtma from "../../services/buyurtma";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js";

const KomendantSavatcha = () => {
  const [savatXojalik, setSavatXojalik] = useState([]);
  const [savatRttm, setSavatRttm] = useState([]);
  const [buyurtma, setBuyurtma] = useState([]);
  const dispatch = useDispatch();
  const [komendantId, setKomendantId] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    if (data) {
      const unShifredName = CryptoJS.AES.decrypt(data?.id, "id-001")
        .toString(CryptoJS.enc.Utf8)
        .trim()
        .replace(/^"|"$/g, "");
      setKomendantId(unShifredName);
    }
  }, []);

  useEffect(() => {
    const getSavat = async () => {
      try {
        const response = await APISavat.get(komendantId);
        console.log(response.data);
        setSavatXojalik(
          response?.data.find((item) => item.maxsulot_role === "xojalik") || []
        );
        setSavatRttm(
          response?.data.find((item) => item.maxsulot_role === "rttm") || []
        );
        dispatch(fetchCartLength());
      } catch (error) {
        console.error("Failed to fetch savat", error);
      }
    };
    getSavat();
    
  }, [dispatch, komendantId]);

  useEffect(() => {
    const getBuyurtma = async () => {
      try {
        const response = await APIBuyurtma.get();
        setBuyurtma(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch savat", error);
      }
    };
    getBuyurtma();
  }, []);

  const handleSumbit = async () => {
    try {
      dispatch(fetchCartLength());
      await APISavat.delKorzinka();
    } catch (error) {
      console.error("Failed to submit and clear items", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await APISavat.delProduct(id);
      dispatch(fetchCartLength());
      // Mahsulot o'chirilgandan keyin savatni qayta yuklash
      const response = await APISavat.get(komendantId);
      setSavatXojalik(
        response?.data.find((item) => item.maxsulot_role === "xojalik") || []
      );
      setSavatRttm(
        response?.data.find((item) => item.maxsulot_role === "rttm") || []
      );
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  return (
    <div className="px-4 mb-4">
      <div className="breadcrumbs text-md">
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

      {savatXojalik.length === 0 ? (
        <div className="text-xl font-bold text-red-500 text-center">
          Sizning savatingiz bo'sh!
        </div>
      ) : (
        <div>
          {/* RTTM savat */}
          <div
            className={`text-xl font-semibold text-center mb-3 ${
              savatRttm.maxsulotlar.length > 0 ? "" : "hidden"
            }`}
          >
            RTTMga tegishli mahsulotlar
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-3">
            {savatRttm.maxsulotlar.map((item) => (
              <div key={item.id} className="border p-4 rounded-lg bg-slate-50">
                <h3 className="font-semibold">{item.maxsulot.name}</h3>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    {item.qiymat} {item.maxsulot.birlik?.name}
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleDelete(item.id)}>
                      <RiDeleteBin5Line className="w-5 h-auto text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => handleSumbit(savatRttm.id)}
            className={`btn w-full bg-blue-400 hover:bg-blue-500 transition-colors duration-300 text-white mb-5 ${
              savatRttm.maxsulotlar.length > 0 ? "" : "hidden"
            }`}
          >
            So'rov yuborish
          </button>

          {/* Xojalik savat */}
          <div
            className={`text-xl font-semibold text-center mb-3 ${
              savatXojalik.maxsulotlar.length > 0 ? "" : "hidden"
            }`}
          >
            Xo'jalik bo'limiga tegishli mahsulotlar
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-3">
            {savatXojalik.maxsulotlar.map((item) => (
              <div key={item.id} className="border p-4 rounded-lg bg-slate-50">
                <h3 className="font-semibold">{item.maxsulot.name}</h3>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    {item.qiymat} {item.maxsulot.birlik?.name}
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleDelete(item.id)}>
                      <RiDeleteBin5Line className="w-5 h-auto text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => handleSumbit(savatXojalik.id)}
            className={`btn w-full bg-blue-400 hover:bg-blue-500 transition-colors duration-300 text-white ${
              savatXojalik.maxsulotlar.length > 0 ? "" : "hidden"
            }`}
          >
            So'rov yuborish
          </button>
        </div>
      )}

      {/* Tasdiqlanish jarayonida */}
      <div
        className={`flex flex-col text-center my-4 ${
          buyurtma.length > 0 ? "" : "hidden"
        }`}
      >
        <h2 className="text-xl text-gray-700 font-medium italic my-4">
          Tasdiqlanish jarayonida
        </h2>
        {/* Buyurtma Timeline */}
        {buyurtma.map((item) => (
          <div key={item.id}>
            {/* Buyurtma maxsulotlar */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-3">
              {item.maxsulotlar.map((prod) => (
                <div
                  key={prod.id}
                  className="border p-4 rounded-lg bg-slate-50"
                >
                  <h3 className="font-semibold">{prod.maxsulot.name}</h3>
                  <div className="flex items-center gap-2">
                    <div>
                      {prod.qiymat} {prod.maxsulot.birlik?.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Tasdiqlanish jarayoni */}
            <ul className="steps steps-vertical md:steps-horizontal">
              <li
                data-content={`${item.xojalik ? "✓" : "?"}`}
                className={`step ${item.xojalik && "step-accent"}`}
              >
                Xo'jalik bo'limi
              </li>
              <li
                data-content={`${item.rttm ? "✓" : "?"}`}
                className={`step ${item.rttm && "step-accent"}`}
              >
                RTTM
              </li>
              <li
                data-content={`${item.prorektor ? "✓" : "?"}`}
                className={`step ${item.prorektor && "step-accent"}`}
              >
                Prorektor
              </li>
              <li
                data-content={`${item.bugalter ? "✓" : "?"}`}
                className={`step ${item.bugalter && "step-accent"}`}
              >
                Bugalter
              </li>
              <li
                data-content={`${item.omborchi ? "✓" : "?"}`}
                className={`step ${item.omborchi && "step-accent"}`}
              >
                Omborchi
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KomendantSavatcha;
