import { useEffect, useState } from "react";
import ProductSlider from "./ProductSlider";

const Grocery = () => {
  const [vegetables, setVegetables] = useState([]);
  const [fruits, setFruits] = useState([]);
  const [dairy, setDairy] = useState([]);
  const [dryFruits, setDryFruits] = useState([]);
  const [snacks, setSnacks] = useState([]);
  const [beverages, setBeverages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/db.json");
        const data = await res.json();

        setVegetables(data.vegetables || []);
        setFruits(data.fruits || []);
        setDairy(data.dairy || []);
        setDryFruits(data["dry fruits"] || []);
        setSnacks(data.snacks || []);
        setBeverages(data.beverages || []);
      } catch (error) {
        console.error("Failed to load grocery data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <ProductSlider title="Fresh Vegetables" items={vegetables} category="vegetables" />
      <ProductSlider title="Juicy Fruits" items={fruits} category="fruits" />
      <ProductSlider title="Dairy Products" items={dairy} category="dairy" />
      <ProductSlider title="Dry Fruits" items={dryFruits} category="dry fruits" />
      <ProductSlider title="Tasty Snacks" items={snacks} category="snacks" />
      <ProductSlider title="Refreshing Beverages" items={beverages} category="beverages" />
    </div>
  );
};

export default Grocery;


// import { useEffect, useState } from "react";
// import ProductSlider from "./ProductSlider";

// const Grocery = () => {
//   const [vegetables, setVegetables] = useState([]);
//   const [fruits, setFruits] = useState([]);
//   const [dairy, setDairy] = useState([]);
//   const [dryFruits, setDryFruits] = useState([]);
//   const [snacks, setSnacks] = useState([]);
//   const [beverages, setBeverages] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/vegetables").then(res => res.json()).then(data => setVegetables(data));
//     fetch("http://localhost:5000/fruits").then(res => res.json()).then(data => setFruits(data));
//     fetch("http://localhost:5000/dairy").then(res => res.json()).then(data => setDairy(data));
//     fetch("http://localhost:5000/dry fruits").then(res => res.json()).then(data => setDryFruits(data));
//     fetch("http://localhost:5000/snacks").then(res => res.json()).then(data => setSnacks(data));
//     fetch("http://localhost:5000/beverages").then(res => res.json()).then(data => setBeverages(data));
//   }, []);

//   return (
//     <div className="p-4">
//       <ProductSlider title="Fresh Vegetables" items={vegetables} category="vegetables" />
//       <ProductSlider title="Juicy Fruits" items={fruits} category="fruits" />
//       <ProductSlider title="Dairy Products" items={dairy} category="dairy" />
//       <ProductSlider title="Dry Fruits" items={dryFruits} category="dry fruits" />
//       <ProductSlider title="Tasty Snacks" items={snacks} category="snacks" />
//       <ProductSlider title="Refreshing Beverages" items={beverages} category="beverages" />
//     </div>
//   );
// };

// export default Grocery;
