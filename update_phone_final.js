const fs = require('fs');
const path = 'contact-us/index.html';
let content = fs.readFileSync(path, 'utf8');

// The items were:
// Item 1 (lines 4535-4545): Restore to tel:+917838587500 / +91 78385 87500
// Item 2 (lines 4548-4558): Update to tel:+91-9987090631 / +91-9987090631

// I'll look for the specific block
const topListBlockRegex = /<ul class="elementor-icon-list-items">([\s\S]*?)<\/ul>/m;
const match = content.match(topListBlockRegex);

if (match) {
    let listContent = match[1];
    const items = listContent.split(/<li class="elementor-icon-list-item">/);
    // items[0] is empty or whitespace
    // items[1] is the first <li> content
    // items[2] is the second <li> content

    if (items.length >= 3) {
        // Update first item
        items[1] = items[1].replace(/href="tel:.*?"/, 'href="tel:+917838587500"');
        items[1] = items[1].replace(/>.*?<\/span>/, '>+91 78385 87500</span>');

        // Update second item
        items[2] = items[2].replace(/href="tel:.*?"/, 'href="tel:+91-9987090631"');
        items[2] = items[2].replace(/>.*?<\/span>/, '>+91-9987090631</span>');

        const newListContent = items.join('<li class="elementor-icon-list-item">');
        content = content.replace(listContent, newListContent);
    }
}

// Restore branch numbers if they were changed
// Nerul West (4890-4903)
content = content.replace(/Nerul West[\s\S]*?<a href="tel:.*?">[\s\S]*?>.*?<\/span>/, (m) => {
    return m.replace(/href="tel:.*?"/, 'href="tel:+91-7838587500"').replace(/>.*?<\/span>/, '>+91-7838587500</span>');
});

fs.writeFileSync(path, content);
console.log('Final phone update complete.');
