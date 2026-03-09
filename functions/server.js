const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Initialize firebase-admin
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * SignetAI Subdomain Router
 */
app.use((req, res, next) => {
    const host = req.get('host');
    const domainParts = host.split('.');
    if (domainParts.length > 2 && domainParts[0] !== 'www') {
        // Note: 'bridge.html' must be deployed with the function.
        // We'll need to ensure it's in the 'functions' directory.
        return res.sendFile(path.join(__dirname, 'bridge.html'));
    }
    next();
});

// --- IMPORTANT ARCHITECTURAL NOTE ---
// The following static file serving logic is NOT the standard way to use Firebase.
// Firebase Hosting is designed to serve your static files from the 'dist' (or 'public') directory directly.
// A Cloud Function is for dynamic code. Mixing them like this can lead to pathing issues.
// For now, we are keeping this logic to match your original server, but this may need to be refactored.

// A. Serve 'public' folder at '/public' URL 
app.use('/public', express.static(path.join(__dirname, '../public')));

// B. Serve 'dist' at Root URL 
app.use(express.static(path.join(__dirname, '../dist')));

// --- SPA Fallback ---
// This will catch any request that doesn't match a static file and serve the main app.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Expose the Express app as a Cloud Function named 'api'.
// The name 'api' MUST match the function name in firebase.json's rewrite rule.
exports.api = functions.https.onRequest(app);
