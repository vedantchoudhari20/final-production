const fs = require('fs');
const founders = fs.readFileSync('founders/index.html', 'utf8');
const contactUs = fs.readFileSync('contact-us/index.html', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');

console.log('--- FOUNDERS ---');
const matchF = founders.match(/.{0,100}Priyanka Sharma.{0,100}/g);
console.log(matchF ? matchF.join('\n') : 'Not found');

console.log('--- CONTACT US ---');
const matchC = contactUs.match(/.{0,80}7838587500.{0,80}/g);
console.log(matchC ? matchC.join('\n') : 'Not found');

console.log('--- INDEX ---');
const matchI = index.match(/.{0,80}7838587500.{0,80}/g);
console.log(matchI ? matchI.join('\n') : 'Not found');
