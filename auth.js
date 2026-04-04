import { auth }
from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
}
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
// SIGNUP
export async function signup(email, password) {
  try {
    // Show loading message
    document.getElementById("loading-msg").textContent = "Processing...";
    const userCred =
    await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
    console.log("Signup success");
    // Clear messages
    document.getElementById("loading-msg").textContent = "";
    document.getElementById("error-msg").textContent = "";
  }
  catch (error) {
    // Clear loading
    document.getElementById("loading-msg").textContent = "";
    // Show error
    document.getElementById("error-msg").textContent = error.message;
  }
}
// LOGIN
export async function login(email, password) {
  try {
    // Show loading
    document.getElementById("loading-msg").textContent = "Processing...";
    const userCred =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    console.log("Login success");
    // Clear messages
    document.getElementById("loading-msg").textContent = "";
    document.getElementById("error-msg").textContent = "";
  }
  catch (error) {
    document.getElementById("loading-msg").textContent = "";
    document.getElementById("error-msg").textContent = error.message;
  }
}
// LOGOUT
export async function logout() {
  await signOut(auth);
}
// GET CURRENT USER
export function getCurrentUser() {
  return auth.currentUser;
}
