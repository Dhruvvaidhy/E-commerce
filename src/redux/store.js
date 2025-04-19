import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice";
import wishlistReducer from "./wishlistSlice";

const store = configureStore({
    reducer: {
        products: productsReducer,
        wishlist: wishlistReducer,
    },
});

export default store;
