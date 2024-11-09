import { createSlice } from "@reduxjs/toolkit";

const storeInLocalStorage = (data) => {
  localStorage.setItem("cart", JSON.stringify(data));
};

const initialState = {
  data: JSON.parse(localStorage.getItem("cart")) || [],
  totalAmount: 0,
  totalItems: 0,
};

if (initialState.data.length > 0) {
  initialState.totalAmount = initialState.data.reduce(
    (total, item) => total + item.totalPrice,
    0
  );
  initialState.totalItems = initialState.data.length;
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const existingProduct = state.data.find(
        (product) => product.id === action.payload.id
      );

      if (existingProduct) {
        const tempCart = state.data.map((product) => {
          if (product.id === action.payload.id) {
            let newQty = product.quantity + action.payload.quantity;
            let newTotalPrice = newQty * product.price;

            return {
              ...product,
              quantity: newQty,
              totalPrice: newTotalPrice,
            };
          } else {
            return product;
          }
        });
        state.data = tempCart;
        storeInLocalStorage(state.data);
      } else {
        state.data.push(action.payload);
        storeInLocalStorage(state.data);
      }
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;

      const productIndex = state.data.findIndex((product) => product.id === id);
      if (productIndex !== -1) {
        const updateProduct = {
          ...state.data[productIndex],
          quantity: Math.max(quantity || 1, 1),
        };
        updateProduct.totalPrice = updateProduct.price * updateProduct.quantity;

        state.data[productIndex] = updateProduct;
        storeInLocalStorage(state.data);
      }
    },

    removeItem(state, action) {
      const tempCart = state.data.filter(
        (product) => product.id !== action.payload.id
      );
      state.data = tempCart;
      storeInLocalStorage(state.data);
    },

    getCartTotal(state) {
      state.totalAmount = state.data.reduce((cartTotal, cartItem) => {
        return (cartTotal += cartItem.totalPrice);
      }, 0);

      state.totalItems = state.data.length;
    },

    RESET: (state) => {
      state.data = [];
      state.totalAmount = 0;
      state.totalItems = 0;
      storeInLocalStorage(state.data); // reset localStorage as well
    },
  },
});

export const { addToCart, updateQuantity, removeItem, getCartTotal, RESET } =
  cartSlice.actions;
export default cartSlice.reducer;
