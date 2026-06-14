const fs = require('fs');
const html = fs.readFileSync('c:/Users/ANSH KEDIA/OneDrive/Desktop/STARTUP/FlavourFall/index.html', 'utf-8');
const scriptMatch = html.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
if (!scriptMatch) { console.log('No script found'); process.exit(1); }
const scriptContent = scriptMatch[1];
fs.writeFileSync('c:/Users/ANSH KEDIA/OneDrive/Desktop/STARTUP/FlavourFall/temp.jsx', scriptContent);
