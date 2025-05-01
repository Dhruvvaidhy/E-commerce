import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../redux/wishlistSlice";
import { FaHeart, FaRegHeart, FaArrowLeft } from "react-icons/fa";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";

const FullProductList = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const wishlist = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, category));
        const firestoreData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (firestoreData.length > 0) {
          setProducts(firestoreData);
        } else {
          console.warn("No Firestore data found. Fetching from db.json...");
          const response = await fetch("/db.json");
          const json = await response.json();

          if (json[category]) {
            setProducts(json[category]);
          } else {
            setProducts([]);
            console.warn(`No data for category "${category}" found in db.json.`);
          }
        }

        setError(null);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (category) fetchProducts();
  }, [category]);

  const handleWishlistToggle = (product) => {
    if (!user) {
      toast.error("Please login to use wishlist");
      return;
    }
    dispatch(toggleWishlist({ product, uid: user.uid }));
  };

  return (
    <div className="pt-24 px-4 sm:px-6 md:px-8 pb-10 bg-gray-50 min-h-screen">
      <div className="relative flex items-center justify-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 text-gray-600 hover:text-black text-xl p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          title="Go Back"
        >
          <FaArrowLeft />
        </button>
        <h2 className="text-2xl font-bold capitalize">
          {category} - All Products
        </h2>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const isWishlisted = wishlist.some((item) => item.id === product.id);
            const sortedPrices = product.prices
              ? [...product.prices].sort((a, b) => a.price - b.price)
              : [];

            return (
              <div
                key={product.id}
                className="relative border rounded-xl shadow-md p-4 bg-white flex flex-col items-center h-[400px]"
              >
                <button
                  onClick={() => handleWishlistToggle(product)}
                  className="absolute top-3 right-3 text-red-500 text-xl z-10"
                >
                  {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                </button>

                {product.brand && (
                  <h3 className="text-sm font-bold text-blue-700 uppercase">
                    {product.brand}
                  </h3>
                )}

                <div className="flex justify-center items-center h-[150px] w-full mt-1">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <h3 className="text-sm font-semibold text-center mt-2 line-clamp-2 min-h-[40px] px-2">
                  {product.name}
                </h3>

                <div className="mt-2 w-full flex flex-col gap-1">
                  {sortedPrices.slice(0, 3).map((p, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 px-3 py-1 rounded-md"
                    >
                      <img
                        src={p.logo}
                        alt={p.store}
                        className="w-10 h-6 object-contain"
                      />
                      <p className="text-sm font-bold text-green-600">
                        ₹{p.price}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  to={`/product/${category}/${product.id}`}
                  className="w-full"
                >
                  <button className="mt-3 w-full text-sm text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700">
                    View Prices
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products found.</p>
      )}
    </div>
  );
};

export default FullProductList;


// import React, { useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toggleWishlist } from "../redux/wishlistSlice";
// import { FaHeart, FaRegHeart, FaArrowLeft } from "react-icons/fa";
// import { auth, db } from "../firebase";
// import { collection, getDocs } from "firebase/firestore";
// import toast from "react-hot-toast";

// const FullProductList = () => {
//   const { category } = useParams();
//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState(null);
//   const wishlist = useSelector((state) => state.wishlist);
//   const dispatch = useDispatch();
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, category));
//         const firestoreData = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         if (firestoreData.length > 0) {
//           setProducts(firestoreData);
//         } else {
//           console.warn("No Firestore data found. Fetching from db.json...");
//           const response = await fetch("/db.json");
//           const json = await response.json();

//           if (json[category]) {
//             setProducts(json[category]);
//           } else {
//             setProducts([]);
//             console.warn(`No data for category "${category}" found in db.json.`);
//           }
//         }

//         setError(null);
//       } catch (err) {
//         console.error("Error:", err);
//         setError("Failed to load products.");
//         setProducts([]);
//       }
//     };

//     if (category) fetchProducts();
//   }, [category]);

//   const handleWishlistToggle = (product) => {
//     if (!user) {
//       toast.error("Please login to use wishlist");
//       return;
//     }
//     dispatch(toggleWishlist({ product, uid: user.uid }));
//   };

//   return (
//     <div className="pt-24 px-4 sm:px-6 md:px-8 pb-10 bg-gray-50 min-h-screen">
//       <div className="relative flex items-center justify-center mb-8">
//         <button
//           onClick={() => navigate(-1)}
//           className="absolute left-0 text-gray-600 hover:text-black text-xl p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
//           title="Go Back"
//         >
//           <FaArrowLeft />
//         </button>
//         <h2 className="text-2xl font-bold capitalize">
//           {category} - All Products
//         </h2>
//       </div>

