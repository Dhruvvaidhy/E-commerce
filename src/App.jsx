import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { loadWishlistForUser } from "./redux/wishlistSlice";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProductSlider from "./components/ProductSlider";
import FullProductList from "./components/FullProductList";
import ProductDetails from "./components/ProductDetails";
import WishlistPage from "./components/WishlistPage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(loadWishlistForUser(user.uid));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mobiles" element={<ProductSlider />} />
        <Route path="/category/:category" element={<FullProductList />} />
        <Route path="/product/:category/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </Router>
  );
}

export default App;


// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./components/Home";
// import Login from "./components/Login";
// import Signup from "./components/Signup";
// import ProductSlider from "./components/ProductSlider";
// import FullProductList from "./components/FullProductList";
// import ProductDetails from "./components/ProductDetails";
// import WishlistPage from "./components/WishlistPage";

// function App() {
//   return (
//     <Router>
//     <Navbar />
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/login" element={<Login/>} />
//       <Route path="/signup" element={<Signup/>} />
//       <Route path="/mobiles" element={<ProductSlider/>} />
//       <Route path="/category/:category" element={<FullProductList/>} />
//       <Route path="/product/:category/:id" element={<ProductDetails />} />
//       <Route path="/wishlist" element={<WishlistPage/>} />
//     </Routes>
//   </Router>    
//   );
// }

// export default App;

