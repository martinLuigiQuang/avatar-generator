
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDOpVBLwx3LFsBA4wGknJ5B8FJY7ipVOcE",
  authDomain: "avatar-generator-3558c.firebaseapp.com",
  databaseURL: "https://avatar-generator-3558c-default-rtdb.firebaseio.com",
  projectId: "avatar-generator-3558c",
  storageBucket: "avatar-generator-3558c.appspot.com",
  messagingSenderId: "1091636727332",
  appId: "1:1091636727332:web:2044bf10e69258f485d2b1"
};


const firebase = initializeApp(firebaseConfig);

export default firebase;