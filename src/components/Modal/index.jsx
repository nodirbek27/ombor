import React, { useState } from "react";
import APISavat from "../../services/savat";

const Modal = ({ selectedItem, mahsulot, birlik, buyurtmaId, onClose }) => {
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState(null);

  const mahsulotName =
    mahsulot.find((prod) => prod.id === selectedItem?.maxsulot)?.name ||
    "Noma'lum";
  const mahsulotId =
    mahsulot.find((prod) => prod.id === selectedItem?.maxsulot)?.id ||
    "Noma'lum";
  const birlikName =
    birlik.find((unit) => unit.id === selectedItem?.birlik)?.name || "Noma'lum";
  const birlikId =
    birlik.find((unit) => unit.id === selectedItem?.birlik)?.id || "Noma'lum";

  const handleQuantityChange = (e) => setQuantity(e.target.value);

  const handleAddToCart = async () => {
    if (!quantity) {
      setError("Miqdorni kiriting!");
      return;
    }
    try {
      const newCartItem = {
        qiymat: quantity,
        buyurtma: buyurtmaId,
        maxsulot: mahsulotId,
        birlik: birlikId,
        active: true,
      };
      await APISavat.post(newCartItem);
      onClose();
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Savatga qo'shishda xatolik yuz berdi.");
    }
  };

  return (
    <dialog open className="modal">
      <div className="modal-box">
        <form method="dialog" onClose={onClose}>
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-3">{mahsulotName}</h3>
        <div className="mb-3 flex items-center justify-between gap-3">
          <label className="input input-bordered flex items-center w-full gap-2">
            Miqdori:
            <input
              type="number"
              className="grow"
              placeholder="Miqdor"
              value={quantity}
              onChange={handleQuantityChange}
            />
          </label>
          <div>{birlikName}</div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="modal-action">
          <button className="btn w-full bg-blue-400 hover:bg-blue-500 transition-colors duration-300 text-white" onClick={handleAddToCart}>
            Savatga qo'shish
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
