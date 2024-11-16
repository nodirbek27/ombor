// src/redux/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Initial state for the cart
const initialState = {
  items: [],
};

// Create a slice for cart
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Check if item already exists in cart
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;  // Increment quantity if item exists
      } else {
        state.items.push({ ...action.payload, quantity: 1 });  // Add new item with quantity 1
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

// Export actions
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

// Export the reducer to be added to the store
export default cartSlice.reducer;
