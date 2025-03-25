import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = Platform.select({
  ios: {
    apiKey: 'AIzaSyCcR8wEv6NgPTaN1yE7VsghOGReHDwGCRM',
    authDomain: 'playtplus-879fd.firebaseapp.com',
    projectId: 'playtplus-879fd',
    storageBucket: 'playtplus-879fd.firebasestorage.app',
    messagingSenderId: '368915910530',
    appId: '1:368915910530:ios:7eeccc56fff5d63438c99b',
  },
  android: {
    apiKey: 'AIzaSyBTbSImZvIBp6WA2y3boH-5uU_GAPu-b9U',
    authDomain: 'playtplus-879fd.firebaseapp.com',
    projectId: 'playtplus-879fd',
    storageBucket: 'playtplus-879fd.firebasestorage.app',
    messagingSenderId: '368915910530',
    appId: '1:368915910530:android:ab32b43ce22ea3f438c99b',
  },
});

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
