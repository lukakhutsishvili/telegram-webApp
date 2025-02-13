// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0d9WXJsVa3BdIoEGd0aHCy_ZpaEvlHQE",
  authDomain: "testbot-2fa77.firebaseapp.com",
  projectId: "testbot-2fa77",
  storageBucket: "testbot-2fa77.firebasestorage.app",
  messagingSenderId: "588927485313",
  appId: "1:588927485313:web:852bfc8960f8f9b0cdd480",
  measurementId: "G-T8JXGP8503"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);