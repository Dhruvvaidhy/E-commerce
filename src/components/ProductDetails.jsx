import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../redux/wishlistSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight, FaArrowLeft } from "react-icons/fa";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const ProductDetails = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const dispatch = useDispatch();
  const swiperPrevRef = useRef(null);
  const swiperNextRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const wishlist = useSelector((state) => state.wishlist);
  const user = auth.currentUser;

  const isWishlisted = wishlist.some((item) => item.id === product?.id);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`http://localhost:5000/${category}/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [category, id]);

  useEffect(() => {
    if (product) {
      fetch(`http://localhost:5000/${category}`)
        .then((res) => res.json())
        .then((data) => {
          const filtered = data.filter((item) => item.id !== product.id);
          setRelatedProducts(filtered);
        });
    }
  }, [category, product]);

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }
    dispatch(toggleWishlist({ product, uid: user.uid }));
  };

  if (!product) return <p className="text-center mt-20">Loading...</p>;

  const sortedPrices = product.prices
    ?.slice()
    .sort((a, b) => a.price - b.price);
  const lowest = sortedPrices?.[0]?.price;

  return (
    <div className="pt-24 px-4 py-10 max-w-6xl mx-auto min-h-screen">
      <div className="relative flex items-center justify-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 text-gray-600 hover:text-black text-xl p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          title="Go Back"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-3xl font-bold">{product.name}</h1>
      </div>

      {/* <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-black text-xl p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          title="Go Back"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
      </div> */}

      <div className="flex flex-col lg:flex-row gap-10">
        {/* <div className="relative flex justify-center lg:justify-start">
          <img
            src={product.image}
            alt={product.name}
            className="h-[300px] md:h-[500px] w-full max-w-sm rounded-xl shadow-lg border object-contain"
          />
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 text-red-500 text-2xl p-1 hover:scale-110 transition"
          >
            {isWishlisted ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div> */}
        <div className="relative flex justify-center lg:justify-start w-full lg:w-[30%]">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-[300px] md:max-w-[350px] h-auto object-contain rounded-xl shadow-lg border"
            />
            <button
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 text-red-500 text-2xl p-1 bg-white rounded-full shadow hover:scale-110 transition"
            >
              {isWishlisted ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold border-b pb-3 mb-4">
            Compare Prices
          </h2>
          <div className="space-y-6">
            {/* {sortedPrices.map((platform, index) => {
              const finalPrice = platform.price;
              const originalPrice = platform.originalPrice || null;
              const discount = originalPrice
                ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
                : null;

              return (
                <div
                  key={index}
                  className={`flex flex-wrap items-center justify-between bg-white border rounded-xl p-5 shadow-sm gap-4 ${
                    finalPrice === lowest ? "bg-green-50 border-green-400" : ""
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-[140px]">
                    <img src={platform.logo} alt="logo" className="w-20 object-contain" />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 flex-1 justify-center">
                    <div className="text-center">
                      <p className="text-xl font-semibold text-black">
                        ₹{finalPrice.toLocaleString()}
                      </p>
                      {originalPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          ₹{originalPrice.toLocaleString()}
                        </p>
                      )}
                      {discount && (
                        <p className="text-sm text-red-500 font-medium">{discount}%</p>
                      )}
                    </div>

                    <div className="text-xl font-bold">-</div>

                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <img
                        src="https://img.icons8.com/fluency/24/money.png"
                        alt="Cashback"
                        className="w-5 h-5"
                      />
                      Cashback
                    </div>

                    <div className="text-xl font-bold">=</div>

                    <div className="border border-dashed border-green-500 px-4 py-2 rounded-lg">
                      <p className="text-lg font-semibold text-green-600">
                        ₹{finalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="min-w-[180px] text-right">
                    <a href={platform.url} target="_blank" rel="noopener noreferrer">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-1">
                        Buy Now @ {platform.platform} <span>➔</span>
                      </button>
                    </a>
                  </div>
                </div>
           

              );
            })} */}
            {sortedPrices.map((platform, index) => {
              const finalPrice = platform.price;
              const originalPrice = platform.originalPrice || null;
              const discount = originalPrice
                ? Math.round(
                    ((originalPrice - finalPrice) / originalPrice) * 100
                  )
                : null;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 border-b py-4 px-2 flex-wrap md:flex-nowrap"
                >
                  {/* Platform Logo */}
                  <div className="flex items-center gap-2 w-[140px] shrink-0">
                    <img
                      src={platform.logo}
                      alt="logo"
                      className="w-20 object-contain"
                    />
                  </div>

                  {/* Price */}
                  <div className="text-center min-w-[100px]">
                    <p className="text-base font-semibold text-black">
                      ₹{finalPrice.toLocaleString()}
                    </p>
                    {originalPrice && (
                      <p className="text-xs text-gray-500 line-through">
                        ₹{originalPrice.toLocaleString()}
                      </p>
                    )}
                    {discount && (
                      <p className="text-xs text-red-500 font-medium">
                        {discount}% OFF
                      </p>
                    )}
                  </div>

                  {/* "-" symbol */}
                  <div className="text-xl font-bold text-gray-500">-</div>

                  {/* Cashback */}
                  <div className="flex items-center gap-1 text-sm text-green-600 min-w-[90px] justify-center">
                    <img
                      src="https://img.icons8.com/fluency/24/money.png"
                      alt="Cashback"
                      className="w-5 h-5"
                    />
                    Cashback
                  </div>

                  {/* "=" symbol */}
                  <div className="text-xl font-bold text-gray-500">=</div>

                  {/* Final Price */}
                  <div className="border border-dashed border-green-500 px-4 py-1.5 rounded-md text-green-600 font-semibold min-w-[110px] text-center">
                    ₹{finalPrice.toLocaleString()}
                  </div>

                  {/* Buy Now Button */}
                  <div className="min-w-[200px] text-right">
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <button className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2.5 rounded-lg font-medium transition">
                        Buy Now @ {platform.platform}
                      </button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16 relative">
        <h2 className="text-2xl font-bold mb-6 text-center">
          SIMILAR FROM {product.brand?.toUpperCase() || category.toUpperCase()}
        </h2>

        {relatedProducts.length > 0 ? (
          <div className="relative px-8">
            {/* Custom Arrow Buttons OUTSIDE the card area */}
            <button
              ref={swiperPrevRef}
              disabled={isBeginning}
              className={`hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow ${
                isBeginning
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100 cursor-pointer"
              }`}
            >
              <FaChevronLeft size={18} />
            </button>

            <button
              ref={swiperNextRef}
              disabled={isEnd}
              className={`hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow ${
                isEnd
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100 cursor-pointer"
              }`}
            >
              <FaChevronRight size={18} />
            </button>

            <Swiper
              spaceBetween={16}
              modules={[Navigation]}
              navigation={{
                nextEl: swiperNextRef.current,
                prevEl: swiperPrevRef.current,
              }}
              breakpoints={{
                320: { slidesPerView: 1.2 },
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 5 },
              }}
              onInit={(swiper) => {
                swiper.params.navigation.prevEl = swiperPrevRef.current;
                swiper.params.navigation.nextEl = swiperNextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
            >
              {relatedProducts.map((item) => {
                const sorted = item.prices
                  ?.slice()
                  .sort((a, b) => a.price - b.price);

                return (
                  <SwiperSlide key={item.id}>
                    <div
                      onClick={() =>
                        navigate(`/product/${category}/${item.id}`)
                      }
                      className="group block border rounded-xl shadow-md hover:shadow-xl transition-all bg-white cursor-pointer flex flex-col justify-between h-[380px] p-4"
                    >
                      {/* Image */}
                      <div className="flex justify-center items-center h-[150px] mb-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* Name */}
                      <p className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 min-h-[40px]">
                        {item.name}
                      </p>

                      {/* Prices */}
                      <div className="flex flex-col gap-2 mb-2">
                        {sorted?.slice(0, 3).map((platform, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between bg-gray-100 px-3 py-1 rounded-md"
                          >
                            <img
                              src={platform.logo}
                              alt="logo"
                              className="w-12 h-6 object-contain"
                            />
                            <span className="text-sm font-medium text-green-700">
                              ₹{platform.price}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="text-center mt-auto">
                        <span className="text-sm text-blue-500 font-semibold">
                          View Details ➝
                        </span>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No related products found.
          </p>
        )}

        {/* View All Products Button */}
        {relatedProducts.length > 0 && (
          <div className="text-center mt-8">
            <Link
              to={`/category/${category}`}
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-6 py-3 rounded-full transition"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

// import { useParams, useNavigate, Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toggleWishlist } from "../redux/wishlistSlice";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { auth } from "../firebase";
// import toast from "react-hot-toast";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";

// const ProductDetails = () => {
//   const { category, id } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const dispatch = useDispatch();
//   const wishlist = useSelector((state) => state.wishlist);
//   const user = auth.currentUser;

//   const isWishlisted = wishlist.some((item) => item.id === product?.id);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     fetch(`http://localhost:5000/${category}/${id}`)
//       .then((res) => res.json())
//       .then((data) => setProduct(data));
//   }, [category, id]);

//   useEffect(() => {
//     if (product) {
//       fetch(`http://localhost:5000/${category}`)
//         .then((res) => res.json())
//         .then((data) => {
//           const filtered = data.filter((item) => item.id !== product.id);
//           setRelatedProducts(filtered);
//         });
//     }
//   }, [category, product]);

//   const handleWishlistToggle = () => {
//     if (!user) {
//       toast.error("Please login to add to wishlist");
//       return;
//     }
//     dispatch(toggleWishlist({ product, uid: user.uid }));
//   };

//   if (!product) return <p className="text-center mt-20">Loading...</p>;

//   const sortedPrices = product.prices?.slice().sort((a, b) => a.price - b.price);
//   const lowest = sortedPrices?.[0]?.price;

//   return (
//     <div className="pt-20 px-4 py-10 max-w-6xl mx-auto min-h-screen">
//       {/* Product Title */}
//       <div className="flex justify-center items-center gap-3 mb-8">
//         <h1 className="text-3xl font-bold text-center">{product.name}</h1>
//       </div>

//       {/* Main Section */}
//       <div className="flex flex-col lg:flex-row gap-10">
//         {/* Image + Wishlist */}
//         <div className="relative flex justify-center lg:justify-start">
//           <img
//             src={product.image}
//             alt={product.name}
//             className="h-[300px] md:h-[500px] w-full max-w-sm rounded-xl shadow-lg border object-contain"
//           />
//           <button
//             onClick={handleWishlistToggle}
//             className="absolute top-3 right-3 text-red-500 text-2xl p-1 hover:scale-110 transition"
//           >
//             {isWishlisted ? <FaHeart /> : <FaRegHeart />}
//           </button>
//         </div>

//         {/* Compare Prices */}
//         <div className="flex-1">
//           <h2 className="text-xl font-semibold border-b pb-3 mb-4">Compare Prices</h2>
//           <div className="space-y-6">
//             {sortedPrices.map((platform, index) => {
//               const finalPrice = platform.price;
//               const originalPrice = platform.originalPrice || null;
//               const discount = originalPrice
//                 ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
//                 : null;

//               return (
//                 <div
//                   key={index}
//                   className={`flex flex-wrap items-center justify-between bg-white border rounded-xl p-5 shadow-sm gap-4 ${
//                     finalPrice === lowest ? "bg-green-50 border-green-400" : ""
//                   }`}
//                 >
//                   {/* Logo */}
//                   <div className="flex items-center gap-4 min-w-[140px]">
//                     <img src={platform.logo} alt="logo" className="w-20 object-contain" />
//                   </div>

//                   {/* Prices */}
//                   <div className="flex flex-wrap items-center gap-4 flex-1 justify-center">
//                     <div className="text-center">
//                       <p className="text-xl font-semibold text-black">
//                         ₹{finalPrice.toLocaleString()}
//                       </p>
//                       {originalPrice && (
//                         <p className="text-sm text-gray-500 line-through">
//                           ₹{originalPrice.toLocaleString()}
//                         </p>
//                       )}
//                       {discount && (
//                         <p className="text-sm text-red-500 font-medium">{discount}%</p>
//                       )}
//                     </div>

//                     <div className="text-xl font-bold">-</div>

//                     <div className="flex items-center gap-2 text-sm text-green-600">
//                       <img
//                         src="https://img.icons8.com/fluency/24/money.png"
//                         alt="Cashback"
//                         className="w-5 h-5"
//                       />
//                       Cashback
//                     </div>

//                     <div className="text-xl font-bold">=</div>

//                     <div className="border border-dashed border-green-500 px-4 py-2 rounded-lg">
//                       <p className="text-lg font-semibold text-green-600">
//                         ₹{finalPrice.toLocaleString()}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Button */}
//                   <div className="min-w-[180px] text-right">
//                     <a href={platform.url} target="_blank" rel="noopener noreferrer">
//                       <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-1">
//                         Buy Now @ {platform.platform} <span>➔</span>
//                       </button>
//                     </a>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Related Products Section */}
//       <div className="mt-16">
//         <h2 className="text-2xl font-bold mb-6 text-center">
//           SIMILAR FROM {product.brand?.toUpperCase() || category.toUpperCase()}
//         </h2>

//         {relatedProducts.length > 0 ? (
//           <>
//             <Swiper
//               spaceBetween={20}
//               slidesPerView={2}
//               breakpoints={{
//                 640: { slidesPerView: 2 },
//                 768: { slidesPerView: 3 },
//                 1024: { slidesPerView: 4 },
//                 1280: { slidesPerView: 5 },
//               }}
//             >
//               {relatedProducts.map((item) => {
//                 const sorted = item.prices?.slice().sort((a, b) => a.price - b.price);
//                 const lowest = sorted?.[0];

//                 return (
//                   <SwiperSlide key={item.id}>
//                     <div
//                       onClick={() =>
//                         navigate(`/product/${category}/${item.id}`)
//                       }
//                       className="group block border rounded-xl shadow-md hover:shadow-xl transition-all p-4 bg-white h-full cursor-pointer"
//                     >
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         className="h-36 w-full object-contain mb-3 transition-transform duration-300 group-hover:scale-105"
//                       />
//                       <p className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
//                         {item.name}
//                       </p>

//                       {/* Prices */}
//                       <div className="flex flex-wrap gap-1 text-sm mt-1 mb-2">
//                         {item.prices?.slice(0, 3).map((platform, i) => (
//                           <div
//                             key={i}
//                             className="bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1"
//                           >
//                             <img src={platform.logo} alt="logo" className="w-4 h-4" />
//                             ₹{platform.price}
//                           </div>
//                         ))}
//                       </div>

//                       <div className="text-center mt-3">
//                         <span className="text-sm text-blue-500 font-semibold">
//                           View Details ➝
//                         </span>
//                       </div>
//                     </div>
//                   </SwiperSlide>
//                 );
//               })}
//             </Swiper>

//             {/* View All */}
//             <div className="text-center mt-8">
//               <Link
//                 to={`/category/${category}`}
//                 className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-6 py-3 rounded-full transition"
//               >
//                 View All Products
//               </Link>
//             </div>
//           </>
//         ) : (
//           <p className="text-center text-gray-500">No related products found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;

// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toggleWishlist } from "../redux/wishlistSlice";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { auth } from "../firebase";
// import toast from "react-hot-toast";

// const ProductDetails = () => {
//   const { category, id } = useParams();
//   const [product, setProduct] = useState(null);
//   const dispatch = useDispatch();
//   const wishlist = useSelector((state) => state.wishlist);
//   const user = auth.currentUser;

//   useEffect(() => {
//     fetch(`http://localhost:5000/${category}/${id}`)
//       .then((res) => res.json())
//       .then((data) => setProduct(data));
//   }, [category, id]);

//   if (!product) return <p className="text-center mt-20">Loading...</p>;

//   const sortedPrices = product.prices
//     ?.slice()
//     .sort((a, b) => a.price - b.price);
//   const lowest = sortedPrices?.[0]?.price;
//   const isWishlisted = wishlist.some((item) => item.id === product.id);

//   const handleWishlistToggle = () => {
//     if (!user) {
//       toast.error("Please login to add to wishlist");
//       return;
//     }
//     dispatch(toggleWishlist({ product, uid: user.uid }));
//   };

//   return (
//     <div className="pt-20 px-4 py-10 max-w-6xl mx-auto min-h-screen">
//       <div className="flex justify-center items-center gap-3 mb-8">
//         <h1 className="text-3xl font-bold text-center">{product.name}</h1>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-10">
//         {/* <div className="flex justify-center lg:justify-start">
//           <img
//             src={product.image}
//             alt={product.name}
//             className="h-[300px] md:h-[500px] w-full max-w-sm rounded-xl shadow-lg border object-contain"
//           />
//           <button
//           onClick={handleWishlistToggle}
//           className="text-red-500  text-xl"
//         >
//           {isWishlisted ? <FaHeart /> : <FaRegHeart />}
//         </button>
//         </div> */}
//         <div className="relative flex justify-center lg:justify-start">
//           <img
//             src={product.image}
//             alt={product.name}
//             className="h-[300px] md:h-[500px] w-full max-w-sm rounded-xl shadow-lg border object-contain"
//           />
//           <button
//             onClick={handleWishlistToggle}
//             className="absolute top-3 right-3 text-red-500 text-2xl p-1  hover:scale-110 transition"
//           >
//             {isWishlisted ? <FaHeart /> : <FaRegHeart />}
//           </button>
//         </div>

//         <div className="flex-1">
//           <h2 className="text-xl font-semibold border-b pb-3 mb-4">
//             Compare Prices
//           </h2>

//           <div className="space-y-6">
//             {sortedPrices.map((platform, index) => {
//               const finalPrice = platform.price;
//               const originalPrice = platform.originalPrice || null;
//               const discount = originalPrice
//                 ? Math.round(
//                     ((originalPrice - finalPrice) / originalPrice) * 100
//                   )
//                 : null;

//               return (
//                 <div
//                   key={index}
//                   className={`flex flex-wrap items-center justify-between bg-white border rounded-xl p-5 shadow-sm gap-4 ${
//                     finalPrice === lowest ? "bg-green-50 border-green-400" : ""
//                   }`}
//                 >
//                   <div className="flex items-center gap-4 min-w-[140px]">
//                     <img
//                       src={platform.logo}
//                       alt="logo"
//                       className="w-20 object-contain"
//                     />
//                   </div>

//                   <div className="flex flex-wrap items-center gap-4 flex-1 justify-center">
//                     <div className="text-center">
//                       <p className="text-xl font-semibold text-black">
//                         ₹{finalPrice.toLocaleString()}
//                       </p>
//                       {originalPrice && (
//                         <p className="text-sm text-gray-500 line-through">
//                           ₹{originalPrice.toLocaleString()}
//                         </p>
//                       )}
//                       {discount && (
//                         <p className="text-sm text-red-500 font-medium">
//                           {discount}%
//                         </p>
//                       )}
//                     </div>

//                     <div className="text-xl font-bold">-</div>

//                     <div className="flex items-center gap-2 text-sm text-green-600">
//                       <img
//                         src="https://img.icons8.com/fluency/24/money.png"
//                         alt="Cashback"
//                         className="w-5 h-5"
//                       />
//                       Cashback
//                     </div>

//                     <div className="text-xl font-bold">=</div>

//                     <div className="border border-dashed border-green-500 px-4 py-2 rounded-lg">
//                       <p className="text-lg font-semibold text-green-600">
//                         ₹{finalPrice.toLocaleString()}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="min-w-[180px] text-right">
//                     <a
//                       href={platform.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-1">
//                         Buy Now @ {platform.platform}
//                         <span>➔</span>
//                       </button>
//                     </a>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;

// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toggleWishlist } from "../redux/wishlistSlice";
// import { FaHeart, FaRegHeart } from "react-icons/fa";

// const ProductDetails = () => {
//   const { category, id } = useParams();
//   const [product, setProduct] = useState(null);
//   const dispatch = useDispatch();
//   const wishlist = useSelector((state) => state.wishlist);

//   useEffect(() => {
//     fetch(`http://localhost:5000/${category}/${id}`)
//       .then((res) => res.json())
//       .then((data) => setProduct(data));
//   }, [category, id]);

//   if (!product) return <p className="text-center mt-20">Loading...</p>;

//   const sortedPrices = product.prices?.slice().sort((a, b) => a.price - b.price);
//   const lowest = sortedPrices?.[0]?.price;
//   const isWishlisted = wishlist.some((item) => item.id === product.id);

//   return (
//     <div className="pt-20 px-4 py-10 max-w-6xl mx-auto min-h-screen">
//       <div className="flex justify-center items-center gap-3 mb-8">
//         <h1 className="text-3xl font-bold text-center">{product.name}</h1>
//         <button
//           onClick={() => dispatch(toggleWishlist(product))}
//           className="text-red-500 text-xl"
//         >
//           {isWishlisted ? <FaHeart /> : <FaRegHeart />}
//         </button>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-10">
//         <div className="flex justify-center lg:justify-start">
//           <img
//             src={product.image}
//             alt={product.name}
//             className="h-[300px] md:h-[500px] w-full max-w-sm rounded-xl shadow-lg border object-contain"
//           />
//         </div>

//         <div className="flex-1">
//           <h2 className="text-xl font-semibold border-b pb-3 mb-4">Compare Prices</h2>

//           <div className="space-y-6">
//             {sortedPrices.map((platform, index) => {
//               const finalPrice = platform.price;
//               const originalPrice = platform.originalPrice || null;
//               const discount = originalPrice
//                 ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
//                 : null;

//               return (
//                 <div
//                   key={index}
//                   className={`flex flex-wrap items-center justify-between bg-white border rounded-xl p-5 shadow-sm gap-4 ${
//                     finalPrice === lowest ? "bg-green-50 border-green-400" : ""
//                   }`}
//                 >
//                   <div className="flex items-center gap-4 min-w-[140px]">
//                     <img src={platform.logo} alt="logo" className="w-20 object-contain" />
//                   </div>

//                   <div className="flex flex-wrap items-center gap-4 flex-1 justify-center">
//                     <div className="text-center">
//                       <p className="text-xl font-semibold text-black">
//                         ₹{finalPrice.toLocaleString()}
//                       </p>
//                       {originalPrice && (
//                         <p className="text-sm text-gray-500 line-through">
//                           ₹{originalPrice.toLocaleString()}
//                         </p>
//                       )}
//                       {discount && (
//                         <p className="text-sm text-red-500 font-medium">{discount}%</p>
//                       )}
//                     </div>

//                     <div className="text-xl font-bold">-</div>

//                     <div className="flex items-center gap-2 text-sm text-green-600">
//                       <img
//                         src="https://img.icons8.com/fluency/24/money.png"
//                         alt="Cashback"
//                         className="w-5 h-5"
//                       />
//                       Cashback
//                     </div>

//                     <div className="text-xl font-bold">=</div>

//                     <div className="border border-dashed border-green-500 px-4 py-2 rounded-lg">
//                       <p className="text-lg font-semibold text-green-600">
//                         ₹{finalPrice.toLocaleString()}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="min-w-[180px] text-right">
//                     <a href={platform.url} target="_blank" rel="noopener noreferrer">
//                       <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-1">
//                         Buy Now @ {platform.platform}
//                         <span>➔</span>
//                       </button>
//                     </a>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;

// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";

// const ProductDetails = () => {
//   const { category, id } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     fetch(`http://localhost:5000/${category}/${id}`)
//       .then((res) => res.json())
//       .then((data) => setProduct(data));
//   }, [category, id]);

//   if (!product) return <p className="text-center mt-20">Loading...</p>;

//   const sortedPrices = product.prices?.slice().sort((a, b) => a.price - b.price);
//   const lowest = sortedPrices?.[0]?.price;

//   return (
//     <div className="pt-20 px-4 py-10 max-w-6xl mx-auto min-h-screen">
//       {/* Product Name */}
//       <h1 className="text-3xl font-bold text-center mb-8">{product.name}</h1>

//       {/* Image + Price Comparison */}
//       <div className="flex flex-col lg:flex-row gap-10">
//         {/* Product Image */}
//         <div className="flex justify-center lg:justify-start">
//           <img
//             src={product.image}
//             alt={product.name}
//             className="h-[300px] md:h-[500px] w-full max-w-sm rounded-xl shadow-lg border object-contain"
//           />
//         </div>

//         {/* Price Comparison Section */}
//         <div className="flex-1">
//           <h2 className="text-xl font-semibold border-b pb-3 mb-4">Compare Prices</h2>

//           <div className="space-y-6">
//             {sortedPrices.map((platform, index) => {
//               const finalPrice = platform.price;
//               const originalPrice = platform.originalPrice || null;
//               const discount = originalPrice
//                 ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
//                 : null;

//               return (
//                 <div
//                   key={index}
//                   className={`flex flex-wrap items-center justify-between bg-white border rounded-xl p-5 shadow-sm gap-4 ${
//                     finalPrice === lowest ? "bg-green-50 border-green-400" : ""
//                   }`}
//                 >
//                   {/* Platform Logo */}
//                   <div className="flex items-center gap-4 min-w-[140px]">
//                     <img src={platform.logo} alt="logo" className="w-20 object-contain" />
//                   </div>

//                   {/* Price Breakdown */}
//                   <div className="flex flex-wrap items-center gap-4 flex-1 justify-center">
//                     <div className="text-center">
//                       <p className="text-xl font-semibold text-black">
//                         ₹{finalPrice.toLocaleString()}
//                       </p>
//                       {originalPrice && (
//                         <p className="text-sm text-gray-500 line-through">
//                           ₹{originalPrice.toLocaleString()}
//                         </p>
//                       )}
//                       {discount && (
//                         <p className="text-sm text-red-500 font-medium">{discount}%</p>
//                       )}
//                     </div>

//                     <div className="text-xl font-bold">-</div>

//                     <div className="flex items-center gap-2 text-sm text-green-600">
//                       <img
//                         src="https://img.icons8.com/fluency/24/money.png"
//                         alt="Cashback"
//                         className="w-5 h-5"
//                       />
//                       Cashback
//                     </div>

//                     <div className="text-xl font-bold">=</div>

//                     <div className="border border-dashed border-green-500 px-4 py-2 rounded-lg">
//                       <p className="text-lg font-semibold text-green-600">
//                         ₹{finalPrice.toLocaleString()}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Buy Button */}
//                   <div className="min-w-[180px] text-right">
//                     <a href={platform.url} target="_blank" rel="noopener noreferrer">
//                       <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-1">
//                         Buy Now @ {platform.platform}
//                         <span>➔</span>
//                       </button>
//                     </a>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Description (for grocery or fallback) */}
//       {!product.prices && (
//         <div className="mt-10">
//           <h2 className="text-xl font-semibold border-b pb-2 mb-2">Product Details</h2>
//           <p className="text-gray-700 text-lg">
//             {product.description || "No additional details available."}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductDetails;

// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";

// const ProductDetails = () => {
//   const { category, id } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     fetch(`http://localhost:5000/${category}/${id}`)
//       .then((res) => res.json())
//       .then((data) => setProduct(data));
//   }, [category, id]);

//   if (!product) return <p className="text-center mt-10">Loading...</p>;

//   const sortedPrices = product.prices?.slice().sort((a, b) => a.price - b.price);
//   const lowest = sortedPrices?.[0]?.price;

//   return (
//     <div className="max-w-6xl mx-auto pt-[65px] px-4 py-10">
//       {/* Product Name */}
//       <h1 className="text-3xl font-bold text-center mb-8">{product.name}</h1>

//       {/* Image + Price Comparison */}
//       <div className="flex flex-col lg:flex-row gap-10">
//         {/* Product Image */}
//         <div className="flex justify-center lg:justify-start">
//           <img
//             src={product.image}
//             alt={product.name}
//             className="h-[500px] w-full max-w-sm rounded-xl shadow-lg border object-contain"
//           />
//         </div>

//         {/* Price Comparison Section */}
//         <div className="flex-1">
//           <h2 className="text-xl font-semibold border-b pb-3 mb-4">Compare Prices</h2>

//           <div className="space-y-6">
//             {sortedPrices.map((platform, index) => {
//               const finalPrice = platform.price;
//               const originalPrice = platform.originalPrice || null;
//               const discount = originalPrice
//                 ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
//                 : null;

//               return (
//                 <div
//                   key={index}
//                   className={`flex flex-wrap items-center justify-between bg-white border rounded-xl p-5 shadow-sm gap-4 ${
//                     finalPrice === lowest ? "bg-green-50 border-green-400" : ""
//                   }`}
//                 >
//                   {/* Platform Logo */}
//                   <div className="flex items-center gap-4 min-w-[140px]">
//                     <img src={platform.logo} alt="logo" className="w-20 object-contain" />
//                   </div>

//                   {/* Price Breakdown */}
//                   <div className="flex flex-wrap items-center gap-4 flex-1 justify-center">
//                     {/* Final Price */}
//                     <div className="text-center">
//                       <p className="text-xl font-semibold text-black">
//                         ₹{finalPrice.toLocaleString()}
//                       </p>
//                       {originalPrice && (
//                         <p className="text-sm text-gray-500 line-through">
//                           ₹{originalPrice.toLocaleString()}
//                         </p>
//                       )}
//                       {discount && (
//                         <p className="text-sm text-red-500 font-medium">{discount}%</p>
//                       )}
//                     </div>

//                     {/* Minus */}
//                     <div className="text-xl font-bold">-</div>

//                     {/* Cashback */}
//                     <div className="flex items-center gap-2 text-sm text-green-600">
//                       <img
//                         src="https://img.icons8.com/fluency/24/money.png"
//                         alt="Cashback"
//                         className="w-5 h-5"
//                       />
//                       Cashback
//                     </div>

//                     {/* Equals */}
//                     <div className="text-xl font-bold">=</div>

//                     {/* Final Price Box */}
//                     <div className="border border-dashed border-green-500 px-4 py-2 rounded-lg">
//                       <p className="text-lg font-semibold text-green-600">
//                         ₹{finalPrice.toLocaleString()}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Buy Button */}
//                   <div className="min-w-[180px] text-right">
//                     <a href={platform.url} target="_blank" rel="noopener noreferrer">
//                       <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-1">
//                         Buy Now @ {platform.platform}
//                         <span>➔</span>
//                       </button>
//                     </a>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Description (Grocery fallback) */}
//       {!product.prices && (
//         <div className="mt-10">
//           <h2 className="text-xl font-semibold border-b pb-2 mb-2">Product Details</h2>
//           <p className="text-gray-700 text-lg">
//             {product.description || "No additional details available."}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductDetails;

// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";

// const ProductDetails = () => {
//   const { category, id } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     fetch(`http://localhost:5000/${category}/${id}`)
//       .then((res) => res.json())
//       .then((data) => setProduct(data));
//   }, [category, id]);

//   if (!product) return <p className="text-center mt-10">Loading...</p>;

//   const sortedPrices = product.prices
//     ?.slice()
//     .sort((a, b) => a.price - b.price);
//   const lowest = sortedPrices?.[0]?.price;

//   return (
//     <div className="max-w-6xl mx-auto pt-[65px] px-4 py-10">
//       {/* Product Name Centered */}
//       <h1 className="text-3xl font-bold text-center mb-8">{product.name}</h1>

//       {/* Image + Price Comparison Section */}
//       <div className="flex flex-col lg:flex-row gap-10">
//         {/* Product Image */}
//         {/* <div className="flex justify-center lg:justify-start">
//           <img
//             src={product.image}
//             alt={product.name}
//             className="w-full max-w-sm rounded-xl shadow-lg border"
//           />
//         </div> */}

//         <div className="flex justify-center lg:justify-start">
//           <img
//             src={product.image}
//             alt={product.name}
//             className="h-[500px] w-full max-w-sm rounded-xl shadow-lg border object-contain"
//           />
//         </div>

//         {/* Price Comparison */}
//         <div className="flex-1">
//           <h2 className="text-xl font-semibold border-b pb-3 mb-4">
//             Compare Prices
//           </h2>
//           <div className="space-y-6">
//             {sortedPrices.map((platform, index) => {
//               const finalPrice = platform.price;
//               const originalPrice = platform.originalPrice || null;
//               const discount = originalPrice
//                 ? Math.round(
//                     ((originalPrice - finalPrice) / originalPrice) * 100
//                   )
//                 : null;

//               return (
//                 <div
//                   key={index}
//                   className={`flex items-center justify-between bg-white border rounded-xl p-5 shadow-sm ${
//                     finalPrice === lowest ? "bg-green-50 border-green-400" : ""
//                   }`}
//                 >
//                   {/* Platform Logo */}
//                   <div className="flex items-center gap-4 min-w-[140px]">
//                     <img
//                       src={platform.logo}
//                       alt="logo"
//                       className="w-20 object-contain"
//                     />
//                   </div>

//                   {/* Price Breakdown */}
//                   <div className="flex items-center gap-4 flex-1 justify-center">
//                     {/* Final Price */}
//                     <div className="text-center">
//                       <p className="text-xl font-semibold text-black">
//                         ₹{finalPrice.toLocaleString()}
//                       </p>
//                       {originalPrice && (
//                         <p className="text-sm text-gray-500 line-through">
//                           ₹{originalPrice.toLocaleString()}
//                         </p>
//                       )}
//                       {discount && (
//                         <p className="text-sm text-red-500 font-medium">
//                           {discount}%
//                         </p>
//                       )}
//                     </div>

//                     {/* Minus */}
//                     <div className="text-xl font-bold">-</div>

//                     {/* Cashback */}
//                     <div className="flex items-center gap-1 text-sm text-green-600">
//                       <img
//                         src="https://img.icons8.com/fluency/24/money.png"
//                         alt="Cashback"
//                         className="w-5 h-5"
//                       />
//                       Cashback
//                     </div>

//                     {/* Equals */}
//                     <div className="text-xl font-bold">=</div>

//                     {/* Final Price Box */}
//                     <div className="border border-dashed border-green-500 px-4 py-2 rounded-lg">
//                       <p className="text-lg font-semibold text-green-600">
//                         ₹{finalPrice.toLocaleString()}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Buy Button */}
//                   <div className="min-w-[180px] text-right">
//                     <a
//                       href={platform.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-1">
//                         Buy Now @ {platform.platform}
//                         <span>➔</span>
//                       </button>
//                     </a>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Description Section */}
//       {!product.prices && (
//         <div className="mt-10">
//           <h2 className="text-xl font-semibold border-b pb-2 mb-2">
//             Product Details
//           </h2>
//           <p className="text-gray-700 text-lg">
//             {product.description || "No additional details available."}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductDetails;

// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";

// const ProductDetails = () => {
//   const { category, id } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     fetch(`http://localhost:5000/${category}/${id}`)
//       .then(res => res.json())
//       .then(data => setProduct(data));
//   }, [category, id]);

//   if (!product) return <p className="text-center mt-10">Loading...</p>;

//   const sortedPrices = product.prices?.slice().sort((a, b) => a.price - b.price);
//   const lowest = sortedPrices?.[0]?.price;

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-10">
//       {/* Product Name Centered */}
//       <h1 className="text-3xl font-bold text-center mb-8">{product.name}</h1>

//       {/* Image + Price Comparison Section */}
//       <div className="flex flex-col lg:flex-row gap-10">
//         {/* Left: Product Image */}
//         <div className="flex justify-center lg:justify-start">
//           <img
//             src={product.image}
//             alt={product.name}
//             className="w-full max-w-sm rounded-xl shadow-lg border"
//           />
//         </div>

//         {/* Right: Price Comparison Table */}
//         <div className="flex-1">
//           <h2 className="text-xl font-semibold border-b pb-3 mb-4">Compare Prices</h2>
//           <div className="space-y-4">
//             {sortedPrices.map((platform, index) => (
//               <div
//                 key={index}
//                 className={`flex items-center justify-between p-4 rounded-xl border shadow-sm ${
//                   platform.price === lowest ? "bg-green-50 border-green-400" : "bg-white"
//                 }`}
//               >
//                 {/* Platform Logo Only */}
//                 <div className="w-14 h-14 flex justify-center items-center">
//                   <img src={platform.logo} alt="logo" className="w-12 h-12 object-contain" />
//                 </div>

//                 {/* Price */}
//                 <p className="text-xl font-semibold text-green-600">₹ {platform.price.toLocaleString()}</p>

//                 {/* Buy Now Button */}
//                 <a href={platform.url} target="_blank" rel="noopener noreferrer">
//                   <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition">
//                     Buy Now
//                   </button>
//                 </a>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Description Section (for non-price products like grocery) */}
//       {!product.prices && (
//         <div className="mt-10">
//           <h2 className="text-xl font-semibold border-b pb-2 mb-2">Product Details</h2>
//           <p className="text-gray-700 text-lg">{product.description || "No additional details available."}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductDetails;

// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";

// const ProductDetails = () => {
//   const { category, id } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     fetch(`http://localhost:5000/${category}/${id}`)
//       .then(res => res.json())
//       .then(data => setProduct(data));
//   }, [category, id]);

//   if (!product) return <p className="text-center mt-10">Loading...</p>;

//   // Find lowest price
//   const lowest = product.prices ? Math.min(...product.prices.map(p => p.price)) : null;

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       {/* Product Title */}
//       <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>

//       {/* Image + Price Comparison */}
//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* Product Image */}
//         <div className="flex-shrink-0">
//           <img
//             src={product.image}
//             alt={product.name}
//             className="w-full max-w-sm h-auto object-contain rounded-lg shadow-md"
//           />
//         </div>

//         {/* Platform Pricing Details */}
//         <div className="flex-1">
//           <h2 className="text-xl font-semibold mb-4 border-b pb-2">Available Prices</h2>

//           <div className="space-y-4">
//             {product.prices.map((platform, index) => (
//               <div
//                 key={index}
//                 className={`flex justify-between items-center p-4 rounded-lg border shadow-sm ${
//                   platform.price === lowest ? "bg-green-50 border-green-300" : "bg-white"
//                 }`}
//               >
//                 <div className="flex items-center gap-4">
//                   <img src={platform.logo} alt={platform.platform} className="w-12 h-12 object-contain" />
//                   <div>
//                     <p className="font-medium">{platform.platform}</p>
//                     {platform.price === lowest && (
//                       <p className="text-xs text-green-600 font-semibold">Lowest Price</p>
//                     )}
//                   </div>
//                 </div>

//                 <p className="text-lg font-bold text-green-600">₹ {platform.price.toLocaleString()}</p>

//                 <a href={platform.url} target="_blank" rel="noopener noreferrer">
//                   <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
//                     Buy Now
//                   </button>
//                 </a>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Description Section (for Grocery or others) */}
//       {!product.prices && (
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold border-b pb-2 mb-2">Product Details</h2>
//           <p className="text-gray-700 text-lg">{product.description || "No additional details available."}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductDetails;

// import { useParams, useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";

// const ProductDetails = () => {
//   const { category, id } = useParams();
//   const [product, setProduct] = useState(null);
//   const location = useLocation();

//   useEffect(() => {
//     fetch(`http://localhost:5000/${category}/${id}`)
//       .then(res => res.json())
//       .then(data => setProduct(data));
//   }, [category, id]);

//   if (!product) return <p className="text-center mt-10">Loading...</p>;

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       {/* Product Image & Info */}
//       <div className="flex flex-col md:flex-row items-center md:items-start">
//         <img src={product.image} alt={product.name} className="w-64 h-auto object-contain" />
//         <div className="md:ml-6 mt-4 md:mt-0">
//           <h1 className="text-2xl font-bold">{product.name}</h1>
//           <p className="text-gray-600 text-lg mt-2">Category: {category}</p>
//         </div>
//       </div>

//       {/* Price Comparison Section (Only for Electronics) */}
//       {product.prices && product.prices.length > 0 && (
//         <div className="mt-6">
//           <h2 className="text-xl font-semibold border-b pb-2">Price Comparison</h2>
//           <div className="border rounded-lg p-4 mt-4">
//             {product.prices.map((platform, index) => (
//               <div key={index} className="flex justify-between items-center border-b py-3">
//                 <div className="flex items-center">
//                   <img src={platform.logo} alt={platform.platform} className="w-12 h-12 object-contain mr-3" />
//                   <span className="text-lg font-medium">{platform.platform}</span>
//                 </div>
//                 <span className="text-green-500 font-semibold text-lg">₹ {platform.price}</span>
//                 <a href={platform.url} target="_blank" rel="noopener noreferrer">
//                   <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Buy Now</button>
//                 </a>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Grocery Products (Just Show Name & Image) */}
//       {!product.prices && (
//         <div className="mt-6">
//           <h2 className="text-xl font-semibold border-b pb-2">Product Information</h2>
//           <p className="text-lg mt-3">{product.description || "No additional details available."}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductDetails;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const ProductDetails = () => {
//   const { productId } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     fetch(`http://localhost:5000/product/${productId}`)
//       .then(res => res.json())
//       .then(data => setProduct(data))
//       .catch(error => console.error("Error fetching product details:", error));
//   }, [productId]);

//   if (!product) return <p>Loading...</p>;

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       {/* Product Header */}
//       <h2 className="text-2xl font-bold">{product.name}</h2>

//       <div className="flex gap-8">
//         {/* Product Image */}
//         <img src={product.image} alt={product.name} className="w-96 h-auto" />

//         {/* Price & Comparison Section */}
//         <div className="flex-1">
//           <h3 className="text-lg font-semibold">Compare Prices</h3>

//           {/* Price List */}
//           <div className="mt-4 space-y-4">
//             {product.prices.sort((a, b) => a.price - b.price).map((p, index) => (
//               <div key={index} className="flex justify-between border p-2 rounded-lg items-center">
//                 <img src={p.logo} alt={p.store} className="w-16 h-6 object-contain" />
//                 <p className="text-lg font-bold">₹ {p.price}</p>
//                 <a href={p.url} target="_blank" rel="noopener noreferrer" className="bg-yellow-500 text-white px-4 py-1 rounded">
//                   Buy Now
//                 </a>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* View More Prices */}
//       <div className="mt-6">
//         <h3 className="text-lg font-semibold">View More Prices</h3>
//         <div className="grid grid-cols-4 gap-4">
//           {product.extraStores.map((store, index) => (
//             <a key={index} href={store.url} target="_blank" rel="noopener noreferrer" className="border p-2 rounded-lg text-center">
//               <img src={store.logo} alt={store.name} className="w-16 h-6 mx-auto" />
//               <p className="text-sm">View Price</p>
//             </a>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const ProductDetails = () => {
//   const { productId } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     fetch(`http://localhost:5000/product/${productId}`)
//       .then(res => res.json())
//       .then(data => setProduct(data))
//       .catch(error => console.error("Error fetching product details:", error));
//   }, [productId]);

//   if (!product) return <p>Loading...</p>;

//   return (
//     <div className="p-6">
//       {/* Product Header */}
//       <h2 className="text-2xl font-bold">{product.name}</h2>

//       <div className="flex gap-8">
//         {/* Product Image */}
//         <img src={product.image} alt={product.name} className="w-96 h-auto" />

//         {/* Price & Comparison Section */}
//         <div className="flex-1">
//           <h3 className="text-lg font-semibold">Compare Prices</h3>

//           {/* Price List */}
//           <div className="mt-4">
//             {product.prices.map((p, index) => (
//               <div key={index} className="flex justify-between border p-2 rounded-lg items-center">
//                 <img src={p.logo} alt={p.store} className="w-16 h-6 object-contain" />
//                 <p className="text-lg font-bold">₹ {p.price}</p>
//                 <a href={p.url} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-1 rounded">
//                   Buy Now
//                 </a>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* View More Prices */}
//       <div className="mt-6">
//         <h3 className="text-lg font-semibold">View More Prices</h3>
//         <div className="grid grid-cols-4 gap-4">
//           {product.extraStores.map((store, index) => (
//             <a key={index} href={store.url} target="_blank" rel="noopener noreferrer" className="border p-2 rounded-lg text-center">
//               <img src={store.logo} alt={store.name} className="w-16 h-6 mx-auto" />
//               <p className="text-sm">View Price</p>
//             </a>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;
