// src/redux/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APISavat from "../services/savat";
import CryptoJS from "crypto-js";

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
    const data = JSON.parse(localStorage.getItem("data"));
    try {
      if (data) {
        const unShifredId = CryptoJS.AES.decrypt(data?.id, "id-001")
          .toString(CryptoJS.enc.Utf8)
          .trim()
          .replace(/^"|"$/g, "");
        const response = await APISavat.get(unShifredId);
        const filteredSavat = response?.data;

        return (
          (filteredSavat[0]?.maxsulotlar?.length
            ? filteredSavat[0]?.maxsulotlar?.length
            : 0) +
          (filteredSavat[1]?.maxsulotlar?.length
            ? filteredSavat[1]?.maxsulotlar?.length
            : 0)
        );
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
