// seedFirestore.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import data from "./db.json"; // adjust path if needed

const firebaseConfig = {
  // same config as in firebase.js
  apiKey: "AIzaSyDGdrbnEVDXn_RUmeJWIHl6UZfeLROd7kk",
  authDomain: "e-commerce-38b17.firebaseapp.com",
  projectId: "e-commerce-38b17",
  storageBucket: "e-commerce-38b17.firebasestorage.app",
  messagingSenderId: "44947102148",
  appId: "1:44947102148:web:8ffc40c72ecbe69625ac91",
  measurementId: "G-ZT5MDGX2S2"
}; 

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadData() {
  for (const category in data) {
    const colRef = collection(db, category); // e.g., "mobiles", "laptops"
    for (const item of data[category]) {
      await addDoc(colRef, item);
      console.log(`Uploaded ${item.name} to ${category}`);
    }
  }
}

uploadData().then(() => {
  console.log("All data uploaded.");
  process.exit();
});
