import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "./ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProductSlider = ({ title, items, category }) => {
  const navigate = useNavigate();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  return (
    <div className="relative px-4 py-3 sm:px-6 md:px-8">
      {/* Title & View All */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold relative cursor-pointer group">
          {title}
          <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
        </h2>

        <button
          className="text-blue-500 text-sm sm:text-base hover:underline cursor-pointer"
          onClick={() => navigate(`/category/${category}`)}
        >
          View All
        </button>
      </div>

      {/* Navigation Arrows */}
      <button
        ref={prevRef}
        disabled={isBeginning}
        className={`hidden sm:flex absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow transition-all duration-300 ${
          isBeginning
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-gray-100 cursor-pointer"
        }`}
      > 
        <FaChevronLeft size={18} />
      </button>

      <button
        ref={nextRef}
        disabled={isEnd}
        className={`hidden sm:flex absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow transition-all duration-300 ${
          isEnd
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-gray-100 cursor-pointer"
        }`}
      >
        <FaChevronRight size={18} />
      </button>

      {/* Swiper */}
      <Swiper
        onSwiper={setSwiperInstance}
        spaceBetween={16}
        breakpoints={{
          320: { slidesPerView: 1.2 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        modules={[Navigation]}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
      >
        {items.map((product, index) => (
          <SwiperSlide key={`${product.id}-${index}`}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;

// import { useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import ProductCard from "./ProductCard";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// const ProductSlider = ({ title, items, category }) => {
//   const navigate = useNavigate();
//   const prevRef = useRef(null);
//   const nextRef = useRef(null);
//   const [isBeginning, setIsBeginning] = useState(true);
//   const [isEnd, setIsEnd] = useState(false);

//   return (
//     <div className="relative px-4 py-3 sm:px-6 md:px-8">
//       {/* Title & View All */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg sm:text-xl md:text-2xl font-bold relative cursor-pointer group">
//           {title}
//           <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
//         </h2>

//         <button
//           className="text-blue-500 text-sm sm:text-base hover:underline cursor-pointer"
//           onClick={() => navigate(`/category/${category}`)}
//         >
//           View All
//         </button>
//       </div>

//       {/* Navigation Arrows */}
//       <button
//         ref={prevRef}
//         className={`hidden sm:flex absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow ${
//           isBeginning ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"
//         }`}
//         disabled={isBeginning}
//       >
//         <FaChevronLeft size={18} />
//       </button>

//       <button
//         ref={nextRef}
//         className={`hidden sm:flex absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow ${
//           isEnd ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"
//         }`}
//         disabled={isEnd}
//       >
//         <FaChevronRight size={18} />
//       </button>

//       {/* Product Swiper */}
//       <Swiper
//         spaceBetween={16}
//         breakpoints={{
//           320: { slidesPerView: 1.2 },
//           480: { slidesPerView: 2 },
//           768: { slidesPerView: 3 },
//           1024: { slidesPerView: 4 },
//         }}
//         modules={[Navigation]}
//         navigation={{
//           prevEl: prevRef.current,
//           nextEl: nextRef.current,
//         }}
//         onInit={(swiper) => {
//           swiper.params.navigation.prevEl = prevRef.current;
//           swiper.params.navigation.nextEl = nextRef.current;
//           swiper.navigation.init();
//           swiper.navigation.update();
//           setIsBeginning(swiper.isBeginning);
//           setIsEnd(swiper.isEnd);
//         }}
//         onSlideChange={(swiper) => {
//           setIsBeginning(swiper.isBeginning);
//           setIsEnd(swiper.isEnd);
//         }}
//       >
//         {items.map((product, index) => (
//           <SwiperSlide key={`${product.id}-${index}`}>
//             <ProductCard product={product} />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default ProductSlider;


// import { useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import ProductCard from "./ProductCard";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// const ProductSlider = ({ title, items, category }) => {
//   const navigate = useNavigate();
//   const prevRef = useRef(null);
//   const nextRef = useRef(null);

//   return (
//     <div className="relative px-4 py-3 sm:px-6 md:px-8">
//       {/* Title & View All */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg sm:text-xl md:text-2xl font-bold relative cursor-pointer group">
//           {title}
//           <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
//         </h2>

//         <button
//           className="text-blue-500 text-sm sm:text-base hover:underline cursor-pointer"
//           onClick={() => navigate(`/category/${category}`)}
//         >
//           View All
//         </button>
//       </div>

//       {/* Swiper Navigation Buttons */}
//       <div
//         ref={prevRef}
//         className="hidden sm:flex absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 cursor-pointer"
//       >
//         <FaChevronLeft size={18} />
//       </div>
//       <div
//         ref={nextRef}
//         className="hidden sm:flex absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 cursor-pointer"
//       >
//         <FaChevronRight size={18} />
//       </div>

//       {/* Product Slider */}
//       <Swiper
//         spaceBetween={16}
//         breakpoints={{
//           320: { slidesPerView: 1.2 },
//           480: { slidesPerView: 2 },
//           768: { slidesPerView: 3 },
//           1024: { slidesPerView: 4 },
//         }}
//         modules={[Navigation]}
//         navigation={{
//           prevEl: prevRef.current,
//           nextEl: nextRef.current,
//         }}
//         onInit={(swiper) => {
//           swiper.params.navigation.prevEl = prevRef.current;
//           swiper.params.navigation.nextEl = nextRef.current;
//           swiper.navigation.init();
//           swiper.navigation.update();
//         }}
//       >
//         {items.map((product, index) => (
//           <SwiperSlide key={`${product.id}-${index}`}>
//             <ProductCard product={product} />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default ProductSlider;



// import { useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import ProductCard from "./ProductCard";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// const ProductSlider = ({ title, items, category }) => {
//   const navigate = useNavigate();
//   const prevRef = useRef(null);
//   const nextRef = useRef(null);

//   return (
//     <div className="p-4 relative">
//       {/* Title & View All */}
//       <div className="flex justify-between items-center mb-3">

//         <h2 className="text-xl font-bold relative cursor-pointer group">
//           {title}
//           <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
//         </h2>

//         <button
//           className="text-blue-500 text-sm"
//           onClick={() => navigate(`/category/${category}`)}
//         >
//           View All
//         </button>
//       </div>

//       {/* Custom Arrows */}
//       <div
//         ref={prevRef}
//         className="absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow cursor-pointer hover:bg-gray-100"
//       >
//         <FaChevronLeft />
//       </div>
//       <div
//         ref={nextRef}
//         className="absolute top-1/2 right-0 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow cursor-pointer hover:bg-gray-100"
//       >
//         <FaChevronRight />
//       </div>

//       {/* Swiper Slider */}
//       <Swiper
//         slidesPerView={4}
//         spaceBetween={20}
//         modules={[Navigation]}
//         navigation={{
//           prevEl: prevRef.current,
//           nextEl: nextRef.current,
//         }}
//         onInit={(swiper) => {
//           swiper.params.navigation.prevEl = prevRef.current;
//           swiper.params.navigation.nextEl = nextRef.current;
//           swiper.navigation.init();
//           swiper.navigation.update();
//         }}
//       >
//         {items.map((product, index) => (
//           <SwiperSlide key={`${product.id}-${index}`}>
//             <ProductCard product={product} />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default ProductSlider;


// import { useNavigate } from 'react-router-dom';
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import ProductCard from "./ProductCard";

// const ProductSlider = ({ title, items, category }) => {
//   const navigate = useNavigate(); // Hook for navigation

//   return (
//     <div className="p-4">
//       {/* Title & View All Button */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-bold">{title}</h2>
//         <button className="text-blue-500" onClick={() => navigate(`/category/${category}`)}>
//           View All
//         </button>
//       </div>

//       {/* Product Slider */}
//       <Swiper slidesPerView={4} spaceBetween={20} navigation>
//         {items.map((product, index) => (
//           <SwiperSlide key={`${product.id}-${index}`}>
//             <ProductCard product={product} />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default ProductSlider;

// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import ProductCard from "./ProductCard";

// const ProductSlider = ({ title, items }) => {
//   if (items.length === 0) return null; // Hide if no products

//   return (
//     <div className="mb-10">
//       {/* Title & View All Button */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-semibold">{title}</h2>
//         <button className="text-blue-500" onClick={() => window.location.href = `/${title.toLowerCase().replace(/\s/g, "")}`}>
//           View All
//         </button>
//       </div>

//       {/* Swiper Slider */}
//       <Swiper slidesPerView={4} spaceBetween={20} navigation>
//   {items.map((product, index) => (
//     <SwiperSlide key={`${product.id}-${index}`}>
//       <ProductCard product={product} />
//     </SwiperSlide>
//   ))}
// </Swiper>
//       {/* <Swiper modules={[Navigation]} slidesPerView={4} spaceBetween={20} navigation>
//         {items.map((product) => (
//           <SwiperSlide key={product.id}>
//             <ProductCard product={product} />
//           </SwiperSlide>
//         ))}
//       </Swiper> */}
//     </div>
//   );
// };

// export default ProductSlider;

// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import ProductCard from "./ProductCard";

// const ProductSlider = ({ title, items }) => {
//   if (items.length === 0) return null; // If no items, don't show slider

//   return (
//     <div className="mb-10">
//       {/* Title & View All Button */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-semibold">{title}</h2>
//         <button className="text-blue-500" onClick={() => window.location.href = `/${title.toLowerCase().replace(/\s/g, "")}`}>
//           View All
//         </button>
//       </div>

//       {/* Swiper Slider */}
//       <Swiper modules={[Navigation]} slidesPerView={4} spaceBetween={20} navigation>
//         {items.map((product) => (
//           <SwiperSlide key={product.id}>
//             <ProductCard product={product} />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default ProductSlider;
