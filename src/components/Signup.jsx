import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Import Firebase auth


const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/login"); // Redirect to login after successful signup
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex pt-[65px] min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md" 
              placeholder="Enter your username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />  
          </div>
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
          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded-md" 
              placeholder="Confirm your password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;




// import { Link } from "react-router-dom";

// const Signup = () => {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-96">
//         <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
//         <form>
//           <div className="mb-4">
//             <label className="block text-gray-700">Username</label>
//             <input type="text" className="w-full p-2 border rounded-md" placeholder="Enter your username" />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Email</label>
//             <input type="email" className="w-full p-2 border rounded-md" placeholder="Enter your email" />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Password</label>
//             <input type="password" className="w-full p-2 border rounded-md" placeholder="Enter your password" />
//           </div>
//           <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
//             Sign Up
//           </button>
//         </form>
//         <p className="mt-4 text-center text-gray-600">
//           Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;
