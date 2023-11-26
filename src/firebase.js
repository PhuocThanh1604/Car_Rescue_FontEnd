/* eslint-disable no-undef */
import { initializeApp } from "firebase/app";
import firebase from "firebase/app";
import { getStorage } from "firebase/storage";
import { useDispatch } from 'react-redux';
import { sendNotification } from "./redux/orderSlice";
import { getMessaging,onMessage,getToken } from "firebase/messaging";

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
const messaging = getMessaging(app);
 export function requestPermissions() {
  console.log("Requesting permissions");
  Notification.requestPermission()
  .then((permission) => {
    if (permission === "granted") {
      console.log("Notification Permission granted");
      getToken(messaging, { vapidKey: "BD1_tr1eNqHXMeaQVkcP8sQA0z5hy0Mfr1T35z0maxDBff2C-PvD_0Tx_ymetaUO-l-uLCjmz_aFykqd_kGJy3k" })
      .then((currentToken) => {
        if (currentToken) {
          console.log("Current token for client:", currentToken);
          // localStorage.setItem('deviceToken', currentToken);
          // Perform any other necessary action with the token
        } else {
          console.log("No registration token available. Request permission to generate one.");
        }
      })

    } else {
      console.log("Permission denied");
    }
  })
}
requestPermissions();
export const onMessageListener = (callback) =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
        console.log('Received foreground notification:', payload);
        callback(payload);
    });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}




