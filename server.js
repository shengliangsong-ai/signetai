const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

/**
 * SignetAI Subdomain Router
 */
app.use((req, res, next) => {
    const host = req.get('host');
    const domainParts = host.split('.');
    if (domainParts.length > 2 && domainParts[0] !== 'www') {
        return res.sendFile(path.join(__dirname, 'bridge.html'));
    }
    next();
});

// --- 1. DUAL STATIC MOUNT STRATEGY ---

// A. Serve 'public' folder at '/public' URL 
// (Fixes: https://signetai.io/public/signed_signetai-solar-system.svg)
app.use('/public', express.static(path.join(__dirname, 'public')));

// B. Serve 'public' & 'dist' at Root URL 
// (Standard: https://signetai.io/signed_signetai-solar-system.svg)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));


// --- 2. ROBUST FALLBACK FOR CRITICAL ASSETS ---
// Even if static middleware fails (e.g. file is in root but requested via /public),
// these handlers manually hunt for the file in all possible locations.

function serveWithFallback(res, filename, contentType) {
    const locations = [
        path.join(__dirname, 'public', filename), // 1. Source Public
        path.join(__dirname, 'dist', filename),   // 2. Build Output
        path.join(__dirname, filename)            // 3. Project Root
    ];

    // Find the first location that actually exists on disk
    const validPath = locations.find(loc => fs.existsSync(loc));

    if (validPath) {
        res.type(contentType);
        res.sendFile(validPath);
    } else {
        console.error(`Asset Not Found: ${filename}`);
        res.status(404).send('Asset not found');
    }
}

// Critical Signed Assets (Allow access via root or /public/*)
const criticalAssets = [
    'signed_signetai-solar-system.svg',
    'signetai-solar-system.svg'
];

criticalAssets.forEach(file => {
    // Handle root access
    app.get(`/${file}`, (req, res) => serveWithFallback(res, file, 'image/svg+xml'));
    // Handle /public/ access manually as backup
    app.get(`/public/${file}`, (req, res) => serveWithFallback(res, file, 'image/svg+xml'));
});


// --- 3. SPA FALLBACK ---
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`SignetAI Gateway running on port ${PORT}`);
});