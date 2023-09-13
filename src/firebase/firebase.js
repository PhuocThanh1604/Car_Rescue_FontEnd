// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBxp3h03ozQGAdC1ZxAxefGIIwo0i8ViRo",
    authDomain: "book-store-2hand.firebaseapp.com",
    projectId: "book-store-2hand",
    storageBucket: "book-store-2hand.appspot.com",
    messagingSenderId: "206884235195",
    appId: "1:206884235195:web:b452a49e9f089a7110c69e",
    measurementId: "G-4PB7QTRHJ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 // Lưu ý thêm đối số app vào getAuth()

 export const auth = getAuth(app);