//       {error ? (
//         <p className="text-center text-red-500">{error}</p>
//       ) : products.length > 0 ? (
//         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {products.map((product) => {
//             const isWishlisted = wishlist.some((item) => item.id === product.id);
//             const sortedPrices = product.prices
//               ? [...product.prices].sort((a, b) => a.price - b.price)
//               : [];

//             return (
//               <div
//                 key={product.id}
//                 className="relative border rounded-xl shadow-md p-4 bg-white flex flex-col items-center h-[400px]"
//               >
//                 <button
//                   onClick={() => handleWishlistToggle(product)}
//                   className="absolute top-3 right-3 text-red-500 text-xl z-10"
//                 >
//                   {isWishlisted ? <FaHeart /> : <FaRegHeart />}
//                 </button>

//                 {product.brand && (
//                   <h3 className="text-sm font-bold text-blue-700 uppercase">
//                     {product.brand}
//                   </h3>
//                 )}

//                 <div className="flex justify-center items-center h-[150px] w-full mt-1">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="max-h-full max-w-full object-contain"
//                   />
//                 </div>

//                 <h3 className="text-sm font-semibold text-center mt-2 line-clamp-2 min-h-[40px] px-2">
//                   {product.name}
//                 </h3>

//                 <div className="mt-2 w-full flex flex-col gap-1">
//                   {sortedPrices.slice(0, 3).map((p, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between bg-gray-50 px-3 py-1 rounded-md"
//                     >
//                       <img
//                         src={p.logo}
//                         alt={p.store}
//                         className="w-10 h-6 object-contain"
//                       />
//                       <p className="text-sm font-bold text-green-600">
//                         ₹{p.price}
//                       </p>
//                     </div>
//                   ))}
//                 </div>

//                 <Link
//                   to={`/product/${category}/${product.id}`}
//                   className="w-full"
//                 >
//                   <button className="mt-3 w-full text-sm text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700">
//                     View Prices
//                   </button>
//                 </Link>
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <p className="text-center text-gray-500">No products found.</p>
//       )}
//     </div>
//   );
// };

// export default FullProductList;



// import React, { useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toggleWishlist } from "../redux/wishlistSlice";
// import { FaHeart, FaRegHeart, FaArrowLeft } from "react-icons/fa";
// import { auth } from "../firebase";
// import toast from "react-hot-toast";

// const FullProductList = () => {
//   const { category } = useParams();
//   const [products, setProducts] = useState([]);
//   const wishlist = useSelector((state) => state.wishlist);
//   const dispatch = useDispatch();
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch(`http://localhost:5000/${category}`)
//       .then((res) => res.json())
//       .then((data) => setProducts(data))
//       .catch((error) => console.error("Error fetching data:", error));
//   }, [category]);

//   const handleWishlistToggle = (product) => {
//     if (!user) {
//       toast.error("Please login to use wishlist");
//       return;
//     }
//     dispatch(toggleWishlist({ product, uid: user.uid }));
//   };

//   return (
//     <div className="pt-24 px-4 sm:px-6 md:px-8 pb-10 bg-gray-50 min-h-screen">
//       {/* <h2 className="text-2xl font-bold mb-6 capitalize text-center">{category} - All Products</h2> */}
//       <div className="relative flex items-center justify-center mb-8">
//         <button
//           onClick={() => navigate(-1)}
//           className="absolute left-0 text-gray-600 hover:text-black text-xl p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
//           title="Go Back"
//         >
//           <FaArrowLeft />
//         </button>
//         <h2 className="text-2xl font-bold capitalize">
//           {category} - All Products
//         </h2>
//       </div>

//       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {products.length > 0 ? (
//           products.map((product) => {
//             const isWishlisted = wishlist.some(
//               (item) => item.id === product.id
//             );

//             const sortedPrices = [...product.prices].sort(
//               (a, b) => a.price - b.price
//             );

//             return (
//               <div
//                 key={product.id}
//                 className="relative border rounded-xl shadow-md p-4 bg-white flex flex-col items-center h-[400px]"
//               >
//                 {/* Wishlist Button */}
//                 <button
//                   onClick={() => handleWishlistToggle(product)}
//                   className="absolute top-3 right-3 text-red-500 text-xl z-10"
//                 >
//                   {isWishlisted ? <FaHeart /> : <FaRegHeart />}
//                 </button>

//                 {/* Brand */}
//                 {product.brand && (
//                   <h3 className="text-sm font-bold text-blue-700 uppercase">
//                     {product.brand}
//                   </h3>
//                 )}

