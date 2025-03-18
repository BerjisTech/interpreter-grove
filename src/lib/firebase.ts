
import { initializeApp } from "firebase/app";
import { getDatabase, ref, connectDatabaseEmulator } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLUeVTgF_nJZa0z-qzZRKKpQm0UTl_sjI",
  authDomain: "interpreter-app-demo.firebaseapp.com",
  databaseURL: "https://interpreter-app-demo-default-rtdb.firebaseio.com",
  projectId: "interpreter-app-demo",
  storageBucket: "interpreter-app-demo.appspot.com",
  messagingSenderId: "419123413392",
  appId: "1:419123413392:web:3c493fc9c51189d5e7ee68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Check if we're in development mode to enable emulator
const isDev = import.meta.env.DEV;
if (isDev && window.location.hostname === "localhost") {
  try {
    // Connect to Firebase emulator if running locally
    connectDatabaseEmulator(database, "localhost", 9000);
    console.log("[Firebase] Connected to local emulator");
  } catch (error) {
    console.log("[Firebase] Local emulator not available, using production");
  }
}

// Log access to database paths (for debugging)
const logDatabaseAccess = (path) => {
  console.log(`[Firebase] Accessing database path: ${path}`);
  return ref(database, path);
};

console.log("[Firebase] Initialized Firebase app with config:", {
  projectId: firebaseConfig.projectId,
  databaseURL: firebaseConfig.databaseURL
});

// Check if we're in a development environment and if Firebase is connected
try {
  database.app.automaticDataCollectionEnabled;
  console.log("[Firebase] Database connection established");
} catch (error) {
  console.error("[Firebase] Error connecting to Firebase:", error);
}

export { app, database, logDatabaseAccess };
