console.log('=== TEST START ===');

// Test 1: Check if modules load
try {
    console.log('Test 1: Loading firebase-admin...');
    const admin = require('firebase-admin');
    console.log('✅ firebase-admin loaded successfully');
} catch (err) {
    console.log('❌ Error loading firebase-admin:', err.message);
}

// Test 2: Check if service account file exists
try {
    console.log('\nTest 2: Loading service account...');
    const serviceAccount = require('./service-account-key.json');
    console.log('✅ service-account-key.json loaded');
    console.log('   Project ID:', serviceAccount.project_id);
    console.log('   Client Email:', serviceAccount.client_email);
} catch (err) {
    console.log('❌ Error loading service account:', err.message);
}

// Test 3: Try to initialize Firebase
try {
    console.log('\nTest 3: Initializing Firebase...');
    const admin = require('firebase-admin');
    const serviceAccount = require('./service-account-key.json');
    
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    
    const db = admin.firestore();
    console.log('✅ Firebase initialized successfully');
    console.log('✅ Firestore is ready');
} catch (err) {
    console.log('❌ Firebase initialization error:', err.message);
    console.log('Full error:', err);
}

console.log('\n=== TEST COMPLETE ===');