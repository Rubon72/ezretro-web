import firebase from 'firebase'
import 'firebase/firestore'

const firebaseConfig = {
  // apiKey: "AIzaSyAuDzc_oQmQar8bMvnmPHppskVwTYDyzOs",
  // authDomain: "sinuous-studio-126510.firebaseapp.com",
  // databaseURL: "https://sinuous-studio-126510.firebaseio.com",
  // projectId: "sinuous-studio-126510",
  // storageBucket: "sinuous-studio-126510.appspot.com",
  // messagingSenderId: "23783309051",
  // appId: "1:23783309051:web:ef533ff5034090d2427a5e"
  apiKey: "AIzaSyDq5XDBJmtloG02aIrwkw0QzPaFPwA1k-4",
  authDomain: "ez-retro.firebaseapp.com",
  databaseURL: "https://ez-retro.firebaseio.com",
  projectId: "ez-retro",
  storageBucket: "ez-retro.appspot.com",
  messagingSenderId: "193182095532",
  appId: "1:193182095532:web:c112612dbc3ca2ed266709",
  measurementId: "G-MYWD5BCEMB"
};

export default firebase.initializeApp(firebaseConfig).firestore();