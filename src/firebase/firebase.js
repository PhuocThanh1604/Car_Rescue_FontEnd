
import { initializeApp } from "firebase/app";
import firebase from "firebase/app";
import { getStorage } from "firebase/storage";
import { useDispatch } from 'react-redux';
import { sendNotification } from "../redux/orderSlice";
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
// export function requestPermissions() {
//   if ("Notification" in window && "requestPermission" in window.Notification) {
//     console.log("Requesting permissions");
//     Notification.requestPermission()
//       .then((permission) => {
//         if (permission === "granted") {
//           console.log("Permission granted");

//           getToken(messaging, { vapidKey: "BEFk_eArFD9yGN4dUQ3G2NVqddX2sObRGxkKV1deH96RJawVKIgVMm1-h_jYRC2Vjy-5y3XaE1ZP7xOaXIv-G1Q" })
//             .then((currentToken) => {
//               if (currentToken) {
//                 console.log("Current token for client:", currentToken);
//                 localStorage.setItem('deviceToken', currentToken);
//                 // Perform any other necessary action with the token
//               } else {
//                 console.log("No registration token available. Request permission to generate one.");
//               }
//             })
//             .catch((err) => {
//               console.error("An error occurred while retrieving token:", err);
//             });
//         } else {
//           console.log("Permission denied");
//         }
//       })
//       .catch((error) => {
//         console.error("Permission request failed:", error);
//       });
//   } else {
//     console.log("Notification API not supported");
//   }
// }


// export const getMessagingToken = async () => {
//   let currentToken = "";
//   if (!messaging) return;
//   try {
//     currentToken = await messaging.getToken({
//       vapidKey: process.env.REACT_APP_FIREBASE_FCM_VAPID_KEY,
//     });
//     console.log("FCM registration token", currentToken);
//   } catch (error) {
//     console.log("An error occurred while retrieving token. ", error);
//   }
//   return currentToken;
// };
// export const fetchToken = (setTokenFound) => {
//   return getToken(messaging, {vapidKey: 'BHGPr3pJQSflJAJtTIVXbmcEXlPV_HP29TZQRcqrGCN10gKIa-ojIJmtvM9kQGcsNKsWIA6ezKFG8Bd6LTjaVc0'}).then((currentToken) => {
//     if (currentToken) {
//       console.log('current token for client: ', currentToken);
//       setTokenFound(true);
//       // Track the token -> client mapping, by sending to backend server
//       // show on the UI that permission is secured
//     } else {
//       console.log('No registration token available. Request permission to generate one.');
//       setTokenFound(false);
//       // shows on the UI that permission is required 
//     }
//   }).catch((err) => {
//     console.log('An error occurred while retrieving token. ', err);
//     // catch error while creating client token
//   });
// }

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/firebase-messaging-sw.js')
//     .then((registration) => {
//       console.log("Service Worker registered with scope:", registration.scope);
//     })
//     .catch((error) => {
//       console.error("Service Worker registration failed:", error);
//     });
// }

// const messaging = getMessaging(app)
// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("/firebase-messaging-sw.js") // Update the path accordingly
//     .then((registration) => {
//       console.log("Service Worker registered with scope:", registration.scope);
//     })
//     .catch((error) => {
//       console.error("Service Worker registration failed:", error);
//     });
// }


