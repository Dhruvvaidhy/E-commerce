import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../redux/wishlistSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { auth } from "../firebase";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);
  const user = auth.currentUser;

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  if (!product || !product.prices || product.prices.length === 0) return null;

  const lowestPrice = Math.min(...product.prices.map((p) => p.price));

  const sanitizeCategory = (cat) => {
    const normalized = cat?.toLowerCase();
    if (normalized === "laptopes") return "laptops";
    if (normalized === "mobiles") return "mobiles";
    if (normalized === "headphones") return "headphones";
    if (normalized === "watches") return "watches";
    return normalized;
  };

  const handleClick = () => {
    navigate(`/product/${sanitizeCategory(product.subCategory)}/${product.id}`);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    dispatch(toggleWishlist({ product, uid: user.uid }));
  };

  return (
    <div
      onClick={handleClick}
      className="relative flex flex-col items-center cursor-pointer bg-white w-full max-w-xs mx-auto sm:mx-2 rounded-lg transition-all duration-300 p-3"
    >
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-[200px] md:h-[250px] object-contain"
      />

      {/* Wishlist Toggle */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-2 right-2 text-red-500 text-xl z-10"
      >
        {isWishlisted ? <FaHeart /> : <FaRegHeart />}
      </button>

      {/* Product Name */}
      <h3 className="text-sm font-semibold text-center mt-2 line-clamp-2 h-[40px] px-1">
        {product.name}
      </h3>

      {/* Price */}
      <p className="text-green-500 font-semibold mt-1">₹ {lowestPrice}</p>

      {/* View Prices Button */}
      <button
        className="mt-2 text-blue-500 text-sm border border-blue-500 rounded-full px-3 py-1 hover:bg-blue-50 transition"
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        View Multi-Store Prices
      </button>
    </div>
  );
};

export default ProductCard;



// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toggleWishlist } from "../redux/wishlistSlice";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { auth } from "../firebase";
// import toast from "react-hot-toast";

// const ProductCard = ({ product }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const wishlist = useSelector((state) => state.wishlist);
//   const isWishlisted = wishlist.some((item) => item.id === product.id);
//   const user = auth.currentUser;

//   if (!product || !product.prices || product.prices.length === 0) return null;

//   const lowestPrice = Math.min(...product.prices.map((p) => p.price));

//   const sanitizeCategory = (cat) => {
//     const normalized = cat.toLowerCase();
//     if (normalized === "laptopes") return "laptops";
//     if (normalized === "mobiles") return "mobiles";
//     if (normalized === "headphones") return "headphones";
//     if (normalized === "watches") return "watches";
//     return normalized;
//   };

//   const handleClick = () => {
//     navigate(`/product/${sanitizeCategory(product.subCategory)}/${product.id}`);
//   };

//   const handleWishlistToggle = (e) => {
//     e.stopPropagation();
//     if (!user) {
//       toast.error("Please login to add to wishlist");
//       return;
//     }
//     dispatch(toggleWishlist({ product, uid: user.uid }));
//   };

//   return (
//     <div
//       onClick={handleClick}
//       className="relative flex flex-col items-center cursor-pointer bg-white w-full max-w-xs mx-auto sm:mx-2 rounded-lg transition-all duration-300 p-3"
//     >
//       <img
//         src={product.image}
//         alt={product.name}
//         className="w-full h-[200px] md:h-[250px] object-contain"
//       />
//       <button
//         onClick={handleWishlistToggle}
//         className="absolute top-2 right-2 text-red-500 text-xl z-10"
//       >
//         {isWishlisted ? <FaHeart /> : <FaRegHeart />}
//       </button>

//       <h3 className="text-sm font-semibold text-center mt-2 line-clamp-2 h-[40px] px-1">
//         {product.name}
//       </h3>

//       <p className="text-green-500 font-semibold mt-1">₹ {lowestPrice}</p>

//       <button
//         className="mt-2 text-blue-500 text-sm border border-blue-500 rounded-full px-3 py-1 hover:bg-blue-50 transition"
//         onClick={(e) => {
//           e.stopPropagation();
//           handleClick();
//         }}
//       >
//         View Multi-Store Prices
//       </button>
//     </div>
//   );
// };

// export default ProductCard;



// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toggleWishlist } from "../redux/wishlistSlice"
// import { FaHeart, FaRegHeart } from "react-icons/fa";


// const ProductCard = ({ product }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const wishlist = useSelector((state) => state.wishlist);
//   const isWishlisted = wishlist.some((item) => item.id === product.id);

//   if (!product || !product.prices || product.prices.length === 0) return null;

//   const lowestPrice = Math.min(...product.prices.map((p) => p.price));

//   const sanitizeCategory = (cat) => {
//     const normalized = cat.toLowerCase();
//     if (normalized === "laptopes") return "laptops";
//     if (normalized === "mobiles") return "mobiles";
//     if (normalized === "headphones") return "headphones";
//     if (normalized === "watches") return "watches";
//     return normalized;
//   };

