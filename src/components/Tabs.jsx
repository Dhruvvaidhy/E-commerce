import React, { useState } from "react";
import Electronics from "./Electronics";
import Grocery from "./Grocery";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("Electronics");

  return (
    <div>
      {/* Tabs Navigation */}
      {/* <div className="flex w-full border-b">
        {["Electronics", "Grocery"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-lg font-medium text-center ${
              activeTab === tab ? "text-blue-500 border-b-2 border-blue-500" : "text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div> */}
      <div className="sticky top-[65px] bg-white z-40 border-b flex w-full">
  {["Electronics", "Grocery"].map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`flex-1 py-4 text-lg font-medium text-center ${
        activeTab === tab ? "text-blue-500 border-b-2 border-blue-500" : "text-black"
      }`}
    >
      {tab}
    </button>
  ))}
</div>

      {/* Show Component Based on Active Tab */}
      <div className="p-4">
        {activeTab === "Electronics" && <Electronics />}
        {activeTab === "Grocery" && <Grocery />}
      </div>
    </div>
  );
};

export default Tabs;


// import React, { useState } from 'react';
// import Electronics from './Electronics';


// const Tabs = () => {
//   const [activeTab, setActiveTab] = useState('Electronics');

//   return (
//     <div>
//       <div className="flex w-full border-b">
//         {['Electronics', 'Grocery'].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`flex-1 py-4 text-lg font-medium text-center ${
//               activeTab === tab
//                 ? 'text-blue-500 border-b-2 border-blue-500'
//                 : 'text-black'
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {activeTab === 'Electronics' && <Electronics/>}
//     </div>
//   );
// };

// export default Tabs;



// import React, { useState } from 'react';

// const Tabs = () => {
//   const [activeTab, setActiveTab] = useState('Electronics');

//   return (
//     <div className="flex w-full border-b">
//       {['Electronics', 'Grocery'].map((tab) => (
//         <button
//           key={tab}
//           onClick={() => setActiveTab(tab)}
//           className={`flex-1 py-4 text-lg font-medium text-center ${
//             activeTab === tab
//               ? 'text-blue-500 border-b-2 border-blue-500'
//               : 'text-black'
//           }`}
//         >
//           {tab}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default Tabs;

// import React, { useState } from "react";
// import Products from "./Products";

// const Tabs = () => {
//   const [activeTab, setActiveTab] = useState("electronics");

//   const categories = [
//     { name: "Electronics", value: "electronics" },
//     { name: "Grocery", value: "grocery" },
//   ];

//   const getApiEndpoint = () => {
//     if (activeTab === "electronics") return "/Mobiles";
//     if (activeTab === "grocery") return "/GroceryItems";
//   };

//   return (
//     <div className="container mx-auto p-4">
//       {/* Tabs Navigation */}
//       <div className="flex space-x-8 border-b-2 mb-6">
//         {categories.map((category) => (
//           <button
//             key={category.value}
//             onClick={() => setActiveTab(category.value)}
//             className={`py-2 text-lg font-semibold ${
//               activeTab === category.value
//                 ? "text-blue-600 border-b-4 border-blue-600"
//                 : "text-gray-600"
//             }`}
//           >
//             {category.name}
//           </button>
//         ))}
//       </div>

//       {/* Products Section */}
//       <Products category={getApiEndpoint()} />
//     </div>
//   );
// };

// export default Tabs;


// // Tabs.js
// import React, { useState } from "react";
// import ElectronicsPage from "./ElectronicsPage";


// const Tabs = () => {
//   const [activeTab, setActiveTab] = useState("electronics");

//   return (
//     <div className="p-6">
//       {/* Tabs Navigation */}
//       <div className="flex space-x-8 border-b-2 border-gray-200 mb-6">
//         <button
//           onClick={() => setActiveTab("electronics")}
//           className={`pb-2 text-lg font-semibold ${
//             activeTab === "electronics"
//               ? "border-b-4 border-blue-600 text-blue-600"
//               : "text-gray-600"
//           } transition duration-300`}
//         >
//           Electronics
//         </button>

//         <button
//           onClick={() => setActiveTab("grocery")}
//           className={`pb-2 text-lg font-semibold ${
//             activeTab === "grocery"
//               ? "border-b-4 border-green-600 text-green-600"
//               : "text-gray-600"
//           } transition duration-300`}
//         >
//           Grocery
//         </button>
//       </div>

//       {/* Content */}
//       <div className="mt-4">
//         {activeTab === "electronics" && <ElectronicsPage/>}
//         {activeTab === "grocery" && (
//           <div className="text-center text-gray-500 text-xl">
//             Grocery Section Coming Soon...
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Tabs;


