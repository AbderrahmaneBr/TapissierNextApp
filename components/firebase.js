import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyAS5VfrdQsTvgAOxVSS8bhW2xoV-MOMN_Q",
  authDomain: "tapissier-reve.firebaseapp.com",
  projectId: "tapissier-reve",
  storageBucket: "tapissier-reve.appspot.com",
  messagingSenderId: "587124369015",
  appId: "1:587124369015:web:56e4699f7057b980e94872",
  measurementId: "G-MGV4MNJTL8"
};

// Initialize Firebase
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

export { db, storage, auth };