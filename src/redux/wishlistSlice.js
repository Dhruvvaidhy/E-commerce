import { createSlice } from "@reduxjs/toolkit";

const getUserWishlist = (uid) => {
  const stored = localStorage.getItem(`wishlist_${uid}`);
  return stored ? JSON.parse(stored) : [];
};

const saveUserWishlist = (uid, wishlist) => {
  localStorage.setItem(`wishlist_${uid}`, JSON.stringify(wishlist));
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: [],
  reducers: {
    loadWishlistForUser: (state, action) => {
      const uid = action.payload;
      return getUserWishlist(uid);
    },
    toggleWishlist: (state, action) => {
      const { product, uid } = action.payload || {};
      if (!product || !uid) return state;

      const exists = state.find((item) => item.id === product.id);
      let updated;

      if (exists) {
        updated = state.filter((item) => item.id !== product.id);
      } else {
        updated = [...state, product];
      }

      saveUserWishlist(uid, updated);
      return updated;
    },
    clearWishlist: (state, action) => {
      const uid = action?.payload;
      if (uid) localStorage.removeItem(`wishlist_${uid}`);
      return [];
    },
  },
});

export const { toggleWishlist, clearWishlist, loadWishlistForUser } = wishlistSlice.actions;
export default wishlistSlice.reducer;



// import { createSlice } from "@reduxjs/toolkit";

// const getUserWishlist = (uid) => {
//   const stored = localStorage.getItem(`wishlist_${uid}`);
//   return stored ? JSON.parse(stored) : [];
// };

// const saveUserWishlist = (uid, wishlist) => {
//   localStorage.setItem(`wishlist_${uid}`, JSON.stringify(wishlist));
// };

// const wishlistSlice = createSlice({
//   name: "wishlist",
//   initialState: [],
//   reducers: {
//     loadWishlistForUser: (state, action) => {
//       const uid = action.payload;
//       return getUserWishlist(uid);
//     },
//     toggleWishlist: (state, action) => {
//       const { product, uid } = action.payload || {};
//       if (!product || !uid) return state;

//       const exists = state.find((item) => item.id === product.id);
//       let updated;

//       if (exists) {
//         updated = state.filter((item) => item.id !== product.id);
//       } else {
//         updated = [...state, product];
//       }

//       saveUserWishlist(uid, updated);
//       return updated;
//     },
//     clearWishlist: (state, action) => {
//       const uid = action?.payload;
//       if (uid) localStorage.removeItem(`wishlist_${uid}`);
//       return [];
//     },
//   },
// });

// export const { toggleWishlist, clearWishlist, loadWishlistForUser } = wishlistSlice.actions;
// export default wishlistSlice.reducer;


// import { createSlice } from "@reduxjs/toolkit";

// const getUserWishlist = (uid) => {
//   const stored = localStorage.getItem(`wishlist_${uid}`);
//   return stored ? JSON.parse(stored) : [];
// };

// const saveUserWishlist = (uid, wishlist) => {
//   localStorage.setItem(`wishlist_${uid}`, JSON.stringify(wishlist));
// };

// const wishlistSlice = createSlice({
//   name: "wishlist",
//   initialState: [],
//   reducers: {
//     loadWishlistForUser: (state, action) => {
//       const uid = action.payload;
//       return getUserWishlist(uid);
//     },
//     toggleWishlist: (state, action) => {
//       const { product, uid } = action.payload;
//       const exists = state.find((item) => item.id === product.id);
//       let updated;
//       if (exists) {
//         updated = state.filter((item) => item.id !== product.id);
//       } else {
//         updated = [...state, product];
//       }
//       saveUserWishlist(uid, updated);
//       return updated;
//     },
//     clearWishlist: (state, action) => {
//       const uid = action.payload;
//       saveUserWishlist(uid, []);
//       return [];
//     },
//   },
// });

// export const { toggleWishlist, clearWishlist, loadWishlistForUser } = wishlistSlice.actions;
// export default wishlistSlice.reducer;
