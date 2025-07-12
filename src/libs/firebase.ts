// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD3bMOWy7g2mkYeXfLmtTEY7Chp1uHo5Go',
  authDomain: 'dissertation-57393.firebaseapp.com',
  projectId: 'dissertation-57393',
  storageBucket: 'dissertation-57393.firebasestorage.app',
  messagingSenderId: '304973421520',
  appId: '1:304973421520:web:35dea8b00150095281f7d5',
  measurementId: 'G-97X9EHM2RE'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;
