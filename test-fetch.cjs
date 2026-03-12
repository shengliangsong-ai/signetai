fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=<YOUR_API_KEY>', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ contents: [{ parts: [{ text: 'hello' }] }] })
})
.then(res => res.text())
.then(text => console.log('RESPONSE:', text))
.catch(err => console.error('ERROR:', err));
