import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toggleWishlist } from "../redux/wishlistSlice";
import { FaHeartBroken, FaArrowLeft } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { auth } from "../firebase";

const WishlistPage = () => {
  const wishlist = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = auth.currentUser;

  return (
    <div className="pt-24 px-4 pb-10 max-w-6xl mx-auto min-h-screen">
      {/* Back Button + Title */}
      <div className="relative flex items-center justify-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 text-gray-600 hover:text-black text-xl p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          title="Go Back"
        >
          <FaArrowLeft />
        </button>
        <h2 className="text-2xl font-bold">My Wishlist</h2>
      </div>

      {/* Wishlist Items */}
      {wishlist.length === 0 ? (
        <div className="text-center mt-20 text-gray-500 text-lg">
          <FaHeartBroken className="mx-auto text-5xl mb-4" />
          No products in wishlist yet.
          <p className="text-sm mt-2">
            <Link to="/" className="text-blue-500 hover:underline">
              Continue Shopping
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg shadow-md p-4 bg-white flex flex-col items-center relative"
            >
              {/* Remove Icon */}
              <button
                onClick={() =>
                  dispatch(toggleWishlist({ product, uid: user?.uid }))
                }
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                title="Remove from Wishlist"
              >
                <MdDelete size={26} />
              </button>

              {/* Product Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[200px] object-contain mb-2"
              />

              {/* Name */}
              <h3 className="text-sm font-semibold text-center line-clamp-2 h-[40px]">
                {product.name}
              </h3>

              {/* Price */}
              <p className="text-green-600 font-bold mt-1">
                ₹{Math.min(...product.prices.map((p) => p.price))}
              </p>

              {/* View Button */}
              <button
                className="mt-3 text-sm text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                onClick={() =>
                  navigate(
                    `/product/${product.subCategory.toLowerCase()}/${
                      product.id
                    }`
                  )
                }
              >
                View Product
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;

// import { useSelector, useDispatch } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { toggleWishlist } from "../redux/wishlistSlice";
// import { FaHeartBroken } from "react-icons/fa";

// const WishlistPage = () => {
//   const wishlist = useSelector((state) => state.wishlist);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   return (
//     <div className="pt-24 px-4 pb-10 max-w-6xl mx-auto min-h-screen">
//       <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>

//       {wishlist.length === 0 ? (
//         <div className="text-center mt-20 text-gray-500 text-lg">
//           <FaHeartBroken className="mx-auto text-5xl mb-4" />
//           No products in wishlist yet.
//           <p className="text-sm mt-2">
//             <Link to="/" className="text-blue-500 hover:underline">
//               Continue Shopping
//             </Link>
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {wishlist.map((product) => (
//             <div
//               key={product.id}
//               className="border rounded-lg shadow-md p-4 bg-white flex flex-col items-center relative"
//             >
//               {/* Remove Button */}
//               <button
//                 onClick={() => dispatch(toggleWishlist(product))}
//                 className="absolute top-2 right-2 bg-red-100 text-red-600 px-2 py-0.5 text-xs rounded-full hover:bg-red-200"
//               >
//                 Remove
//               </button>

//               {/* Product Image */}
//               <img
//                 src={product.image}
//                 alt={product.name}
//                 className="w-full h-[200px] object-contain mb-2"
//               />

//               {/* Product Name */}
//               <h3 className="text-sm font-semibold text-center line-clamp-2 h-[40px]">
//                 {product.name}
//               </h3>

//               {/* Price */}
//               <p className="text-green-600 font-bold mt-1">
//                 ₹{Math.min(...product.prices.map((p) => p.price))}
//               </p>

//               {/* View Button */}
//               <button
//                 className="mt-3 text-sm text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
//                 onClick={() =>
//                   navigate(`/product/${product.subCategory.toLowerCase()}/${product.id}`)
//                 }
//               >
//                 View Product
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default WishlistPage;
