import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase" // Import Firebase auth

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // Redirect to a dashboard or home page after successful login
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex pt-[65px] min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded-md" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded-md" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="text-right mb-4">
            <a href="#" className="text-blue-500 text-sm">Forgot Password?</a>
          </div>
          <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account? <Link to="/signup" className="text-blue-500">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;



// import { Link } from "react-router-dom";

// const Login = () => {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-96">
//         <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
//         <form>
//           <div className="mb-4">
//             <label className="block text-gray-700">Email</label>
//             <input type="email" className="w-full p-2 border rounded-md" placeholder="Enter your email" />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Password</label>
//             <input type="password" className="w-full p-2 border rounded-md" placeholder="Enter your password" />
//           </div>
//           <div className="text-right mb-4">
//             <a href="#" className="text-blue-500 text-sm">Forgot Password?</a>
//           </div>
//           <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
//             Sign In
//           </button>
//         </form>
//         <p className="mt-4 text-center text-gray-600">
//           Don't have an account? <Link to="/signup" className="text-blue-500">Sign Up</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