//                 {/* Image */}
//                 <div className="flex justify-center items-center h-[150px] w-full mt-1">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="max-h-full max-w-full object-contain"
//                   />
//                 </div>

//                 {/* Name */}
//                 <h3 className="text-sm font-semibold text-center mt-2 line-clamp-2 min-h-[40px] px-2">
//                   {product.name}
//                 </h3>

//                 {/* Prices */}
//                 <div className="mt-2 w-full flex flex-col gap-1">
//                   {sortedPrices.slice(0, 3).map((p, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between bg-gray-50 px-3 py-1 rounded-md"
//                     >
//                       <img
//                         src={p.logo}
//                         alt={p.store}
//                         className="w-10 h-6 object-contain"
//                       />
//                       <p className="text-sm font-bold text-green-600">
//                         ₹{p.price}
//                       </p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Button */}
//                 <Link
//                   to={`/product/${category}/${product.id}`}
//                   className="w-full"
//                 >
//                   <button className="mt-3 w-full text-sm text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700">
//                     View Prices
//                   </button>
//                 </Link>
//               </div>
//             );
//           })
//         ) : (
//           <p className="col-span-full text-center text-gray-500">
//             No products found.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FullProductList;

// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toggleWishlist } from "../redux/wishlistSlice";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { auth } from "../firebase";
// import toast from "react-hot-toast";

// const FullProductList = () => {
//   const { category } = useParams();
//   const [products, setProducts] = useState([]);
//   const wishlist = useSelector((state) => state.wishlist);
//   const dispatch = useDispatch();
//   const user = auth.currentUser;

//   useEffect(() => {
//     fetch(`http://localhost:5000/${category}`)
//       .then((res) => res.json())
//       .then((data) => setProducts(data))
//       .catch((error) => console.error("Error fetching data:", error));
//   }, [category]);

//   const handleWishlistToggle = (product) => {
//     if (!user) {
//       toast.error("Please login to use wishlist");
//       return;
//     }
//     dispatch(toggleWishlist({ product, uid: user.uid }));
//   };

//   return (
//     <div className="pt-20 p-6 bg-gray-50 min-h-screen">
//       <h2 className="text-2xl font-bold mb-4 capitalize">
//         {category} - All Products
//       </h2>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {products.length > 0 ? (
//           products.map((product) => {
//             const isWishlisted = wishlist.some(
//               (item) => item.id === product.id
//             );

//             return (
//               <div
//                 key={product.id}
//                 className="relative border rounded-lg shadow-md p-4 bg-white flex flex-col items-center"
//               >
//                 <button
//                   onClick={() => handleWishlistToggle(product)}
//                   className="absolute top-2 right-2 text-red-500 text-xl z-10"
//                 >
//                   {isWishlisted ? <FaHeart /> : <FaRegHeart />}
//                 </button>

//                 {product.brand && (
//                   <h3 className="text-sm font-bold text-blue-700 uppercase">
//                     {product.brand}
//                   </h3>
//                 )}

//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="w-full h-[200px] object-contain my-2"
//                 />

//                 <h3 className="text-sm font-semibold text-center mt-2 line-clamp-2 h-[40px]">
//                   {product.name}
//                 </h3>

//                 {/* <div className="mt-2 w-full">
//                   {product.prices
//                     .sort((a, b) => a.price - b.price)
//                     .map((p, index) => (
//                       <div key={index} className="flex items-center justify-between text-xs text-gray-700 my-1">
//                         <img src={p.logo} alt={p.store} className="w-16 h-5 object-contain" />
//                         <p className="text-sm font-bold text-green-600">₹{p.price}</p>
//                       </div>
//                     ))}
//                 </div> */}
//                 <div className="mt-2 w-full">
//                   {[...product.prices]
//                     .sort((a, b) => a.price - b.price)
//                     .map((p, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center justify-between text-xs text-gray-700 my-1"
//                       >
//                         <img
//                           src={p.logo}
//                           alt={p.store}
//                           className="w-16 h-5 object-contain"
//                         />
//                         <p className="text-sm font-bold text-green-600">
//                           ₹{p.price}
//                         </p>
//                       </div>
//                     ))}
//                 </div>

//                 <Link to={`/product/${category}/${product.id}`}>
//                   <button className="mt-3 text-sm text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600">
//                     View Prices
//                   </button>
//                 </Link>
//               </div>
//             );
//           })
//         ) : (
//           <p>No products found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FullProductList;

// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toggleWishlist } from "../redux/wishlistSlice";
// import { FaHeart, FaRegHeart } from "react-icons/fa";