//   const handleClick = () => {
//     navigate(`/product/${sanitizeCategory(product.subCategory)}/${product.id}`);
//   };

//   return (
//     <div
//       onClick={handleClick}
//       className="relative flex flex-col items-center cursor-pointer bg-white w-full max-w-xs mx-auto sm:mx-2 rounded-lg transition-all duration-300 p-3"
//     >
//       <img
//         src={product.image}
//         alt={product.name}
//         className="w-full h-[200px] md:h-[250px] object-contain"
//       />
//       <button
//         onClick={(e) => {
//           e.stopPropagation();
//           dispatch(toggleWishlist(product));
//         }}
//         className="absolute top-2 right-2 text-red-500 text-xl z-10"
//       >
//         {isWishlisted ? <FaHeart /> : <FaRegHeart />}
//       </button>

//       <h3 className="text-sm font-semibold text-center mt-2 line-clamp-2 h-[40px] px-1">
//         {product.name}
//       </h3>

//       <p className="text-green-500 font-semibold mt-1">₹ {lowestPrice}</p>

//       <button
//         className="mt-2 text-blue-500 text-sm border border-blue-500 rounded-full px-3 py-1 hover:bg-blue-50 transition"
//         onClick={(e) => {
//           e.stopPropagation();
//           handleClick();
//         }}
//       >
//         View Multi-Store Prices
//       </button>
//     </div>
//   );
// };

// export default ProductCard;


// import { useNavigate } from "react-router-dom";

// const ProductCard = ({ product }) => {
//   const navigate = useNavigate();

//   if (!product || !product.prices || product.prices.length === 0) return null;

//   const lowestPrice = Math.min(...product.prices.map((p) => p.price));

//   const sanitizeCategory = (cat) => {
//     const normalized = cat.toLowerCase();
//     if (normalized === "laptopes") return "laptops";
//     if (normalized === "mobiles") return "mobiles";
//     if (normalized === "headphones") return "headphones";
//     if (normalized === "watches") return "watches";
//     return normalized;
//   };

//   const handleClick = () => {
//     navigate(`/product/${sanitizeCategory(product.subCategory)}/${product.id}`);
//   };

//   return (
//     <div
//       onClick={handleClick}
//       className="flex flex-col items-center cursor-pointer bg-white w-full max-w-xs mx-auto sm:mx-2 rounded-lg  transition-all duration-300 p-3"
//     >
//       <img
//         src={product.image}
//         alt={product.name}
//         className="w-full h-[200px] md:h-[250px] object-contain"
//       />

//       <h3 className="text-sm font-semibold text-center mt-2 line-clamp-2 h-[40px] px-1">
//         {product.name}
//       </h3>

//       <p className="text-green-500 font-semibold mt-1">₹ {lowestPrice}</p> 

//       <button
//         className="mt-2 text-blue-500 text-sm border border-blue-500 rounded-full px-3 py-1 hover:bg-blue-50 transition"
//         onClick={(e) => { 
//           e.stopPropagation(); // prevent click bubbling to card
//           handleClick(); 
//         }}
//       > 
//         View Multi-Store Prices
//       </button>  
//     </div>
//   );
// };

// export default ProductCard;


// import { useNavigate } from "react-router-dom";

// const ProductCard = ({ product }) => {
//     const navigate = useNavigate();
  
//     if (!product || !product.prices || product.prices.length === 0) return null;
  
//     const lowestPrice = Math.min(...product.prices.map((p) => p.price));
  
//     // Fix for common typo categories
//     const sanitizeCategory = (cat) => {
//       const normalized = cat.toLowerCase();
//       if (normalized === "laptopes") return "laptops";
//       if (normalized === "mobiles") return "mobiles";
//       if (normalized === "headphones") return "headphones";
//       if (normalized === "watches") return "watches";
//       return normalized;
//     };
     
// const handleClick = () => {
//   navigate(`/product/${sanitizeCategory(product.subCategory)}/${product.id}`);
// };

//     return (
//       <div
//         onClick={handleClick}  
//         className="flex flex-col cursor-pointer items-center w-[220px] mx-4">
//         <img src={product.image} alt={product.name} className="w-full h-[250px] object-contain" />
  
//         <h3 className="text-sm font-semibold text-center mt-2 line-clamp-2 h-[40px]">
//           {product.name}
//         </h3>
  
//         <p className="text-green-500 font-semibold mt-1">₹ {lowestPrice}</p>
  
//         <button          
//          className="mt-2 cursor-pointer text-blue-500 text-sm border border-blue-500 rounded-full px-3 py-1 hover:bg-blue-50 transition"
//         >
//           View Multi-Store Prices
//         </button>
//       </div>
//     );
//   };

// export default ProductCard;



