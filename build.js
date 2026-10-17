const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const wwwDir = path.join(rootDir, 'www');

// Clean / create www directory
if (!fs.existsSync(wwwDir)) {
  fs.mkdirSync(wwwDir, { recursive: true });
}

const filesToCopy = [
  'index.html',
  'app.js',
  'auth-client.js',
  'security-vault.js',
  'styles.css',
  'manifest.json',
  'sw.js',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png'
];

filesToCopy.forEach(file => {
  const src = path.join(rootDir, file);
  const dest = path.join(wwwDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${file}`);
  }
});

// Copy logos folder if present
const logosSrc = path.join(rootDir, 'logos');
const logosDest = path.join(wwwDir, 'logos');
if (fs.existsSync(logosSrc)) {
  if (!fs.existsSync(logosDest)) fs.mkdirSync(logosDest, { recursive: true });
  fs.readdirSync(logosSrc).forEach(f => {
    fs.copyFileSync(path.join(logosSrc, f), path.join(logosDest, f));
  });
  console.log('Copied: logos directory');
}

console.log('✅ Web build for Capacitor completed successfully in /www');
