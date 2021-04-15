import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyCz-DGFv1D47rLm93ZNynsxgWlIsomgtFw",
    authDomain: "calmify-app.firebaseapp.com",
    projectId: "calmify-app",
    storageBucket: "calmify-app.appspot.com",
    messagingSenderId: "475218553825",
    appId: "1:475218553825:web:7605acfeb7885d1cea40a0"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();