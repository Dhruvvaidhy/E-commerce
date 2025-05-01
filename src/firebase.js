import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 👉 Add this line

const firebaseConfig = {
  apiKey: "AIzaSyDGdrbnEVDXn_RUmeJWIHl6UZfeLROd7kk",
  authDomain: "e-commerce-38b17.firebaseapp.com",
  projectId: "e-commerce-38b17",
  storageBucket: "e-commerce-38b17.firebasestorage.app",
  messagingSenderId: "44947102148",
  appId: "1:44947102148:web:8ffc40c72ecbe69625ac91",
  measurementId: "G-ZT5MDGX2S2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // 👉 Add this line

export { auth, db }; // 👉 Export db for Firestore access



// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";


// const firebaseConfig = {
//   apiKey: "AIzaSyDGdrbnEVDXn_RUmeJWIHl6UZfeLROd7kk",
//   authDomain: "e-commerce-38b17.firebaseapp.com",
//   projectId: "e-commerce-38b17",
//   storageBucket: "e-commerce-38b17.firebasestorage.app",
//   messagingSenderId: "44947102148",
//   appId: "1:44947102148:web:8ffc40c72ecbe69625ac91",
//   measurementId: "G-ZT5MDGX2S2"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// export { auth };
