const fs = require('fs');
const path = require('path');

// Variations of the old phone number
const oldNumberPatterns = [
    /99870\s*90631/g,
    /\+919987090631/g
];

const newNumber = '7838587500';

function updatePhoneNumber(html) {
    let updatedHtml = html;
    
    // 1. Generic replacement for the display number
    updatedHtml = updatedHtml.replace(/\+91-99870\s*90631/g, '+91-' + newNumber); // Handles header/list variations
    updatedHtml = updatedHtml.replace(/\+91-\s*9987090631/g, '+91-' + newNumber);
    updatedHtml = updatedHtml.replace(/\+91-9987090631/g, '+91-' + newNumber);
    
    // 2. Replacement for tel: links
    updatedHtml = updatedHtml.replace(/tel:\+91-?9987090631/g, 'tel:+91-' + newNumber);
    updatedHtml = updatedHtml.replace(/tel:9987090631/g, 'tel:' + newNumber);

    // 3. Replacement for other occurrences (plain number)
    updatedHtml = updatedHtml.replace(/9987090631/g, newNumber);

    return updatedHtml;
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                processDirectory(filePath);
            }
        } else if (file.endsWith('.html')) {
            const content = fs.readFileSync(filePath, 'utf8');
            const updatedContent = updatePhoneNumber(content);
            if (content !== updatedContent) {
                fs.writeFileSync(filePath, updatedContent, 'utf8');
                console.log(`Updated ${filePath}`);
            }
        }
    });
}

processDirectory('.');
processDirectory('deploy'); // Be explicit though it's covered by root '.' usually
console.log('Done!');
