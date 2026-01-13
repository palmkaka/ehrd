import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCoLXp9C8QeOsP1t_ztoFqa9Q63yAh_zos',
  authDomain: 'dashboard-b2b-fc6ec.firebaseapp.com',
  projectId: 'dashboard-b2b-fc6ec',
  storageBucket: 'dashboard-b2b-fc6ec.firebasestorage.app',
  messagingSenderId: '213794265542',
  appId: '1:213794265542:web:d123e69842aa0ac1a6bac7',
  databaseURL: 'https://dashboard-b2b-fc6ec.firebaseio.com',
};

// Initialize Firebase (singleton pattern)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

export default app;
