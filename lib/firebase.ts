import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAqWHxph1lIAc1H-Kh-sGVdJ2OWwX19fwQ",
    authDomain: "fwdornach.firebaseapp.com",
    projectId: "fwdornach",
    storageBucket: "fwdornach.firebasestorage.app",
    messagingSenderId: "673184769493",
    appId: "1:673184769493:web:8a1aa3130344cd6b78095c",
    measurementId: "G-R709XVLTVX"
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(firebaseApp);

export default firebaseApp;