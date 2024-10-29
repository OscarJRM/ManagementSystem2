import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDXu_MaeaIp5JiAyV3U4t7xm8siVNYxKNs",
    authDomain: "managementsystem-a2f54.firebaseapp.com",
    projectId: "managementsystem-a2f54",
    storageBucket: "managementsystem-a2f54.appspot.com",
    messagingSenderId: "306791144430",
    appId: "1:306791144430:web:98797311d5ead4d3ec4cff"
  };

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export default app;