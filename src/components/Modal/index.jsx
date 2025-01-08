import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart, fetchCartLength } from "../../redux/cartSlice";

const Modal = ({ selectedItem, onClose }) => {
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  console.log(selectedItem);
  // Handle input change with validation
  const handleQuantityChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setQuantity("");
      setError(null);
      return;
    }

    // Ensure value does not exceed yakuniyQiymat
    if (parseFloat(value) > selectedItem.qiymat) {
      setError(`Miqdor ${selectedItem.qiymat} dan katta bo'lishi mumkin emas!`);
    } else {
      setError(null);
    }

    setQuantity(value);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!quantity) {
      setError("Miqdorni kiriting!");
      return;
    }

    const newCartItem = {
      maxsulot: selectedItem.maxsulot.id,
      qiymat: quantity,
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
          <h3 className="font-bold text-lg mb-3">
            {selectedItem.maxsulot.name}
          </h3>
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
            <div>{selectedItem.maxsulot.birlik.name}</div>
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
