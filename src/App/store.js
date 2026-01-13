import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "../Features/Cart/cartSlice";
import wishListSlice from "../Features/Wishlist/wishListSlice";
import { apiSlice } from "../Features/api/apiSlice";
const store = configureStore({
  reducer: {
    cart: cartSlice,
    wishlist: wishListSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
