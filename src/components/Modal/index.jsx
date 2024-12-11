import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart, fetchCartLength } from "../../redux/cartSlice";

const Modal = ({ selectedItem, mahsulot, birlik, buyurtmaId, onClose }) => {
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

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

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!quantity) {
      setError("Miqdorni kiriting!");
      return;
    }

    const newCartItem = {
      qiymat: quantity,
      buyurtma: buyurtmaId,
      maxsulot: mahsulotId,
      birlik: birlikId,
      active: true,
    };

    try {
      await dispatch(addToCart(newCartItem));
      await dispatch(fetchCartLength());
      onClose();
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Savatga qo'shishda xatolik yuz berdi.");
    }
  };

  return (
    <dialog open className="modal">
      <div className="modal-box">
        <form onSubmit={handleAddToCart}>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
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
            <button
              type="submit"
              className="btn w-full bg-blue-400 hover:bg-blue-500 transition-colors duration-300 text-white"
            >
              Savatga qo'shish
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default Modal;
