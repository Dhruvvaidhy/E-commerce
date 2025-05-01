import { useEffect, useState } from "react";
import ProductSlider from "./ProductSlider";

const Electronics = () => {
  const [mobiles, setMobiles] = useState([]);
  const [headphones, setHeadphones] = useState([]);
  const [laptops, setLaptops] = useState([]);
  const [watches, setWatches] = useState([]);
  const [ac, setAc] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/db.json");
        const data = await res.json();

        setMobiles(data.mobiles || []);
        setHeadphones(data.headphones || []);
        setLaptops(data.laptops || []);
        setWatches(data.watches || []);
        setAc(data.ac || []);
      } catch (error) {
        console.error("Failed to load electronics data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-2">
      <ProductSlider title="Top Mobiles" items={mobiles} category="mobiles" />
      <ProductSlider title="Top Headphones" items={headphones} category="headphones" />
      <ProductSlider title="Top Laptops" items={laptops} category="laptops" />
      <ProductSlider title="Top Watches" items={watches} category="watches" />
      <ProductSlider title="Top ACs" items={ac} category="ac" />
    </div>
  );
};

export default Electronics;



// import { useEffect, useState } from "react";
// import ProductSlider from "./ProductSlider";

// const Electronics = () => {
//   const [mobiles, setMobiles] = useState([]);
//   const [headphones, setHeadphones] = useState([]);
//   const [laptops, setLaptops] = useState([]);
//   const [watches, setWatches] = useState([]);
//   const [ac, setAc] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/mobiles").then(res => res.json()).then(data => setMobiles(data));
//     fetch("http://localhost:5000/headphones").then(res => res.json()).then(data => setHeadphones(data));
//     fetch("http://localhost:5000/laptops").then(res => res.json()).then(data => setLaptops(data)); // Fixed typo: laptopes → laptops
//     fetch("http://localhost:5000/watches").then(res => res.json()).then(data => setWatches(data)); 
//     fetch("http://localhost:5000/ac").then(res => res.json()).then(data => setAc(data)); 
//   }, []);

//   return (
//     <div className="p-2">
//       <ProductSlider title="Top Mobiles" items={mobiles} category="mobiles" />
//       <ProductSlider title="Top Headphones" items={headphones} category="headphones" />
//       <ProductSlider title="Top Laptops" items={laptops} category="laptops" />
//       <ProductSlider title="Top Watches" items={watches} category="watches" />
//       <ProductSlider title="Top ACs" items={ac} category="ac" />
//     </div>
//   );
// };

// export default Electronics;



// import React, { useEffect, useState } from "react";
// import ProductSlider from "./ProductSlider";

// const Electronics = () => {
//   const [products, setProducts] = useState({
//     Mobiles: [],
//     Headphones: [],
//   });

//   useEffect(() => {
//     // Fetching both mobiles and headphones data
//     Promise.all([
//       fetch("http://localhost:5000/Mobiles").then((res) => res.json()),
//       fetch("http://localhost:5000/headphones").then((res) => res.json()),
//     ]).then(([mobilesData, headphonesData]) => {
//       setProducts({
//         Mobiles: mobilesData.slice(0, 10),
//         Headphones: headphonesData.slice(0, 10),
//       });
//     });
//   }, []);

//   return (
//     <div className="p-6">
//       {/* Mobiles Slider */}
//       <ProductSlider title="Top 50 Mobiles" items={products.Mobiles} />

//       {/* Headphones Slider */}
//       <ProductSlider title="Top Headphones" items={products.Headphones} />
//     </div>
//   );
// };

// export default Electronics;
