/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
 importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

 // Initialize the Firebase app in the service worker by passing the generated config
 const firebaseConfig = {
    apiKey: "AIzaSyDwwpps4RBQJUWK17ivjFZTSl5Gx5zP7s8",
    authDomain: "car-rescue-399511.firebaseapp.com",
    projectId: "car-rescue-399511",
    storageBucket: "car-rescue-399511.appspot.com",
    messagingSenderId: "387575068560",
    appId: "1:387575068560:web:52c7c2e4f8684b230a2515",
    measurementId: "G-SYYVJXV5HQ"
 };

 firebase.initializeApp(firebaseConfig);

 // Retrieve firebase messaging
 const messaging = firebase.messaging();

 messaging.onBackgroundMessage(function(payload) {
   console.log("Received background message ", payload);

   const notificationTitle = payload.notification.title;
   const notificationOptions = {
     body: payload.notification.body,
   };

   // eslint-disable-next-line no-restricted-globals
   self.registration.showNotification(notificationTitle, notificationOptions);
 });