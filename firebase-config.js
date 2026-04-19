/* ============================================
   CareerLens AI – Firebase Configuration
   ============================================
   
   SETUP INSTRUCTIONS:
   1. Go to https://console.firebase.google.com
   2. Create a new project (or use existing)
   3. Enable Authentication → Email/Password & Google
   4. Create Firestore Database (Start in test mode)
   5. Enable Storage (optional, for resume uploads)
   6. Go to Project Settings → General → Your apps → Web app
   7. Copy your Firebase config and replace the values below
*/

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, 
         createUserWithEmailAndPassword, signOut, updateProfile,
         GoogleAuthProvider, signInWithPopup } 
         from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, serverTimestamp, setDoc } 
         from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } 
         from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';

// ⚠️ REPLACE WITH YOUR FIREBASE CONFIG ⚠️
const firebaseConfig = {
    apiKey: "AIzaSyCkmyy0jVz2h3PqxfWNiWr5hlSVpKJSJRY",
    authDomain: "kira-ai-f988f.firebaseapp.com",
    projectId: "kira-ai-f988f",
    storageBucket: "kira-ai-f988f.firebasestorage.app",
    messagingSenderId: "706488241876",
    appId: "1:706488241876:web:cc5a415bc71f23527a3541"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Export everything needed
export { 
    auth, db, storage, googleProvider,
    onAuthStateChanged, signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, signOut, updateProfile,
    signInWithPopup,
    collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, serverTimestamp, setDoc,
    ref, uploadBytes, getDownloadURL
};
