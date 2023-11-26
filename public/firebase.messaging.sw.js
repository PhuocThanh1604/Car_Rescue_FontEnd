/* eslint-disable no-undef */


import { initializeApp } from "firebase/app";
import firebase from "firebase/app";
import { getStorage } from "firebase/storage";
import { useDispatch } from 'react-redux';
import { sendNotification } from "../src/redux/orderSlice";
import { getMessaging,onMessage,getToken } from "firebase/messaging";
import { onBackgroundMessage } from "firebase/messaging/sw";
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);
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


messaging.onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
