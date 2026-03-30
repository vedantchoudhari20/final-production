const fs = require('fs');
const indexFile = 'c:/Users/Vedant/Downloads/thenurturingroots.com/deploy/blog/index.html';

try {
    let content = fs.readFileSync(indexFile, 'utf8');

    // We want to find the section AFTER the dynamic highlights
    const dynamicSectionEnd = content.indexOf('<!-- FALLBACK CONTENT -->');
    if (dynamicSectionEnd === -1) {
        console.error('Could not find marker for dynamic section');
        process.exit(1);
    }

    const head = content.substring(0, dynamicSectionEnd);
    let body = content.substring(dynamicSectionEnd);

    // Replace all hrefs in the body with javascript:void(0)
    // We only target lines that look like a href link for posts
    // Specifically looking for the ones in the bottom list
    body = body.replace(/href="[^"]*(?:index\.html|index\.php|#|)[^"]*"/g, (match) => {
        // If it's a contact or about link, skip it if possible
        // But the user said 'other blogs', so we target article links
        if (match.includes('../') && !match.includes('images/')) {
            return 'href="javascript:void(0)"';
        }
        return match;
    });

    fs.writeFileSync(indexFile, head + body, 'utf8');
    console.log('Successfully made bottom blogs static');

} catch (err) {
    console.error('Failed to update blog index:', err);
}
