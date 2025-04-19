import React from "react";
import Marquee from "react-fast-marquee";

const Adds = () => {
  const storeLogos = [
    {
      name: "Amazon",
      src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Amazon.in/Seller-Logo.png",
    },
    {
      name: "Flipkart",
      src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Flipkart.com/Seller-Logo.png",
    },
    {
      name: "Jiomart",
      src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Jiomart.com/Seller-Logo.png",
    },
    {
      name: "Zepto",
      src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Zeptonow.com/Seller-Logo.png",
    },
    {
      name: "Blinkit",
      src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Blinkit.com/Seller-Logo.png",
    },
    {
      name: "Instamart",
      src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Swiggy.com/Seller-Logo.png",
    },
    {
      name: "Vijay Sales",
      src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Vijaysales.com/Seller-Logo.png",
    },
    {
      name: "Croma",
      src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Croma.com/Seller-Logo.png",
    },
  ];

  return (
    <div className="bg-white py-3 border-t border-b-2 border-gray-300 border-dotted">
      <div className="flex flex-col md:flex-row items-center justify-between px-4 gap-3 md:gap-0">

        {/* Left: Title (Always visible) */}
        <span className="font-bold text-base md:text-lg whitespace-nowrap text-center">
          India’s #1 Online Mall
        </span>

        {/* Marquee Section */}
        <div className="w-full md:w-[450px] overflow-hidden">
          <Marquee speed={40} pauseOnHover={true} gradient={false}>
            {storeLogos.map((store, index) => (
              <img
                key={index}
                src={store.src}
                alt={store.name}
                className="mx-4"
                style={{
                  width: "100px",
                  height: "40px",
                  objectFit: "contain",
                }}
              />
            ))}
          </Marquee>
        </div>

        {/* Right Info (Only on md and up) */}
        <div className="hidden md:flex items-center gap-4 whitespace-nowrap">
          <span className="flex items-center font-bold text-lg gap-1">
            ⭐ <span>500+ Stores</span>
          </span>
          <span className="flex items-center font-bold text-lg gap-1">
            ⭐ <span>2 Crore+ Products & Deals</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Adds;


// import React from "react";
// import Marquee from "react-fast-marquee";

// const Adds = () => {
//   const storeLogos = [
//     {
//       name: "Amazon",
//       src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Amazon.in/Seller-Logo.png",
//     },
//     {
//       name: "Flipkart",
//       src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Flipkart.com/Seller-Logo.png",
//     },
//     {
//       name: "Jiomart",
//       src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Jiomart.com/Seller-Logo.png",
//     },
//     {
//       name: "Zepto",
//       src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Zeptonow.com/Seller-Logo.png",
//     },
//     {
//       name: "Blinkit",
//       src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Blinkit.com/Seller-Logo.png",
//     },
//     {
//       name: "Instamart",
//       src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Swiggy.com/Seller-Logo.png",
//     },
//     {
//       name: "Vijay Sales",
//       src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Vijaysales.com/Seller-Logo.png",
//     },
//     {
//       name: "Croma",
//       src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Croma.com/Seller-Logo.png",
//     },
//   ];

//   return (
//     <div className="bg-white py-3 border-t border-gray-300 border-b-2 border-dotted">
//       <div className="flex items-center justify-between px-4">
        
//         {/* Left Content */}
//         <span className="font-bold text-lg whitespace-nowrap">
//           India’s #1 Online Mall
//         </span>

//         <span className="mx-2">⭐</span>

//         <span className="font-bold text-lg whitespace-nowrap">
//           500+ Stores:
//         </span>

//         {/* Marquee for Logos Only */}
//         <div className="inline-block w-[400px] overflow-hidden align-middle">
//           <Marquee speed={40} pauseOnHover={true} gradient={false}>
//             {storeLogos.map((store, index) => (
//               <img
//                 key={index}
//                 src={store.src}
//                 alt={store.name}
//                 className="mx-4"
//                 style={{
//                   width: "100px", // Logo Width
//                   height: "40px", // Logo Height
//                   objectFit: "contain", // Maintain Aspect Ratio
//                 }}
//               />
//             ))}
//           </Marquee>
//         </div>

//         <span className="mx-2">⭐</span>

//         {/* Right Content */}
//         <span className="font-bold text-lg whitespace-nowrap">
//           2 Crore+ Products & Deals
//         </span>
//       </div>
//     </div>
//   );
// };

// export default Adds;


// import React from "react";
// import Marquee from "react-fast-marquee";

// const Adds = () => {
//   const storeLogos = [
//     {
//       name: "Amazon",
//       src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Amazon.in/Seller-Logo.png",
//     },
//     {
//       name: "Flipkart",
//       src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Flipkart.com/Seller-Logo.png",
//     },
//     {
//       name: "Jiomart",
//       src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Flipkart.com/Seller-Logo.png",
//     },
//     {
//       name: "Zepto",
//       src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Zeptonow.com/Seller-Logo.png",
//     },
//     {
//       name: "Blinkit",
//       src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Blinkit.com/Seller-Logo.png",
//     },
//     {
//       name: "Instamart",
//       src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Swiggy.com/Seller-Logo.png",
//     },
//     {
//       name: "Vijay Sales",
//       src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Vijaysales.com/Seller-Logo.png",
//     },
//     {
//       name: "Croma",
//       src: "https://d372i0x0rvq68a.cloudfront.net/seller_logos/Croma.com/Seller-Logo.png",
//     },
//   ];

//   return (
//     <div className="bg-white py-3 border-t border-gray-300">
//       {/* Static Text */}
//       <span className="font-bold text-lg mx-4">India’s #1 Online Mall</span>
//       <span className="mx-2">⭐</span>
//       <span className="font-bold text-lg mx-4">500+ Stores:</span>

//       {/* Marquee Only on Logos */}
//       <div className="inline-block w-[300px] overflow-hidden align-middle">
//         <Marquee speed={50} pauseOnHover={true} gradient={false}>
//           {storeLogos.map((store, index) => (
//             <img
//               key={index}
//               src={store.src}
//               alt={store.name}
//               className="mx-4"
//               style={{
//                 width: "100px", // Logo Width
//                 height: "40px", // Logo Height
//                 objectFit: "contain", // Maintain Aspect Ratio
//               }}
//             />
//           ))}
//         </Marquee>
//       </div>

//       <span className="mx-2">⭐</span>
//       <span className="font-bold text-lg mx-4">2 Crore+ Products & Deals</span>
//     </div>
//   );
// };

// export default Adds;



// import React from "react";
// import Marquee from "react-fast-marquee";

// const Adds = () => {
//   const storeLogos = [
//     {
//       name: "Amazon",
//       src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/905px-Amazon_logo.svg.png",
//     },
//     {
//       name: "Flipkart",
//       src: "https://cdn.freebiesupply.com/logos/large/2x/flipkart-logo-png-transparent.png",
//     },
//     {
//       name: "Zepto",
//       src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Zepto_Logo.svg/2560px-Zepto_Logo.svg.png",
//     },
//     {
//       name: "Blinkit",
//       src: "https://www.logoshape.com/wp-content/uploads/2024/09/blinkit-logo-vector_logoshape.png",
//     },
//     {
//       name: "Vijay Sales",
//       src: "https://upload.wikimedia.org/wikipedia/commons/1/1b/VijaySale-Logo.png",
//     },
//     {
//       name: "Croma",
//       src: "https://cdn.iconscout.com/icon/free/png-256/free-croma-icon-download-in-svg-png-gif-file-formats--company-logo-industry-brand-pack-logos-icons-10673445.png",
//     },
//   ];

//   return (
//     <div className="bg-white py-3 border-t border-gray-300">
//       {/* Static Text */}
//       <span className="font-bold text-lg mx-4">India’s #1 Online Mall</span>
//       <span className="mx-2">⭐</span>
//       <span className="font-bold text-lg mx-4">500+ Stores:</span>

//       {/* Marquee Only on Logos */}
//       <div className="inline-block w-[300px] overflow-hidden align-middle">
//         <Marquee speed={50} pauseOnHover={true} gradient={false}>
//           {storeLogos.map((store, index) => (
//             <img
//               key={index}
//               src={store.src}
//               alt={store.name}
//               className="h-8 mx-4"
//               style={{ width: "auto" }}
//             />
//           ))}
//         </Marquee>
//       </div>

//       <span className="mx-2">⭐</span>
//       <span className="font-bold text-lg mx-4">2 Crore+ Products & Deals</span>
//     </div>
//   );
// };

// export default Adds;



// import React from "react";
// import Marquee from "react-fast-marquee";

// const Adds = () => {
//   const storeLogos = [
//     { name: "Amazon", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/905px-Amazon_logo.svg.png" },
//     { name: "Flipkart", src: "https://cdn.freebiesupply.com/logos/large/2x/flipkart-logo-png-transparent.png" },
//     { name: "Zepto", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Zepto_Logo.svg/2560px-Zepto_Logo.svg.png" },
//     { name: "Blinkit", src: "https://www.logoshape.com/wp-content/uploads/2024/09/blinkit-logo-vector_logoshape.png" },
//     { name: "Vijay Sales", src: "https://upload.wikimedia.org/wikipedia/commons/1/1b/VijaySale-Logo.png" },
//     { name: "Croma", src: "https://cdn.iconscout.com/icon/free/png-256/free-croma-icon-download-in-svg-png-gif-file-formats--company-logo-industry-brand-pack-logos-icons-10673445.png" },
//   ];

//   return (
//     <div className="bg-white py-3 border-t border-gray-300">
//       <Marquee speed={50} pauseOnHover={true}>
//         <span className="font-bold text-lg mx-4">India’s #1 Online Mall</span>
//         <span className="mx-2">⭐</span>
//         <span className="font-bold text-lg mx-4">500+ Stores:</span>
//         {storeLogos.map((store, index) => (
//           <img
//             key={index}
//             src={store.src}
//             alt={store.name}
//             className="h-8 mx-4"
//           />
//         ))}
//         <span className="mx-2">⭐</span>
//         <span className="font-bold text-lg mx-4">2 Crore+ Products & Deals</span>
//       </Marquee>
//     </div>
//   );
// };

// export default Adds;
