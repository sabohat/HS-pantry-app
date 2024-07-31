// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_DOMAIN,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// const firebaseConfig = {
//     apiKey: "AIzaSyCf_ZlMD82kPKcAZVltE29tABRa4ovH94Y",
//     authDomain: "hspantryapp-e77c7.firebaseapp.com",
//     projectId: "hspantryapp-e77c7",
//     storageBucket: "hspantryapp-e77c7.appspot.com",
//     messagingSenderId: "826996916945",
//     appId: "1:826996916945:web:6099031c8e53609fbc7bf0"
// };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {
    firestore
}