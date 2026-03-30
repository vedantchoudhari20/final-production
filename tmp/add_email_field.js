const fs = require('fs');
const path = require('path');

const targetDir = 'c:\\Users\\Vedant\\Downloads\\thenurturingroots.com\\deploy';
const emailField = '\n        <label>Email ID</label>\n        <input type="email" name="email" required>\n';

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('id="enquiry-modal"')) return false;
    if (content.includes('name="email"')) return false;
    
    const target = '<label>Phone Number</label>';
    if (content.includes(target)) {
        const newContent = content.replace(target, emailField + '        ' + target);
        fs.writeFileSync(filePath, newContent, 'utf8');
        return true;
    }
    return false;
}

function walk(dir) {
    let count = 0;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            count += walk(fullPath);
        } else if (file.endsWith('.html')) {
            if (processFile(fullPath)) count++;
        }
    }
    return count;
}

const total = walk(targetDir);
console.log(`Updated ${total} files.`);
