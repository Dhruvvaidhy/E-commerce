import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract search query from URL
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/db.json");
        const data = await res.json();

        // Merge all category arrays into one flat array
        const allProducts = Object.values(data).flat();

        // Filter based on search query
        const filteredProducts = allProducts.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );

        setResults(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (query) fetchProducts();
  }, [query]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Search Results for "{query}"</h2>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found for "{query}"</p>
      )}

      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Back to Home
      </button>
    </div>
  );
};

export default SearchResults;









// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import ProductCard from "./ProductCard"

// const SearchResults = () => {
//   const [results, setResults] = useState([]);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Extract search query from URL
//   const searchParams = new URLSearchParams(location.search);
//   const query = searchParams.get("q") || "";

//   // API Endpoints
//   const apiEndpoints = [
//     "http://localhost:5000/mobiles",
//     "http://localhost:5000/headphones",
//     "http://localhost:5000/laptops",
//     "http://localhost:5000/watches",
//     "http://localhost:5000/ac",
//     "http://localhost:5000/vegetables",
//     "http://localhost:5000/fruits",
//     "http://localhost:5000/dairy",
//     "http://localhost:5000/Dry Fruits",
//     "http://localhost:5000/snacks",
//     "http://localhost:5000/beverages",
//   ];

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const responses = await Promise.all(apiEndpoints.map(url => fetch(url)));
//         const data = await Promise.all(responses.map(res => res.json()));
//         const allProducts = data.flat(); // Merge all categories into a single array

//         // Filter products based on search query
//         const filteredProducts = allProducts.filter(product =>
//           product.name.toLowerCase().includes(query.toLowerCase())
//         );

//         setResults(filteredProducts);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
     
//     if (query) fetchProducts();
//   }, [query]);

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">Search Results for "{query}"</h2>

//       {results.length > 0 ? (
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {results.map(product => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500">No products found for "{query}"</p>
//       )}

//       {/* Back to Home Button */}
//       <button
//         onClick={() => navigate("/")}
//         className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md"
//       >
//         Back to Home
//       </button>
//     </div>
//   );
// };

// export default SearchResults;