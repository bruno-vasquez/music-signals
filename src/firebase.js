import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBvaoI3aTqQ_aYecZXEBi-PEFUEzyTYJk4",
  authDomain: "music-signals.firebaseapp.com",
  databaseURL: "https://music-signals-default-rtdb.firebaseio.com",  // 
  projectId: "music-signals",
  storageBucket: "music-signals.appspot.com", // ojo: aquí era typo en tu config, debe ser 'appspot.com'
  messagingSenderId: "387874324138",
  appId: "1:387874324138:web:210bc123cf6d75f25d9ad3",
  measurementId: "G-GE7K1CC1SE"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue };
