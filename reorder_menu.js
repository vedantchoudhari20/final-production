const fs = require('fs');
const path = require('path');

// Reordering only the 4 list items inside "Preschool Program"
const targetOrderPatterns = [
    /Little\s+Explorers/i,
    /Curious\s+Cubs/i,
    /Rising\s+Star\s+1/i,
    /Rising\s+Star\s+2/i
];

function reorderPreschoolMenu(html) {
    // 1. Identify the "Preschool Program" section. 
    // It's usually inside an <a> with text "Preschool Program" followed by a <ul>
    
    // Pattern to find "Preschool Program" followed by its sub-menu
    const preschoolProgramAreaPattern = /(<a[^>]*class="[^"]*elementor-sub-item[^"]*"[^>]*>\s*Preschool\s+Program[\s\S]*?<\/a>\s*<ul[^>]*class="sub-menu elementor-nav-menu--dropdown"[^>]*>)([\s\S]*?)(<\/ul>)/gi;

    return html.replace(preschoolProgramAreaPattern, (match, prefix, content, suffix) => {
        // Pattern for an <li> item in the menu
        const liPattern = /<li[^>]*class="[^"]*menu-item[^"]*"[^>]*>[\s\S]*?<\/li>/gi;
        const items = content.match(liPattern);
        
        if (!items || items.length < 2) return match;

        // Verify it contains our target items exclusively or almost
        const matchesAny = items.filter(item => targetOrderPatterns.some(p => p.test(item)));
        if (matchesAny.length < 2) return match;

        // Reorder the items we found
        const reorderedItems = [];
        targetOrderPatterns.forEach(pattern => {
            const index = items.findIndex(item => pattern.test(item));
            if (index !== -1) {
                reorderedItems.push(items[index]);
            }
        });

        // Add any other items that might be in this specific <ul>
        items.forEach(item => {
            if (!targetOrderPatterns.some(pattern => pattern.test(item))) {
                reorderedItems.push(item);
            }
        });

        // Reconstruct with preserved indentation from items
        return prefix + '\n' + reorderedItems.join('\n') + '\n' + suffix;
    });
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
            const updatedContent = reorderPreschoolMenu(content);
            if (content !== updatedContent) {
                fs.writeFileSync(filePath, updatedContent, 'utf8');
                console.log(`Updated ${filePath}`);
            }
        }
    });
}

processDirectory('.');
console.log('Done!');
