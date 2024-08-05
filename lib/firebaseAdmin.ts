// lib/firebaseAdmin.js
import admin from 'firebase-admin';

const serviceAccount = require('../google-service-key/google-service-key.json'); // Replace with the path to your service account key

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://your-database-name.firebaseio.com' // Replace with your Firestore database URL
  });
}

const db = admin.firestore();
export { db };