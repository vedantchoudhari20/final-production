const fs = require('fs');

function fixPhoneNumbers(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the header icon list
    // We want to find cases where +91-7838587500 appears twice in the same list
    const pattern = /<li[^>]*>\s*<a href="tel:\+91-7838587500">[\s\S]*?<\/li>\s*<li[^>]*>\s*<a href="tel:\+91-7838587500">/g;
    
    const fixedContent = content.replace(pattern, (match) => {
        return match.replace(/href="tel:\+91-7838587500"/, 'href="tel:+91-7838587500"').replace(/href="tel:\+91-7838587500"/, 'href="tel:+91-7821031637"');
    });
    
    // Also fix the text content if it's there
    let nextFix = fixedContent.replace(/(\+91-7838587500<\/span>[\s\S]*?)(\+91-7838587500<\/span>)/g, '$1+91-7821031637</span>');

    if (content !== nextFix) {
        fs.writeFileSync(filePath, nextFix);
        console.log(`Fixed phone numbers in ${filePath}`);
    } else {
        console.log(`No changes needed in ${filePath}`);
    }
}

fixPhoneNumbers('index.html');
fixPhoneNumbers('contact-us/index.html');
