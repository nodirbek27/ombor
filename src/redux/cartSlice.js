// src/redux/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APISavat from "../services/savat";
import APIBuyurtma from "../services/buyurtma";

// Async action to add item to the cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (newCartItem, { rejectWithValue }) => {
    try {
      await APISavat.post(newCartItem);
      return newCartItem;
    } catch (error) {
      return rejectWithValue("Failed to add item to the cart");
    }
  }
);

// Async action to fetch cart length
export const fetchCartLength = createAsyncThunk(
  "cart/fetchCartLength",
  async (_, { rejectWithValue }) => {
    try {
      const userId = Number(localStorage.getItem("userId"));
      const responseBuyurtma = await APIBuyurtma.get();
      const filteredBuyurtma = responseBuyurtma?.data?.filter(
        (item) => item.user === userId && item.active
      );
      if (filteredBuyurtma && filteredBuyurtma[0]?.id) {
        const response = await APISavat.get();  
        const filteredSavat = response?.data?.filter(
          (item) => item.buyurtma === filteredBuyurtma[0].id
        );    
        return filteredSavat?.length;
      }
    } catch (error) {
      return rejectWithValue("Failed to fetch cart length");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    cartLength: 0,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(fetchCartLength.fulfilled, (state, action) => {
        state.cartLength = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchCartLength.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
