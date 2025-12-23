import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCagZ1Cp8ylQOwHGINdce-1Tf5VDwlkszM",
  authDomain: "ezbioler-ru.firebaseapp.com",
  databaseURL: "https://ezbioler-ru-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ezbioler-ru",
  storageBucket: "ezbioler-ru.firebasestorage.app",
  messagingSenderId: "615257263042",
  appId: "1:615257263042:web:c11b626dfac771176c645b"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
