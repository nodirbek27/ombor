// src/redux/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";
import APISavat from "../services/savat";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    setCartItems(state, action) {
      state.items = action.payload;
    },
    addItemToCart(state, action) {
      state.items.push(action.payload);
    },
  },
});

export const { setCartItems, addItemToCart } = cartSlice.actions;

export const fetchCartItems = (buyurtmaId) => async (dispatch) => {
  try {
    const response = await APISavat.get();
    const filteredSavat = response.data.filter(
      (item) => item.buyurtma === buyurtmaId
    );
    dispatch(setCartItems(filteredSavat));
  } catch (error) {
    console.error("Failed to fetch cart items", error);
  }
};

export default cartSlice.reducer;
