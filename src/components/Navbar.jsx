import { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaHeart,
  FaTimes,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import Logo from "../assets/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { clearWishlist } from "../redux/wishlistSlice";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);

  const subCategories = [
    "Mobiles",
    "Headphones",
    "Laptops",
    "Watches",
    "Vegetables",
    "Fruits",
    "Dairy",
    "Dry Fruits",
    "Snacks",
    "Beverages",
  ];

  const apiEndpoints = subCategories.map(
    (cat) => `http://localhost:5000/${cat.toLowerCase()}`
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) dispatch(clearWishlist());
    });
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responses = await Promise.all(apiEndpoints.map((url) => fetch(url)));
        const data = await Promise.all(responses.map((res) => res.json()));
        setSuggestions(data.flat());
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setWishlistOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(clearWishlist());
    setUser(null);
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const getUsername = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  const filteredSuggestions = suggestions.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Toaster position="top-right" />
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50 border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/">
              <img src={Logo} alt="Xprice" className="w-28 h-auto" />
            </Link>
          </div>

          {/* Categories (desktop only) */}
          <div className="hidden md:block relative group">
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-md border border-gray-300 shadow-sm hover:bg-blue-50 transition-all duration-200">
              Categories
              <svg
                className="w-5 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute left-0 top-full mt-2 w-52 bg-white border rounded-md shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-40">
              {subCategories.map((subCat, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-blue-50 text-sm capitalize cursor-pointer"
                  onClick={() => navigate(`/category/${subCat.toLowerCase()}`)}
                >
                  {subCat}
                </div>
              ))}
            </div>
          </div>

          {/* Search Bar (desktop) */}
          <div className="hidden md:block flex-1 px-6 relative max-w-xl w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={handleSearch}
              />
            </div>
            {searchQuery && filteredSuggestions.length > 0 && (
              <ul className="absolute left-0 w-full bg-white border mt-1 max-h-48 overflow-y-auto rounded-md shadow-lg z-10">
                {filteredSuggestions.slice(0, 5).map((product) => (
                  <li
                    key={product.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchQuery("");
                      navigate(`/product/${product.subCategory.toLowerCase()}/${product.id}`);
                    }}
                  >
                    {product.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 ml-auto"
            onClick={() => setMenuOpen(true)}
          >
            <FaBars size={22} />
          </button>

          {/* Wishlist & Auth (Desktop Only) */}
          <div className="hidden md:flex items-center gap-4" ref={dropdownRef}>
            {/* Wishlist Icon */}
            <div className="relative">
              <FaHeart
                size={22}
                className={`${user ? "text-red-500" : "text-gray-300"} cursor-pointer`}
                onClick={() => {
                  if (!user) return toast.error("Please login to view wishlist");
                  setWishlistOpen((prev) => !prev);
                }}
              />
              {user && wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white px-1.5 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </div>

            {/* Wishlist Dropdown */}
            <AnimatePresence>
              {user && wishlistOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-10 w-80 bg-white rounded-md shadow-lg border z-50"
                >
                  <div className="p-4 border-b font-semibold text-gray-800 flex justify-between">
                    Wishlist ({wishlist.length})
                    <Link
                      to="/wishlist"
                      onClick={() => setWishlistOpen(false)}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      View All
                    </Link>
                  </div>
                  {wishlist.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">No products in wishlist.</p>
                  ) : (
                    <ul className="divide-y max-h-96 overflow-y-auto">
                      {wishlist.map((item) => (
                        <li
                          key={item.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                          onClick={() => {
                            setWishlistOpen(false);
                            navigate(`/product/${item.subCategory.toLowerCase()}/${item.id}`);
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-contain rounded border"
                          />
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-green-600 font-semibold">
                              ₹{Math.min(...item.prices.map((p) => p.price))}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Auth Section */}
            {!user ? (
              <>
                <Link to="/login" className="text-sm px-3 py-1 border rounded-md hover:bg-gray-100">
                  Login
                </Link>
                <Link to="/signup" className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            ) : (
              <FaUserCircle
                size={26}
                className="text-gray-700 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
            )}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg border z-50"
                >
                  <div className="p-4 border-b">
                    <p className="font-semibold text-gray-800">{getUsername()}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed top-0 right-0 w-72 h-full bg-white shadow-lg z-[100] px-6 py-4"
          >
            <div className="flex justify-between items-center mb-6">
              <img src={Logo} alt="logo" className="h-10" />
              <FaTimes size={20} onClick={() => setMenuOpen(false)} className="cursor-pointer" />
            </div>

            {subCategories.map((cat, index) => (
              <div
                key={index}
                onClick={() => {
                  navigate(`/category/${cat.toLowerCase()}`);
                  setMenuOpen(false);
                }}
                className="text-sm py-2 border-b hover:text-blue-600 cursor-pointer"
              >
                {cat}
              </div>
            ))}

            {!user ? (
              <div className="mt-6 flex flex-col gap-2">
                <Link to="/login" className="text-sm text-blue-600 hover:underline">
                  Login
                </Link>
                <Link to="/signup" className="text-sm text-blue-600 hover:underline">
                  Sign Up
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="mt-6 text-sm text-red-600 hover:underline"
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;




// import { useState, useEffect, useRef } from "react";
// import {
//   FaSearch,
//   FaUserCircle,
//   FaSignOutAlt,
//   FaBars,
//   FaHeart,
// } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import { auth } from "../firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { motion, AnimatePresence } from "framer-motion";
// import toast, { Toaster } from "react-hot-toast";
// import Logo from "../assets/logo.png";
// import { useSelector, useDispatch } from "react-redux";
// import { clearWishlist } from "../redux/wishlistSlice";

// const Navbar = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [user, setUser] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [wishlistOpen, setWishlistOpen] = useState(false);
//   const dropdownRef = useRef();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const wishlist = useSelector((state) => state.wishlist);

//   const apiEndpoints = [
//     "http://localhost:5000/mobiles",
//     "http://localhost:5000/headphones",
//     "http://localhost:5000/laptops",
//     "http://localhost:5000/watches",
//     "http://localhost:5000/vegetables",
//     "http://localhost:5000/fruits",
//     "http://localhost:5000/dairy",
//     "http://localhost:5000/dry fruits",
//     "http://localhost:5000/snacks",
//     "http://localhost:5000/beverages",
//   ];

//   const subCategories = [
//     "Mobiles",
//     "Headphones",
//     "Laptops",
//     "Watches",
//     "Vegetables",
//     "Fruits",
//     "Dairy",
//     "Dry Fruits",
//     "Snacks",
//     "Beverages",
//   ];

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       if (!currentUser) dispatch(clearWishlist());
//     });
//     return () => unsubscribe();
//   }, [dispatch]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const responses = await Promise.all(apiEndpoints.map((url) => fetch(url)));
//         const data = await Promise.all(responses.map((res) => res.json()));
//         setSuggestions(data.flat());
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//         setWishlistOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const filteredSuggestions = suggestions.filter((product) =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleSearch = () => {
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${searchQuery}`);
//     }
//   };

//   const handleLogout = async () => {
//     await signOut(auth);
//     dispatch(clearWishlist());
//     setUser(null);
//     toast.success("Logged out successfully!");
//     navigate("/login");
//   };

//   const getUsername = () => {
//     if (user?.displayName) return user.displayName;
//     if (user?.email) return user.email.split("@")[0];
//     return "User";
//   };

//   return (
//     <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50 border-b border-gray-200">
//       <Toaster position="top-right" />
//       <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
//         {/* Logo & Menu */}
//         <div className="flex items-center gap-4">
//           <Link to="/">
//             <img src={Logo} alt="Xprice" className="w-28 h-auto" />
//           </Link>
//           <button className="md:hidden text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
//             <FaBars size={20} />
//           </button>
//         </div>

//         {/* Categories */}
//         <div className="relative group hidden md:block">
//           <button className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-md border border-gray-300 shadow-sm hover:bg-blue-50 transition-all duration-200">
//             Categories
//             <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//             </svg>
//           </button>
//           <div className="absolute left-0 top-full mt-2 w-52 bg-white border rounded-md shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-40">
//             {subCategories.map((subCat, index) => (
//               <div
//                 key={index}
//                 className="px-4 py-2 hover:bg-blue-50 text-sm capitalize cursor-pointer"
//                 onClick={() => navigate(`/category/${subCat.toLowerCase()}`)}
//               >
//                 {subCat}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Search */}
//         <div className="hidden md:block flex-1 px-6 relative max-w-xl w-full">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search for products..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-4 pr-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <FaSearch
//               className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
//               onClick={handleSearch}
//             />
//           </div>
//           {searchQuery && filteredSuggestions.length > 0 && (
//             <ul className="absolute left-0 w-full bg-white border mt-1 max-h-48 overflow-y-auto rounded-md shadow-lg z-10">
//               {filteredSuggestions.slice(0, 5).map((product) => (
//                 <li
//                   key={product.id}
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => {
//                     setSearchQuery("");
//                     setSuggestions([]);
//                     navigate(`/product/${product.subCategory.toLowerCase()}/${product.id}`);
//                   }}
//                 >
//                   {product.name}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Right: Wishlist + User */}
//         <div className="relative flex items-center gap-4" ref={dropdownRef}>
//           {/* Wishlist Button */}
//           <div className="relative">
//             <FaHeart
//               size={22}
//               className={`${user ? "text-red-500" : "text-gray-300"} cursor-pointer`}
//               onClick={() => {
//                 if (!user) {
//                   toast.error("Please login to view wishlist");
//                   return;
//                 }
//                 setWishlistOpen((prev) => !prev);
//               }}
//             />
//             {user && wishlist.length > 0 && (
//               <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white px-1.5 rounded-full">
//                 {wishlist.length}
//               </span>
//             )}
//           </div>

//           {/* Wishlist Dropdown */}
//           <AnimatePresence>
//             {user && wishlistOpen && (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 transition={{ duration: 0.2 }}
//                 className="absolute right-0 top-10 w-80 bg-white rounded-md shadow-lg border z-50"
//               >
//                 <div className="p-4 border-b font-semibold text-gray-800 flex justify-between">
//                   Wishlist ({wishlist.length})
//                   <Link
//                     to="/wishlist"
//                     onClick={() => setWishlistOpen(false)}
//                     className="text-sm text-blue-500 hover:underline"
//                   >
//                     View All
//                   </Link>
//                 </div>
//                 {wishlist.length === 0 ? (
//                   <p className="p-4 text-sm text-gray-500">No products in wishlist.</p>
//                 ) : (
//                   <ul className="divide-y max-h-96 overflow-y-auto">
//                     {wishlist.map((item) => (
//                       <li
//                         key={item.id}
//                         className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
//                         onClick={() => {
//                           setWishlistOpen(false);
//                           navigate(`/product/${item.subCategory.toLowerCase()}/${item.id}`);
//                         }}
//                       >
//                         <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded border" />
//                         <div>
//                           <p className="text-sm font-medium">{item.name}</p>
//                           <p className="text-xs text-green-600 font-semibold">
//                             ₹{Math.min(...item.prices.map((p) => p.price))}
//                           </p>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Auth Section */}
//           {!user ? (
//             <div className="hidden md:flex gap-2">
//               <Link to="/login" className="bg-gray-100 text-black px-4 py-2 rounded-md text-sm hover:bg-gray-200">Login</Link>
//               <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">Sign Up</Link>
//             </div>
//           ) : (
//             <div>
//               <FaUserCircle
//                 size={30}
//                 className="text-gray-700 cursor-pointer"
//                 onClick={() => setDropdownOpen((prev) => !prev)}
//               />
//               <AnimatePresence>
//                 {dropdownOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     transition={{ duration: 0.2 }}
//                     className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg border z-50"
//                   >
//                     <div className="p-4 border-b">
//                       <p className="font-semibold text-gray-800">{getUsername()}</p>
//                       <p className="text-sm text-gray-500">{user.email}</p>
//                     </div>
//                     <button
//                       onClick={handleLogout}
//                       className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                     >
//                       <FaSignOutAlt />
//                       Logout
//                     </button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// import { useState, useEffect, useRef } from "react";
// import {
//   FaSearch,
//   FaUserCircle,
//   FaSignOutAlt,
//   FaBars,
//   FaHeart
// } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import { auth } from "../firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { motion, AnimatePresence } from "framer-motion";
// import toast, { Toaster } from "react-hot-toast";
// import Logo from "../assets/logo.png";
// import { useSelector } from "react-redux";

// const Navbar = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [user, setUser] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [wishlistOpen, setWishlistOpen] = useState(false);
//   const dropdownRef = useRef();
//   const navigate = useNavigate();
//   const wishlist = useSelector((state) => state.wishlist);

//   const apiEndpoints = [
//     "http://localhost:5000/mobiles",
//     "http://localhost:5000/headphones",
//     "http://localhost:5000/laptops",
//     "http://localhost:5000/watches",
//     "http://localhost:5000/vegetables",
//     "http://localhost:5000/fruits",
//     "http://localhost:5000/dairy",
//     "http://localhost:5000/dry fruits",
//     "http://localhost:5000/snacks",
//     "http://localhost:5000/beverages",
//   ];

//   const subCategories = [
//     "Mobiles",
//     "Headphones",
//     "Laptops",
//     "Watches",
//     "Vegetables",
//     "Fruits",
//     "Dairy",
//     "Dry Fruits",
//     "Snacks",
//     "Beverages",
//   ];

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const responses = await Promise.all(apiEndpoints.map((url) => fetch(url)));
//         const data = await Promise.all(responses.map((res) => res.json()));
//         setSuggestions(data.flat());
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//         setWishlistOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const filteredSuggestions = suggestions.filter((product) =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleSearch = () => {
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${searchQuery}`);
//     }
//   };

//   const handleLogout = async () => {
//     await signOut(auth);
//     setUser(null);
//     toast.success("Logged out successfully!");
//     navigate("/login");
//   };

//   const getUsername = () => {
//     if (user?.displayName) return user.displayName;
//     if (user?.email) return user.email.split("@")[0];
//     return "User";
//   };

//   return (
//     <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50 border-b border-gray-200">
//       <Toaster position="top-right" />
//       <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
//         {/* Left: Logo + Menu */}
//         <div className="flex items-center gap-4">
//           <Link to="/">
//             <img src={Logo} alt="Xprice" className="w-28 h-auto" />
//           </Link>
//           <button className="md:hidden text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
//             <FaBars size={20} />
//           </button>
//         </div>

//         {/* Middle: Categories */}
//         <div className="relative group hidden md:block">
//           <button className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-md border border-gray-300 shadow-sm hover:bg-blue-50 transition-all duration-200">
//             Categories
//             <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//             </svg>
//           </button>
//           <div className="absolute left-0 top-full mt-2 w-52 bg-white border rounded-md shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-40">
//             {subCategories.map((subCat, index) => (
//               <div
//                 key={index}
//                 className="px-4 py-2 hover:bg-blue-50 text-sm capitalize cursor-pointer"
//                 onClick={() => navigate(`/category/${subCat.toLowerCase()}`)}
//               >
//                 {subCat}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Search */}
//         <div className="hidden md:block flex-1 px-6 relative max-w-xl w-full">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search for products..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-4 pr-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <FaSearch
//               className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
//               onClick={handleSearch}
//             />
//           </div>
//           {searchQuery && filteredSuggestions.length > 0 && (
//             <ul className="absolute left-0 w-full bg-white border mt-1 max-h-48 overflow-y-auto rounded-md shadow-lg z-10">
//               {filteredSuggestions.slice(0, 5).map((product) => (
//                 <li
//                   key={product.id}
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => {
//                     setSearchQuery("");
//                     setSuggestions([]);
//                     navigate(`/product/${product.subCategory.toLowerCase()}/${product.id}`);
//                   }}
//                 >
//                   {product.name}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Right: Wishlist + Auth */}
//         <div className="relative flex items-center gap-4" ref={dropdownRef}>
//           {/* Wishlist */}
//           <div className="relative">
//             <FaHeart
//               size={22}
//               className="text-red-500 cursor-pointer"
//               onClick={() => setWishlistOpen((prev) => !prev)}
//             />
//             {wishlist.length > 0 && (
//               <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white px-1.5 rounded-full">
//                 {wishlist.length}
//               </span>
//             )}
//           </div>

//           {/* Wishlist Dropdown */}
//           <AnimatePresence>
//             {wishlistOpen && (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 transition={{ duration: 0.2 }}
//                 className="absolute right-0 top-10 w-80 bg-white rounded-md shadow-lg border z-50"
//               >
//                 <div className="p-4 border-b font-semibold text-gray-800 flex justify-between">
//                   Wishlist ({wishlist.length})
//                   <Link to="/wishlist" onClick={() => setWishlistOpen(false)} className="text-sm text-blue-500 hover:underline">
//                     View All
//                   </Link>
//                 </div>
//                 {wishlist.length === 0 ? (
//                   <p className="p-4 text-sm text-gray-500">No products in wishlist.</p>
//                 ) : (
//                   <ul className="divide-y max-h-96 overflow-y-auto">
//                     {wishlist.map((item) => (
//                       <li
//                         key={item.id}
//                         className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
//                         onClick={() => {
//                           setWishlistOpen(false);
//                           navigate(`/product/${item.subCategory.toLowerCase()}/${item.id}`);
//                         }}
//                       >
//                         <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded border" />
//                         <div>
//                           <p className="text-sm font-medium">{item.name}</p>
//                           <p className="text-xs text-green-600 font-semibold">
//                             ₹{Math.min(...item.prices.map((p) => p.price))}
//                           </p>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Auth Section */}
//           {!user ? (
//             <div className="hidden md:flex gap-2">
//               <Link to="/login" className="bg-gray-100 text-black px-4 py-2 rounded-md text-sm hover:bg-gray-200">Login</Link>
//               <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">Sign Up</Link>
//             </div>
//           ) : (
//             <div>
//               <FaUserCircle
//                 size={30}
//                 className="text-gray-700 cursor-pointer"
//                 onClick={() => setDropdownOpen((prev) => !prev)}
//               />
//               <AnimatePresence>
//                 {dropdownOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     transition={{ duration: 0.2 }}
//                     className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg border z-50"
//                   >
//                     <div className="p-4 border-b">
//                       <p className="font-semibold text-gray-800">{getUsername()}</p>
//                       <p className="text-sm text-gray-500">{user.email}</p>
//                     </div>
//                     <button
//                       onClick={handleLogout}
//                       className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                     >
//                       <FaSignOutAlt />
//                       Logout
//                     </button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// import { useState, useEffect, useRef } from "react";
// import { FaSearch, FaUserCircle, FaSignOutAlt, FaBars } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import { auth } from "../firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { motion, AnimatePresence } from "framer-motion";
// import toast, { Toaster } from "react-hot-toast";
// import Logo from "../assets/logo.png";

// const Navbar = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [user, setUser] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const dropdownRef = useRef();
//   const navigate = useNavigate();

//   const apiEndpoints = [
//     "http://localhost:5000/mobiles",
//     "http://localhost:5000/headphones",
//     "http://localhost:5000/laptops",
//     "http://localhost:5000/watches",
//     "http://localhost:5000/vegetables",
//     "http://localhost:5000/fruits",
//     "http://localhost:5000/dairy",
//     "http://localhost:5000/dry fruits",
//     "http://localhost:5000/snacks",
//     "http://localhost:5000/beverages",
//   ];

//   const subCategories = [
//     "Mobiles",
//     "Headphones",
//     "Laptops",
//     "Watches",
//     "Vegetables",
//     "Fruits",
//     "Dairy",
//     "Dry Fruits",
//     "Snacks",
//     "Beverages",
//   ];

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const responses = await Promise.all(apiEndpoints.map((url) => fetch(url)));
//         const data = await Promise.all(responses.map((res) => res.json()));
//         setSuggestions(data.flat());
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     if (dropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [dropdownOpen]);

//   const filteredSuggestions = suggestions.filter((product) =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleSearch = () => {
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${searchQuery}`);
//     }
//   };

//   const handleLogout = async () => {
//     await signOut(auth);
//     setUser(null);
//     setDropdownOpen(false);
//     toast.success("Logged out successfully!");
//     navigate("/login");
//   };

//   const getUsername = () => {
//     if (user?.displayName) return user.displayName;
//     if (user?.email) return user.email.split("@")[0];
//     return "User";
//   };

//   return (
//     <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50 border-b border-gray-200">
//       <Toaster position="top-right" reverseOrder={false} />
//       <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
//         {/* Logo & Mobile Menu Toggle */}
//         <div className="flex items-center gap-4">
//           <Link to="/">
//             <img src={Logo} alt="Xprice" className="w-28 h-auto" />
//           </Link>
//           <button
//             className="md:hidden text-gray-600"
//             onClick={() => setMenuOpen(!menuOpen)}
//           >
//             <FaBars size={20} />
//           </button>
//         </div>

//         {/* Category Dropdown (Desktop) */}
//         {/* <div className="relative group hidden md:block">
//           <button className="text-sm font-medium text-gray-700 hover:text-blue-600 px-4 py-2">
//             Categories
//           </button>
//           <div className="absolute left-0 top-full mt-2 w-48 bg-white border rounded-md shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-40">
//             {subCategories.map((subCat, index) => (
//               <div
//                 key={index}
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm capitalize"
//                 onClick={() => navigate(`/category/${subCat.toLowerCase()}`)}
//               >
//                 {subCat}
//               </div>
//             ))}
//           </div>
//         </div> */}
//         <div className="relative group hidden md:block">
//   <button className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-md border border-gray-300 shadow-sm hover:bg-blue-50 transition-all duration-200">
//     Categories
//     <svg
//       className="w-4 h-4 text-gray-500 group-hover:rotate-180 transition-transform duration-200"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       viewBox="0 0 24 24"
//     >
//       <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//     </svg>
//   </button>

//   {/* Dropdown List */}
//   <div className="absolute left-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-40">
//     {subCategories.map((subCat, index) => (
//       <div
//         key={index}
//         className="px-4 py-2 hover:bg-blue-50 text-sm capitalize cursor-pointer transition-all duration-150"
//         onClick={() => navigate(`/category/${subCat.toLowerCase()}`)}
//       >
//         {subCat}
//       </div>
//     ))}
//   </div>
// </div>


//         {/* Search (Desktop) */}
//         <div className="hidden md:block flex-1 px-6 relative max-w-xl w-full">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search for products..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-4 pr-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <FaSearch
//               className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
//               onClick={handleSearch}
//             />
//           </div>
//           {searchQuery && filteredSuggestions.length > 0 && (
//             <ul className="absolute left-0 w-full bg-white border mt-1 max-h-48 overflow-y-auto rounded-md shadow-lg z-10">
//               {filteredSuggestions.slice(0, 5).map((product) => (
//                 <li
//                   key={product.id}
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => {
//                     setSearchQuery("");
//                     setSuggestions([]);
//                     navigate(`/product/${product.subCategory.toLowerCase()}/${product.id}`);
//                   }}
//                 >
//                   {product.name}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Auth Section */}
//         <div className="relative" ref={dropdownRef}>
//           {!user ? (
//             <div className="hidden md:flex gap-2">
//               <Link
//                 to="/login"
//                 className="bg-gray-100 text-black px-4 py-2 rounded-md text-sm hover:bg-gray-200"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/signup"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
//               >
//                 Sign Up
//               </Link>
//             </div>
//           ) : (
//             <div>
//               <FaUserCircle
//                 size={30}
//                 className="text-gray-700 cursor-pointer"
//                 onClick={() => setDropdownOpen((prev) => !prev)}
//               />
//               <AnimatePresence>
//                 {dropdownOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     transition={{ duration: 0.2 }}
//                     className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg border z-50"
//                   >
//                     <div className="p-4 border-b">
//                       <p className="font-semibold text-gray-800">{getUsername()}</p>
//                       <p className="text-sm text-gray-500">{user.email}</p>
//                     </div>
//                     <button
//                       onClick={handleLogout}
//                       className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                     >
//                       <FaSignOutAlt />
//                       Logout
//                     </button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Mobile Dropdown: Categories + Search + Auth */}
//       {menuOpen && (
//         <div className="md:hidden bg-white px-4 pb-4 space-y-3">
//           {/* Category Accordion */}
//           <details className="border rounded-md">
//             <summary className="px-4 py-2 cursor-pointer font-medium text-gray-700">
//               Categories
//             </summary>
//             <div className="px-4 py-2 space-y-1">
//               {subCategories.map((subCat, index) => (
//                 <div
//                   key={index}
//                   className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer"
//                   onClick={() => {
//                     navigate(`/category/${subCat.toLowerCase()}`);
//                     setMenuOpen(false);
//                   }}
//                 >
//                   {subCat}
//                 </div>
//               ))}
//             </div>
//           </details>

//           {/* Search */}
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search for products..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <FaSearch
//               className="absolute top-3 right-4 text-gray-500 cursor-pointer"
//               onClick={handleSearch}
//             />
//           </div>

//           {/* Auth (Mobile) */}
//           {!user && (
//             <div className="flex flex-col gap-2">
//               <Link
//                 to="/login"
//                 className="bg-gray-100 text-black px-4 py-2 rounded-md text-sm text-center"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/signup"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm text-center"
//               >
//                 Sign Up
//               </Link>
//             </div>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

// import { useState, useEffect, useRef } from "react";
// import { FaSearch, FaUserCircle, FaSignOutAlt, FaBars } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import { auth } from "../firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { motion, AnimatePresence } from "framer-motion";
// import toast, { Toaster } from "react-hot-toast";
// import Logo from "../assets/logo.png";

// const Navbar = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [user, setUser] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const dropdownRef = useRef();
//   const navigate = useNavigate();

//   const apiEndpoints = [
//     "http://localhost:5000/mobiles",
//     "http://localhost:5000/headphones",
//     "http://localhost:5000/laptops",
//     "http://localhost:5000/watches",
//     "http://localhost:5000/vegetables",
//     "http://localhost:5000/fruits",
//     "http://localhost:5000/dairy",
//     "http://localhost:5000/dry fruits",
//     "http://localhost:5000/snacks",
//     "http://localhost:5000/beverages",
//   ];

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const responses = await Promise.all(
//           apiEndpoints.map((url) => fetch(url))
//         );
//         const data = await Promise.all(responses.map((res) => res.json()));
//         setSuggestions(data.flat());
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     if (dropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [dropdownOpen]);

//   const filteredSuggestions = suggestions.filter((product) =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleSearch = () => {
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${searchQuery}`);
//     }
//   };

//   const handleLogout = async () => {
//     await signOut(auth);
//     setUser(null);
//     setDropdownOpen(false);
//     toast.success("Logged out successfully!");
//     navigate("/login");
//   };

//   const getUsername = () => {
//     if (user?.displayName) return user.displayName;
//     if (user?.email) return user.email.split("@")[0];
//     return "User";
//   };

//   return (
//     <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50 border-b border-gray-200">
//       <Toaster position="top-right" reverseOrder={false} />

//       <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
//         {/* Logo + Mobile Menu */}
//         <div className="flex items-center gap-3">
//           <Link to="/">
//             <img src={Logo} alt="Xprice" className="w-28 h-auto" />
//           </Link>
//           <button
//             className="md:hidden text-gray-600"
//             onClick={() => setMenuOpen(!menuOpen)}
//           >
//             <FaBars size={20} />
//           </button>
//         </div>

//         {/* Desktop Search */}
//         {/* <div className="hidden md:block flex-1 px-6 relative max-w-xl w-full">
//           <input
//             type="text"
//             placeholder="Search for products..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <FaSearch
//             className="absolute top-3 right-4 text-gray-500 cursor-pointer"
//             onClick={handleSearch}
//           /> */}

//         <div className="hidden md:block flex-1 px-6 relative max-w-xl w-full">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search for products..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-4 pr-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <FaSearch
//               className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
//               onClick={handleSearch}
//             />
//           </div>
//           {searchQuery && filteredSuggestions.length > 0 && (
//             <ul className="absolute left-0 w-full bg-white border mt-1 max-h-48 overflow-y-auto rounded-md shadow-lg z-10">
//               {filteredSuggestions.slice(0, 5).map((product) => (
//                 <li
//                   key={product.id}
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => {
//                     setSearchQuery("");
//                     setSuggestions([]);
//                     navigate(
//                       `/product/${product.subCategory.toLowerCase()}/${
//                         product.id
//                       }`
//                     );
//                   }}
//                 >
//                   {product.name}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* User Auth */}
//         <div className="relative" ref={dropdownRef}>
//           {!user ? (
//             <div className="hidden md:flex gap-2">
//               <Link
//                 to="/login"
//                 className="bg-gray-100 text-black px-4 py-2 rounded-md text-sm hover:bg-gray-200"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/signup"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
//               >
//                 Sign Up
//               </Link>
//             </div>
//           ) : (
//             <div>
//               <FaUserCircle
//                 size={30}
//                 className="text-gray-700 cursor-pointer"
//                 onClick={() => setDropdownOpen((prev) => !prev)}
//               />
//               <AnimatePresence>
//                 {dropdownOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     transition={{ duration: 0.2 }}
//                     className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg border z-50"
//                   >
//                     <div className="p-4 border-b">
//                       <p className="font-semibold text-gray-800">
//                         {getUsername()}
//                       </p>
//                       <p className="text-sm text-gray-500">{user.email}</p>
//                     </div>
//                     <button
//                       onClick={handleLogout}
//                       className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                     >
//                       <FaSignOutAlt />
//                       Logout
//                     </button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Mobile search + auth below navbar */}
//       {menuOpen && (
//         <div className="md:hidden bg-white px-4 pb-4 space-y-3">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search for products..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <FaSearch
//               className="absolute top-3 right-4 text-gray-500 cursor-pointer"
//               onClick={handleSearch}
//             />
//           </div>

//           {!user ? (
//             <div className="flex flex-col gap-2">
//               <Link
//                 to="/login"
//                 className="bg-gray-100 text-black px-4 py-2 rounded-md text-sm text-center"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/signup"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm text-center"
//               >
//                 Sign Up
//               </Link>
//             </div>
//           ) : null}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

// import { useState, useEffect, useRef } from "react";
// import { FaSearch, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import { auth } from "../firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { motion, AnimatePresence } from "framer-motion";
// import toast, { Toaster } from "react-hot-toast";
// import Logo from "../assets/logo.png";

// const Navbar = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [user, setUser] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef();
//   const navigate = useNavigate();

//   const apiEndpoints = [
//     "http://localhost:5000/mobiles",
//     "http://localhost:5000/headphones",
//     "http://localhost:5000/laptops",
//     "http://localhost:5000/watches",
//     "http://localhost:5000/vegetables",
//     "http://localhost:5000/fruits",
//     "http://localhost:5000/dairy",
//     "http://localhost:5000/dry fruits",
//     "http://localhost:5000/snacks",
//     "http://localhost:5000/beverages",
//   ];

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const responses = await Promise.all(apiEndpoints.map(url => fetch(url)));
//         const data = await Promise.all(responses.map(res => res.json()));
//         setSuggestions(data.flat());
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     if (dropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [dropdownOpen]);

//   const filteredSuggestions = suggestions.filter(product =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleSearch = () => {
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${searchQuery}`);
//     }
//   };

//   const handleLogout = async () => {
//     await signOut(auth);
//     setUser(null);
//     setDropdownOpen(false);
//     toast.success("Logged out successfully!");
//     navigate("/login");
//   };

//   const getUsername = () => {
//     if (user?.displayName) return user.displayName;
//     if (user?.email) return user.email.split("@")[0];
//     return "User";
//   };

//   return (
//     <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50 border-b border-gray-200">
//       <Toaster position="top-right" reverseOrder={false} />
//       <div className="max-w-screen-xl mx-auto flex justify-between items-center gap-4 px-6 py-3 flex-wrap">
//         {/* Logo */}
//         <Link to="/" className="flex items-center gap-3">
//           <img src={Logo} alt="Xprice" className="w-32 h-auto" />
//         </Link>

//         {/* Search */}
//         <div className="relative flex-1 max-w-xl w-full mx-auto">
//           <input
//             type="text"
//             placeholder="Search for products..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <FaSearch
//             className="absolute top-3 right-4 text-gray-500 cursor-pointer"
//             onClick={handleSearch}
//           />
//           {searchQuery && filteredSuggestions.length > 0 && (
//             <ul className="absolute left-0 w-full bg-white border mt-1 max-h-48 overflow-y-auto rounded-md shadow-lg z-10">
//               {filteredSuggestions.slice(0, 5).map((product) => (
//                 <li
//                   key={product.id}
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => {
//                     setSearchQuery("");
//                     setSuggestions([]);
//                     navigate(`/product/${product.subCategory.toLowerCase()}/${product.id}`);
//                   }}
//                 >
//                   {product.name}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* User Auth */}
//         <div className="relative" ref={dropdownRef}>
//           {!user ? (
//             <div className="flex gap-2">
//               <Link
//                 to="/login"
//                 className="bg-gray-100 text-black px-4 py-2 rounded-md text-sm hover:bg-gray-200"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/signup"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
//               >
//                 Sign Up
//               </Link>
//             </div>
//           ) : (
//             <div>
//               <FaUserCircle
//                 size={30}
//                 className="text-gray-700 cursor-pointer"
//                 onClick={() => setDropdownOpen(prev => !prev)}
//               />
//               <AnimatePresence>
//                 {dropdownOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     transition={{ duration: 0.2 }}
//                     className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg border z-50"
//                   >
//                     <div className="p-4 border-b">
//                       <p className="font-semibold text-gray-800">{getUsername()}</p>
//                       <p className="text-sm text-gray-500">{user.email}</p>
//                     </div>
//                     <button
//                       onClick={handleLogout}
//                       className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                     >
//                       <FaSignOutAlt />
//                       Logout
//                     </button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// import { useState, useEffect, useRef } from "react";
// import { FaSearch, FaUserCircle } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import { auth } from "../firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { motion, AnimatePresence } from "framer-motion";
// import toast, { Toaster } from "react-hot-toast";
// import Logo from "../assets/logo.png";

// const Navbar = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [user, setUser] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef();
//   const navigate = useNavigate();

//   const apiEndpoints = [
//     "http://localhost:5000/mobiles",
//     "http://localhost:5000/headphones",
//     "http://localhost:5000/laptops",
//     "http://localhost:5000/watches",
//     "http://localhost:5000/vegetables",
//     "http://localhost:5000/fruits",
//     "http://localhost:5000/dairy",
//     "http://localhost:5000/dry fruits",
//     "http://localhost:5000/snacks",
//     "http://localhost:5000/beverages",
//   ];

//   // Detect user login state
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   // Fetch all products
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const responses = await Promise.all(apiEndpoints.map(url => fetch(url)));
//         const data = await Promise.all(responses.map(res => res.json()));
//         setSuggestions(data.flat());
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // Handle outside click to close dropdown
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     if (dropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [dropdownOpen]);

//   const filteredSuggestions = suggestions.filter(product =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleSearch = () => {
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${searchQuery}`);
//     }
//   };

//   const handleLogout = async () => {
//     await signOut(auth);
//     setUser(null);
//     setDropdownOpen(false);
//     toast.success("Logged out successfully!");
//     navigate("/login");
//   };

//   const getUsername = () => {
//     if (user?.displayName) return user.displayName;
//     if (user?.email) return user.email.split("@")[0];
//     return "User";
//   };

//   return (
//     // <nav className="bg-white  shadow-md p-3 px-16 border-b border-gray-200 relative z-50">
//     <nav className="bg-white shadow-md p-3 px-16 border-b border-gray-200 fixed top-0 w-full z-50">
//       <Toaster position="top-right" reverseOrder={false} />
//       <div className="container mx-auto flex justify-between items-center">
//         {/* Logo */}
//         <Link to="/" className="flex items-center gap-4">
//           <img src={Logo} alt="Xprice" className="w-32 h-auto" />
//         </Link>

//         {/* Search */}
//         <div className="relative w-1/2">
//           <input
//             type="text"
//             placeholder="Search for Products..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full px-4 py-2 border rounded-full focus:outline-none"
//           />
//           <FaSearch className="absolute top-3 right-4 text-gray-500 cursor-pointer" onClick={handleSearch} />

//           {searchQuery && filteredSuggestions.length > 0 && (
//   <ul className="absolute left-0 w-full bg-white border mt-1 max-h-48 overflow-y-auto rounded-md shadow-lg z-10">
//     {filteredSuggestions.slice(0, 5).map((product) => (
//       <li
//         key={product.id}
//         className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//         onClick={() => {
//           setSearchQuery(""); // ✅ Clear search input
//           setSuggestions([]); // ✅ Clear suggestions
//           navigate(`/product/${product.subCategory.toLowerCase()}/${product.id}`);
//         }}
//       >
//         {product.name}
//       </li>
//     ))}
//   </ul>
// )}

//         </div>

//         {/* User or Auth Buttons */}
//         <div className="flex items-center gap-4 relative">
//           {!user ? (
//             <>
//               <Link to="/login" className="bg-gray-200 text-black px-4 py-2 rounded-md text-sm font-medium">
//                 Login
//               </Link>
//               <Link to="/signup" className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium">
//                 Sign Up
//               </Link>
//             </>
//           ) : (
//             <div className="relative" ref={dropdownRef}>
//               <FaUserCircle
//                 size={28}
//                 className="text-gray-700 cursor-pointer"
//                 onClick={() => setDropdownOpen((prev) => !prev)}
//               />
//               <AnimatePresence>
//                 {dropdownOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     transition={{ duration: 0.2 }}
//                     className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg z-50 origin-top-right"
//                   >
//                     <div className="px-4 py-2 text-sm text-gray-800 border-b">
//                       <p className="font-medium">{getUsername()}</p>
//                       <p className="text-xs text-gray-500">{user.email}</p>
//                     </div>
//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                     >
//                       Logout
//                     </button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// import { useState, useEffect } from "react";
// import { FaSearch, FaUserCircle } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import { auth } from "../firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";

// const Navbar = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [user, setUser] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const navigate = useNavigate();

//   const apiEndpoints = [
//     "http://localhost:5000/mobiles",
//     "http://localhost:5000/headphones",
//     "http://localhost:5000/laptops",
//     "http://localhost:5000/watches",
//     "http://localhost:5000/vegetables",
//     "http://localhost:5000/fruits",
//     "http://localhost:5000/dairy",
//     "http://localhost:5000/Dry Fruits",
//     "http://localhost:5000/snacks",
//     "http://localhost:5000/beverages",
//   ];

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const responses = await Promise.all(apiEndpoints.map(url => fetch(url)));
//         const data = await Promise.all(responses.map(res => res.json()));
//         const allProducts = data.flat();
//         setSuggestions(allProducts);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const filteredSuggestions = suggestions.filter(product =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleSearch = () => {
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${searchQuery}`);
//     }
//   };

//   const handleLogout = async () => {
//     await signOut(auth);
//     setUser(null);
//     setDropdownOpen(false);
//     navigate("/login");
//   };

//   return (
//     <nav className="bg-white shadow-md p-3 px-16 border-b border-gray-200 relative">
//       <div className="container mx-auto flex justify-between items-center">
//         {/* Logo */}
//         <div className="flex items-center gap-4">
//           <img src="/bigbasket-logo.png" alt="BigBasket" className="w-32 h-auto" />
//         </div>

//         {/* Search Bar */}
//         <div className="relative w-1/2">
//           <input
//             type="text"
//             placeholder="Search for Products..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full px-4 py-2 border rounded-full focus:outline-none"
//           />
//           <FaSearch className="absolute top-3 right-4 text-gray-500 cursor-pointer" onClick={handleSearch} />
//           {searchQuery && filteredSuggestions.length > 0 && (
//             <ul className="absolute left-0 w-full bg-white border mt-1 max-h-48 overflow-y-auto rounded-md shadow-lg z-10">
//               {filteredSuggestions.slice(0, 5).map((product) => (
//                 <li
//                   key={product.id}
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => navigate(`/product/${product.subCategory.toLowerCase()}/${product.id}`)}
//                 >
//                   {product.name}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Right Section */}
//         <div className="flex items-center gap-4">
//           {!user ? (
//             <>
//               <Link to="/login" className="bg-gray-200 text-black px-4 py-2 rounded-md text-sm font-medium">
//                 Login
//               </Link>
//               <Link to="/signup" className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium">
//                 Sign Up
//               </Link>
//             </>
//           ) : (
//             <div className="relative">
//               <FaUserCircle
//                 size={28}
//                 className="text-gray-700 cursor-pointer"
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//               />
//               {dropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
//                   <div className="px-4 py-2 text-sm text-gray-800">{user.email}</div>
//                   <Link
//                     to="/profile"
//                     className="block px-4 py-2 text-sm hover:bg-gray-100"
//                     onClick={() => setDropdownOpen(false)}
//                   >
//                     Profile
//                   </Link>
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// import { useState, useEffect } from "react";
// import { FaSearch } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const navigate = useNavigate();

//   // API Endpoints
//   const apiEndpoints = [
//     "http://localhost:5000/mobiles",
//     "http://localhost:5000/headphones",
//     "http://localhost:5000/laptops",
//     "http://localhost:5000/watches",
//     "http://localhost:5000/vegetables",
//     "http://localhost:5000/fruits",
//     "http://localhost:5000/dairy",
//     "http://localhost:5000/Dry Fruits",
//     "http://localhost:5000/snacks",
//     "http://localhost:5000/beverages",
//   ];

//   // Fetch products from all categories
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const responses = await Promise.all(apiEndpoints.map(url => fetch(url)));
//         const data = await Promise.all(responses.map(res => res.json()));
//         const allProducts = data.flat(); // Combine all categories into a single array
//         setSuggestions(allProducts);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   // Filter Suggestions Based on Input
//   const filteredSuggestions = suggestions.filter(product =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Handle Search Submission
//   const handleSearch = () => {
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${searchQuery}`);
//     }
//   };

//   return (
//     <nav className="bg-white shadow-md p-3 px-16 border-b border-gray-200 relative">
//       <div className="container mx-auto flex justify-between items-center">
//         {/* Left Section: Logo */}
//         <div className="flex items-center gap-4">
//           <img src="/bigbasket-logo.png" alt="BigBasket" className="w-32 h-auto" />
//         </div>

//         {/* Middle Section: Search Bar */}
//         <div className="relative w-1/2">
//           <input
//             type="text"
//             placeholder="Search for Products..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full px-4 py-2 border rounded-full focus:outline-none"
//           />
//           <FaSearch className="absolute top-3 right-4 text-gray-500 cursor-pointer" onClick={handleSearch} />

//           {/* Show Suggestions */}
//           {searchQuery && filteredSuggestions.length > 0 && (
//             <ul className="absolute left-0 w-full bg-white border mt-1 max-h-48 overflow-y-auto rounded-md shadow-lg">
//               {filteredSuggestions.slice(0, 5).map((product) => (
//                 <li
//                   key={product.id}
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                   onClick={() => navigate(`/product/${product.subCategory.toLowerCase()}/${product.id}`)}
//                 >
//                   {product.name}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Right Section: Login & Sign Up */}
//         <div className="flex gap-4">
//           <Link to="/login" className="bg-gray-200 text-black px-4 py-2 rounded-md text-sm font-medium">
//             Login
//           </Link>
//           <Link to="/signup" className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium">
//             Sign Up
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
