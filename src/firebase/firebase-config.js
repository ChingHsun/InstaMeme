import firebase from "firebase/app";

import "firebase/analytics";
import "firebase/storage";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBmoLa_Jzv5vRH5EMgV6ADNcUVDc7WUy0",
  authDomain: "instameme-7d4c3.firebaseapp.com",
  projectId: "instameme-7d4c3",
  storageBucket: "instameme-7d4c3.appspot.com",
  messagingSenderId: "846065254760",
  appId: "1:846065254760:web:ff14efe5bb2af764fe16dd",
  measurementId: "G-13PLTCLRVL",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}
firebase.analytics();

export default firebase;
