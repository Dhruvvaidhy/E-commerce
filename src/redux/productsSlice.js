import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API URLs
const API_ENDPOINTS = {
  electronics: [
    "http://localhost:5000/Mobiles",
    "http://localhost:5000/headphones",
    "http://localhost:5000/laptopes",
    "http://localhost:5000/watches",
    "http://localhost:5000/ac",
  ],
  grocery: [
    "http://localhost:5000/vegetables",
    "http://localhost:5000/fruits",
    "http://localhost:5000/dairy",
    "http://localhost:5000/Dry Fruits",
    "http://localhost:5000/snacks",
    "http://localhost:5000/beverages",
  ],
};

// Fetch electronics products
export const fetchElectronics = createAsyncThunk("products/fetchElectronics", async () => {
  const responses = await Promise.all(API_ENDPOINTS.electronics.map((url) => axios.get(url)));
  return responses.flatMap((res) => res.data);
});

// Fetch grocery products
export const fetchGrocery = createAsyncThunk("products/fetchGrocery", async () => {
  const responses = await Promise.all(API_ENDPOINTS.grocery.map((url) => axios.get(url)));
  return responses.flatMap((res) => res.data);
});

const productSlice = createSlice({
  name: "products",
  initialState: {
    electronics: [],
    grocery: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchElectronics.pending, (state) => { state.status = "loading"; })
      .addCase(fetchElectronics.fulfilled, (state, action) => { state.status = "succeeded"; state.electronics = action.payload; })
      .addCase(fetchElectronics.rejected, (state, action) => { state.status = "failed"; state.error = action.error.message; })
      .addCase(fetchGrocery.pending, (state) => { state.status = "loading"; })
      .addCase(fetchGrocery.fulfilled, (state, action) => { state.status = "succeeded"; state.grocery = action.payload; })
      .addCase(fetchGrocery.rejected, (state, action) => { state.status = "failed"; state.error = action.error.message; });
  },
});

export default productSlice.reducer;



// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // API URLs
// const API_ENDPOINTS = {
//   electronics: [
//     "http://localhost:5000/Mobiles",
//     "http://localhost:5000/headphones",
//     "http://localhost:5000/laptopes",
//     "http://localhost:5000/watches",
//   ],
//   grocery: [
//     "http://localhost:5000/vegetables",
//     "http://localhost:5000/fruits",
//     "http://localhost:5000/dairy",
//     "http://localhost:5000/Dry Fruits",
//     "http://localhost:5000/snacks",
//     "http://localhost:5000/beverages",
//   ],
// };

// // Fetch electronics products
// export const fetchElectronics = createAsyncThunk(
//   "products/fetchElectronics",
//   async () => {
//     const responses = await Promise.all(
//       API_ENDPOINTS.electronics.map((url) => axios.get(url))
//     );
//     return responses.flatMap((res) => res.data);
//   }
// );

// // Fetch grocery products
// export const fetchGrocery = createAsyncThunk(
//   "products/fetchGrocery",
//   async () => {
//     const responses = await Promise.all(
//       API_ENDPOINTS.grocery.map((url) => axios.get(url))
//     );
//     return responses.flatMap((res) => res.data);
//   }
// );

// const productSlice = createSlice({
//   name: "products",
//   initialState: {
//     electronics: [],
//     grocery: [],
//     status: "idle",
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchElectronics.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchElectronics.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.electronics = action.payload;
//       })
//       .addCase(fetchElectronics.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       })
//       .addCase(fetchGrocery.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchGrocery.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.grocery = action.payload;
//       })
//       .addCase(fetchGrocery.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       });
//   },
// });

// export default productSlice.reducer;




// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // Define API endpoints
// const endpoints = {
//     electronics: ["Mobiles", "headphones", "laptopes", "watches"],
//     grocery: ["vegetables", "fruits", "dairy", "Dry Fruits", "snacks", "beverages"],
// };

// // Fetch products based on category
// export const fetchProducts = createAsyncThunk(
//     "products/fetchProducts",
//     async (category) => {
//         const urls = endpoints[category].map(sub => fetch(`http://localhost:5000/${sub}`).then(res => res.json()));
//         const data = await Promise.all(urls);
//         return data.flat();
//     }
// );

// const productsSlice = createSlice({
//     name: "products",
//     initialState: {
//         products: [],
//         status: "idle",
//     },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchProducts.pending, (state) => {
//                 state.status = "loading";
//             })
//             .addCase(fetchProducts.fulfilled, (state, action) => {
//                 state.status = "succeeded";
//                 state.products = action.payload;
//             })
//             .addCase(fetchProducts.rejected, (state) => {
//                 state.status = "failed";
//             });
//     },
// });

// export default productsSlice.reducer;
