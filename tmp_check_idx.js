const fs = require('fs');
let index = fs.readFileSync('index.html', 'utf8');

// The main page (index.html) probably has the contact info. Let's find 7838587500.
let parts = index.split('7838587500');
console.log('Occurrences of 7838587500 in index.html:', parts.length - 1);
if (parts.length > 2) {
    // There are multiple. The user wants the second one updated, "keep both diffrent phone numbers in contact us sction main page".
    // We can just dump 100 chars around each occurrence.
    for(let i = 1; i < parts.length; i++) {
        let prev = parts[i-1].slice(-100);
        let next = parts[i].slice(0, 50);
        console.log(`-- Match ${i}:`);
        console.log(prev + '7838587500' + next);
    }
}
