import { initializeApp } from "@react-native-firebase/app";
import { getFirestore } from "@react-native-firebase/firestore";
import { getStorage } from "@react-native-firebase/storage";
import { getDatabase } from "@react-native-firebase/database";
import { getAuth } from "@react-native-firebase/auth";
import { getFunctions } from "@react-native-firebase/functions"


const firebaseConfig = {
    apiKey: process.env.API_KEY || '',
    authDomain: process.env.AUTH_DOMAIN || '',
    projectId: process.env.PROJECT_ID || '',
    storageBucket: process.env.STORAGE_BUCKET || '',
    messagingSenderId: process.env.MESSAGING_SENDER_ID || '',
    appId: process.env.APP_ID || '',
    DatabaseURL: process.env.DATABASE_URL || '',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage();
const database = getDatabase(app);
const functions = getFunctions(app);

export { app, db, auth, storage, database, functions };