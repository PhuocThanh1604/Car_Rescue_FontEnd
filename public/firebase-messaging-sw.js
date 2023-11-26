/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
 importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");
// Define CACHE_NAME
const CACHE_VERSION = 'v1';
const CACHE_NAME = `my-site-cache-${CACHE_VERSION}`;
const urlsToCache = [
  '/',
  '/index.html',
  // Add other URLs you want to cache
];
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
 // eslint-disable-next-line no-restricted-globals
 self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
  
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });

   // eslint-disable-next-line no-restricted-globals
self.addEventListener('pushsubscriptionchange', (event) => {
    event.waitUntil(
      // eslint-disable-next-line no-restricted-globals
      self.registration.pushManager.getSubscription()
        .then(async (subscription) => {
          if (subscription) {
            // Send the updated subscription to your server if needed
            const subscriptionData = {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.getKey('p256dh'),
                auth: subscription.getKey('auth'),
              },
            };
  
            // You can send subscriptionData to your server for updates
            // Example using fetch:
            await fetch('/update-subscription', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(subscriptionData),
            });
          }
        })
        .catch((error) => {
          console.error('Error during push subscription change:', error);
        })
    );
  });
  
 // eslint-disable-next-line no-restricted-globals
  self.addEventListener('push', event => {
    const data = event.data.json();
    console.log('Push event received:', data);
    const options = {
      body: data.body,
      icon: 'icons/icon-192x192.png', // Path to your icon
      badge: 'icons/icon-192x192.png'
    };
  
    event.waitUntil(
      // eslint-disable-next-line no-restricted-globals
      self.registration.showNotification(data.title, options)
    );
  });