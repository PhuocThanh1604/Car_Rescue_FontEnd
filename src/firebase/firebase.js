import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDwwpps4RBQJUWK17ivjFZTSl5Gx5zP7s8",
  authDomain: "car-rescue-399511.firebaseapp.com",
  projectId: "car-rescue-399511",
  storageBucket: "car-rescue-399511.appspot.com",
  messagingSenderId: "387575068560",
  appId: "1:387575068560:web:52c7c2e4f8684b230a2515",
  measurementId: "G-SYYVJXV5HQ"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)