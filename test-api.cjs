const https = require('https');
https.get('https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=***', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(data));
});
