// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import firebase from 'firebase'


const firebaseConfig = {
    apiKey: "AIzaSyD8DZTTHhwJz2sgzq2xkaq6p7w9A-ri_vI",
    authDomain: "cloud-computing-project-9321a.firebaseapp.com",
    projectId: "cloud-computing-project-9321a",
    storageBucket: "cloud-computing-project-9321a.appspot.com",
    messagingSenderId: "421905201130",
    appId: "1:421905201130:web:3044db0cb7f9cef037a493",
    measurementId: "G-Q5VX3TJY6B"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore();
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export {db, auth, provider}