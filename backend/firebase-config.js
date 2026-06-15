const admin = require('firebase-admin');

// Load your Firebase service account key
const serviceAccount = require('./service-account-key.json');

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Get Firestore database
const db = admin.firestore();

console.log('✅ Firebase Connected Successfully!');
console.log(`📁 Project: ${serviceAccount.project_id}`);

module.exports = { db };