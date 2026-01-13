import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDmaJxTJi6jB32hIzzLdXe4n4CwAfTqVK0',
  authDomain: 'lark-app-e36e8.firebaseapp.com',
  projectId: 'lark-app-e36e8',
  storageBucket: 'lark-app-e36e8.firebasestorage.app',
  messagingSenderId: '407013929066',
  appId: '1:407013929066:web:93de262b333cabc82c1a13',
  databaseURL: 'https://lark-app-e36e8.firebaseio.com',
};

// Initialize Firebase (singleton pattern)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

export default app;