// const FullProductList = () => {
//   const { category } = useParams();
//   const [products, setProducts] = useState([]);
//   const wishlist = useSelector((state) => state.wishlist);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     fetch(`http://localhost:5000/${category}`)
//       .then(res => res.json())
//       .then(data => setProducts(data))
//       .catch(error => console.error("Error fetching data:", error));
//   }, [category]);

//   return (
//     <div className="pt-20 p-6 bg-gray-50 min-h-screen">
//       <h2 className="text-2xl font-bold mb-4 capitalize">{category} - All Products</h2>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {products.length > 0 ? (
//           products.map((product) => {
//             const isWishlisted = wishlist.some((item) => item.id === product.id);

//             return (
//               <div key={product.id} className="relative border rounded-lg shadow-md p-4 bg-white flex flex-col items-center">
//                 <button
//                   onClick={() => dispatch(toggleWishlist(product))}
//                   className="absolute top-2 right-2 text-red-500 text-xl z-10"
//                 >
//                   {isWishlisted ? <FaHeart /> : <FaRegHeart />}
//                 </button>

//                 {product.brand && (
//                   <h3 className="text-sm font-bold text-blue-700 uppercase">{product.brand}</h3>
//                 )}

//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="w-full h-[200px] object-contain my-2"
//                 />

//                 <h3 className="text-sm font-semibold text-center mt-2 line-clamp-2 h-[40px]">
//                   {product.name}
//                 </h3>

//                 <div className="mt-2 w-full">
//                   {product.prices
//                     .sort((a, b) => a.price - b.price)
//                     .map((p, index) => (
//                       <div key={index} className="flex items-center justify-between text-xs text-gray-700 my-1">
//                         <img src={p.logo} alt={p.store} className="w-16 h-5 object-contain" />
//                         <p className="text-sm font-bold text-green-600">₹{p.price}</p>
//                       </div>
//                     ))}
//                 </div>

//                 <Link to={`/product/${category}/${product.id}`}>
//                   <button className="mt-3 text-sm text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600">
//                     View Prices
//                   </button>
//                 </Link>
//               </div>
//             );
//           })
//         ) : (
//           <p>No products found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FullProductList;

// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";

// const FullProductList = () => {
//   const { category } = useParams();
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     console.log("Fetching category:", category);
//     fetch(`http://localhost:5000/${category}`)
//       .then(res => res.json())
//       .then(data => {
//         console.log("API Response:", data);
//         setProducts(data);
//       })
//       .catch(error => console.error("Error fetching data:", error));
//   }, [category]);

//   return (
//     <div className="pt-20 p-6 bg-gray-50 min-h-screen">
//   <h2 className="text-2xl font-bold mb-4 capitalize">{category} - All Products</h2>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {products.length > 0 ? (
//           products.map((product) => (
//             <div key={product.id} className="border rounded-lg shadow-md p-4 bg-white flex flex-col items-center">

//               {/* Brand Name */}
//               {product.brand && (
//                 <h3 className="text-sm font-bold text-blue-700 uppercase">{product.brand}</h3>
//               )}

//               {/* Product Image */}
//               <img
//                 src={product.image}
//                 alt={product.name}
//                 className="w-full h-[200px] object-contain my-2"
//               />

//               {/* Product Name */}
//               <h3 className="text-sm font-semibold text-center mt-2 line-clamp-2 h-[40px]">
//                 {product.name}
//               </h3>

//               {/* Store Prices - Sorted from Lowest to Highest */}
//               <div className="mt-2 w-full">
//                 {product.prices
//                   .sort((a, b) => a.price - b.price)
//                   .map((p, index) => (
//                     <div key={index} className="flex items-center justify-between text-xs text-gray-700 my-1">
//                       {/* Platform Logo (Using API data) */}
//                       <img src={p.logo} alt={p.store} className="w-16 h-5 object-contain" />

//                       {/* Price */}
//                       <p className="text-sm font-bold text-green-600">₹{p.price}</p>
//                     </div>
//                   ))}
//               </div>

//               {/* View Prices Button (Centered) */}
//               <Link to={`/product/${category}/${product.id}`}>
//   <button className="mt-3 text-sm text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600">
//     View Prices
//   </button>
// </Link>

//             </div>
//           ))
//         ) : (
//           <p>No products found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FullProductList;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const FullProductList = () => {
//   const { category } = useParams();
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     console.log("Fetching category:", category);
//     fetch(`http://localhost:5000/${category}`)
//       .then(res => res.json())
//       .then(data => {
//         console.log("API Response:", data);
//         setProducts(data);
//       })
//       .catch(error => console.error("Error fetching data:", error));
//   }, [category]);

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4 capitalize">{category} - All Products</h2>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {products.length > 0 ? (
//           products.map((product) => (
//             <div key={product.id} className="border rounded-lg shadow-md p-4 bg-white">

