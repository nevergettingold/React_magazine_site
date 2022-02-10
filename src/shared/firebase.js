import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBJzoHbRLMAs5vnviFkq5BLg9qITtRtWhM",
  authDomain: "magazine-site-ab9c1.firebaseapp.com",
  projectId: "magazine-site-ab9c1",
  storageBucket: "magazine-site-ab9c1.appspot.com",
  messagingSenderId: "431306577043",
  appId: "1:431306577043:web:84e4ec50b19f3d0a056966",
  measurementId: "G-VY6C91Z3PN",
  databaseURL:
    "https://magazine-site-ab9c1-default-rtdb.asia-southeast1.firebasedatabase.app",
};

firebase.initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();
const realtime = firebase.database();

export { auth, apiKey, firestore, storage, realtime };
