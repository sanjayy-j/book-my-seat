// firebase.js
import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBgaL866JGdBLvGCX2Fk9dbBhxhERZhBVU",
  authDomain: "movie-booking-system-d41a4.firebaseapp.com",
  projectId: "movie-booking-system-d41a4",
  storageBucket: "movie-booking-system-d41a4.firebasestorage.app",
  messagingSenderId: "951765100357",
  appId: "1:951765100357:web:7fa77e0c14910d2a8fc02c"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Export Services
export const auth = getAuth(app);
export const db = getFirestore(app);
