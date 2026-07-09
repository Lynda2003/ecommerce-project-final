import { createSlice } from '@reduxjs/toolkit';

const cartFromStorage = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { items: [], shippingAddress: {} };

const cartSlice = createSlice({
  name: 'cart',
  initialState: cartFromStorage,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i._id === item._id);
      if (existing) {
        existing.qty = item.qty;
      } else {
        state.items.push(item);
      }
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state));
    },
    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.items.find((i) => i._id === id);
      if (item) item.qty = qty;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart, saveShippingAddress } = cartSlice.actions;
export default cartSlice.reducer;