const fs = require('fs');

// Fix contact-us/index.html
let contactUs = fs.readFileSync('contact-us/index.html', 'utf8');
const contactRegex = /(<a\s[^>]*href="tel:[^>]*9987090631"[^>]*>[\s\S]*?)>(\+?91-?)?7838587500(<\/span>[\s\S]*?<\/a>)/g;
if(contactRegex.test(contactUs)) {
    contactUs = contactUs.replace(contactRegex, '$1>+91-9987090631$3');
    fs.writeFileSync('contact-us/index.html', contactUs);
    console.log('Fixed contact-us/index.html number text.');
}

// Fix index.html
let indexFile = fs.readFileSync('index.html', 'utf8');
let parts = indexFile.split('7838587500');

// As printed previously, matches 3 and 4 should be 9987090631. 
// Match 3 is href="tel:%20+91-7838587500"
// Match 4 is +91-7838587500</span>
if (parts.length > 3) {
    let newIndex = parts[0] + '7838587500' + parts[1] + '7838587500' + parts[2];
    for (let i = 3; i < parts.length; i++) {
        // Change the 3rd and 4th "7838587500" to "9987090631"
        newIndex += '9987090631' + parts[i];
    }
    fs.writeFileSync('index.html', newIndex);
    console.log('Fixed index.html second phone numbers.');
}