// const ProductCard = ({ product }) => {
//     if (!product || !product.prices || product.prices.length === 0) return null;
  
//     // Get the lowest price platform
//     const lowestPrice = Math.min(...product.prices.map((p) => p.price));
//     const bestPlatform = product.prices.find((p) => p.price === lowestPrice);
        
//     return (
//       <div className="flex flex-col items-center w-[220px] mx-4">
//         {/* Full Image without Border */}
//         <img src={product.image} alt={product.name} className="w-full h-[250px] object-contain" />
        
//         {/* Product Name */}
//         <h3 className="text-sm font-semibold text-center mt-2 line-clamp-2 h-[40px]">
//           {product.name}
//         </h3>
        
//         {/* Lowest Price */}
//         <p className="text-green-500 font-semibold mt-1">₹ {lowestPrice}</p>
        
//         {/* View Multi-Store Prices Button */}
//         {bestPlatform && (
//           <a href={bestPlatform.url} target="_blank" rel="noopener noreferrer"
//              className="mt-2 text-blue-500 text-sm">
//             View Multi-Store Prices
//           </a>
//         )}
//       </div>
//     );
//   };
  
// export default ProductCard;
  


// import React from "react";

// // const ProductCard = ({ product }) => {
// //   if (!product.prices || product.prices.length === 0) return null;

// //   // Find the lowest price
// //   const lowestPrice = Math.min(...product.prices.map((p) => p.price));
// //   const bestPlatform = product.prices.find((p) => p.price === lowestPrice);

// //   return (
// //     <div className="flex flex-col items-center w-[220px] mx-4 p-4 border rounded-lg shadow-md">
// //       {/* Product Image */}
// //       <img src={product.image} alt={product.name} className="w-full h-[250px] object-contain" />

// //       {/* Product Name */}
// //       <h3 className="text-sm font-semibold text-center mt-2 line-clamp-2 h-[40px]">
// //         {product.name}
// //       </h3>

// //       {/* Lowest Price */}
// //       <p className="text-green-500 font-semibold mt-1">₹ {lowestPrice} + Cashback</p>

// //       {/* View Multi-Store Prices Button */}
// //       <a href={bestPlatform.url} target="_blank" rel="noopener noreferrer"
// //          className="mt-2 text-blue-500 border border-blue-500 px-4 py-1 rounded-full text-sm">
// //         View Multi-Store Prices
// //       </a>
// //     </div>
// //   );
// // };
// const ProductCard = ({ product }) => {
//     if (!product || !product.prices || product.prices.length === 0) return null;
  
//     // Get the lowest price platform
//     const lowestPrice = Math.min(...product.prices.map((p) => p.price));
//     const bestPlatform = product.prices.find((p) => p.price === lowestPrice);
  
//     return (
//       <div className="flex flex-col items-center w-[220px] mx-4 p-4 border rounded-lg shadow-md">
//         {/* Product Image */}
//         <img src={product.image} alt={product.name} className="w-full h-[250px] object-contain" />
  
//         {/* Product Name */}
//         <h3 className="text-sm font-semibold text-center mt-2 line-clamp-2 h-[40px]">
//           {product.name}
//         </h3>
  
//         {/* Lowest Price */}
//         <p className="text-green-500 font-semibold mt-1">₹ {lowestPrice}</p>
  
//         {/* View Multi-Store Prices Button */}
//         {bestPlatform && (
//           <a href={bestPlatform.url} target="_blank" rel="noopener noreferrer"
//              className="mt-2 text-blue-500 border border-blue-500 px-4 py-1 rounded-full text-sm">
//             View Multi-Store Prices
//           </a>
//         )}
//       </div>
//     );
//   };
  

// export default ProductCard;



// import React from "react";

// const ProductCard = ({ product }) => {
//   // Find the lowest price
//   const lowestPrice = Math.min(...product.prices.map((p) => p.price));
//   const bestPlatform = product.prices.find((p) => p.price === lowestPrice);

//   return (
//     <div className="flex flex-col items-center w-[220px] mx-4">
//       {/* Product Image (Ensures full visibility) */}
//       <img src={product.image} alt={product.name} className="w-full h-[250px] object-contain" />

//       {/* Product Name (Truncated) */}
//       <h3 className="text-sm font-semibold text-center mt-2 line-clamp-2 h-[40px]">
//         {product.name}
//       </h3>

//       {/* Lowest Price */}
//       <p className="text-green-500 font-semibold mt-1">₹ {lowestPrice} + Cashback</p>

//       {/* View Multi-Store Prices Button */}
//       <a href={bestPlatform.url} target="_blank" rel="noopener noreferrer"
//          className="mt-2 text-blue-500 border border-blue-500 px-4 py-1 rounded-full text-sm">
//         View Multi-Store Prices
//       </a>
//     </div>
//   );
// };

// export default ProductCard;