//               {/* Brand Name (Samsung, Motorola, etc.) */}
//               {product.brand && (
//                 <h3 className="text-sm font-bold text-blue-700 uppercase">{product.brand}</h3>
//               )}

//               {/* Product Image */}
//               <img
//                 src={product.image}
//                 alt={product.name}
//                 className="w-full h-[200px] object-contain my-2"
//               />

//               {/* Product Name */}
//               <h3 className="text-sm font-semibold text-center mt-2 line-clamp-2 h-[40px]">
//                 {product.name}
//               </h3>

//               {/* Price Section */}
//               <div className="mt-2">
//                 <p className="text-lg font-bold text-green-500">
//                   ₹ {Math.min(...product.prices.map((p) => p.price))}
//                 </p>
//               </div>

//               {/* Store Prices List */}
//               <div className="mt-2">
//                 {product.prices.map((p, index) => (
//                   <p key={index} className="text-xs text-gray-700">
//                     {p.store}: ₹{p.price}
//                   </p>
//                 ))}
//               </div>

//               {/* Buttons */}
//               <div className="mt-3 flex justify-between">
//                 <a
//                   href={product.prices[0]?.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-sm text-blue-600 hover:underline"
//                 >
//                   View Prices
//                 </a>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>No products found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FullProductList;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import ProductCard from "./ProductCard";

// const categoryMap = {
//   electronics: ["mobiles", "headphones", "laptops", "watches"],
//   grocery: ["vegetables", "fruits", "dairy", "dry-fruits", "snacks", "beverages"]
// };

// const FullProductList = () => {
//   const { category } = useParams();
//   const [products, setProducts] = useState([]);

//   // useEffect(() => {
//   //   if (categoryMap[category]) {
//   //     Promise.all(
//   //       categoryMap[category].map((sub) =>
//   //         fetch(`http://localhost:5000/${sub}`).then(res => res.ok ? res.json() : [])
//   //       )
//   //     )
//   //       .then((results) => setProducts(results.flat()))
//   //       .catch((error) => console.error("Error fetching data:", error));
//   //   } else {
//   //     fetch(`http://localhost:5000/${category}`)
//   //       .then(res => res.json())
//   //       .then(data => setProducts(data))
//   //       .catch(error => console.error("Error fetching data:", error));
//   //   }
//   // }, [category]);
//   useEffect(() => {
//     console.log("Fetching category:", category);
//     fetch(`http://localhost:5000/${category}`)
//       .then(res => res.json())
//       .then(data => {
//         console.log("API Response:", data);
//         setProducts(data);
//       })
//       .catch(error => console.error("Error fetching data:", error));
//   }, [category]);

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4 capitalize">{category} - All Products</h2>
//       <div className="grid grid-cols-4 gap-4">
//         {products.length > 0 ? (
//           products.map((product) => <ProductCard key={product.id} product={product} />)
//         ) : (
//           <p>No products found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FullProductList;

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import ProductCard from './ProductCard';

// const FullProductList = () => {
//   const { category } = useParams(); // Get category from URL
//   const [products, setProducts] = useState([]);

//   // useEffect(() => {
//   //   fetch(`http://localhost:5000/${category}`)
//   //     .then((res) => res.json())
//   //     .then((data) => setProducts(data))
//   //     .catch((error) => console.error('Error fetching data:', error));
//   // }, [category]);
//   const categoryMap = {
//     electronics: ["mobiles", "laptops", "watches"],
//     grocery: ["vegetables", "fruits", "dairy", "dry-fruits", "snacks", "beverages"]
//   };

//   useEffect(() => {
//     if (categoryMap[category]) {
//       Promise.all(
//         categoryMap[category].map((sub) =>
//           fetch(`http://localhost:5000/${sub}`).then(res => res.json())
//         )
//       )
//         .then((results) => setProducts(results.flat()))
//         .catch((error) => console.error('Error fetching data:', error));
//     } else {
//       fetch(`http://localhost:5000/${category}`)
//         .then(res => res.json())
//         .then(data => setProducts(data))
//         .catch(error => console.error('Error fetching data:', error));
//     }
//   }, [category]);

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4 capitalize">{category} - All Products</h2>
//       <div className="grid grid-cols-4 gap-4">
//         {products.map((product) => (
//           <ProductCard key={product.id} product={product} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FullProductList;
