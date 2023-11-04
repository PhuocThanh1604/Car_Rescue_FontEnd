import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken } from "firebase/messaging";
import { useDispatch } from 'react-redux';
import { sendNotification } from "../redux/orderSlice";

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

export const storage = getStorage(app);
const messaging = getMessaging(app)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/firebase-messaging-sw.js") // Update the path accordingly
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

function requestPermissions() {
  if ("Notification" in window && "requestPermission" in window.Notification) {
    console.log("Requesting permissions");
    Notification.requestPermission()
      .then((permission) => {
        if (permission === "granted") {
          console.log("Permission granted");

          getToken(messaging, { vapidKey: "BEFk_eArFD9yGN4dUQ3G2NVqddX2sObRGxkKV1deH96RJawVKIgVMm1-h_jYRC2Vjy-5y3XaE1ZP7xOaXIv-G1Q" })
            .then((currentToken) => {
              if (currentToken) {
                console.log("Current token for client:", currentToken);
                localStorage.setItem('deviceToken', currentToken);
                // Perform any other necessary action with the token
              } else {
                console.log("No registration token available. Request permission to generate one.");
              }
            })
            .catch((err) => {
              console.error("An error occurred while retrieving token:", err);
            });
        } else {
          console.log("Permission denied");
        }
      })
      .catch((error) => {
        console.error("Permission request failed:", error);
      });
  } else {
    console.log("Notification API not supported");
  }
}

requestPermissions();

