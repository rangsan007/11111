import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD38Y2xVyFJtLG6IWWyz3vOgI1O4g3oMbk",
  authDomain: "dinosaur-3607f.firebaseapp.com",
  projectId: "dinosaur-3607f",
  storageBucket: "dinosaur-3607f.appspot.com",
  messagingSenderId: "558478995481",
  appId: "1:558478995481:web:489b7a027b7401b2efba88",
  measurementId: "G-SDWJFF3YQY"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export { firebase };
