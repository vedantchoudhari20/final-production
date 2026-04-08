const fs = require('fs');

console.log("Updating deploy/founders/index.html...");
if (fs.existsSync('deploy/founders/index.html')) {
    let content = fs.readFileSync('deploy/founders/index.html', 'utf8');
    content = content.replace(/(Dr\.\s*Priyanka\s*Sharma\s*<br>\s*\(\s*)Founder(\s*\))/g, '$1Co-Founder$2');
    content = content.replace(/>Founder\s+(?:&amp;|&)\s+Passionate\s+Educator</g, '>Co-Founder & Passionate Educator<');
    fs.writeFileSync('deploy/founders/index.html', content);
    console.log("Deploy founders updated.");
}

console.log("Updating contact numbers in deploy...");
const files = ['deploy/index.html', 'deploy/contact-us/index.html'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // For contact-us:
    const contactRegex = /(<a\s[^>]*href="tel:[^>]*9987090631"[^>]*>[\s\S]*?)>(\+?91-?)?7838587500(<\/span>[\s\S]*?<\/a>)/g;
    if(contactRegex.test(content)) {
        content = content.replace(contactRegex, '$1>+91-9987090631$3');
        console.log(`Fixed phone span in ${file}`);
    }

    // For index.html: it had four 7838587500 parts, we replaced 3rd and 4th
    if (file === 'deploy/index.html') {
        let parts = content.split('7838587500');
        if (parts.length > 3) {
            let newIndex = parts[0] + '7838587500' + parts[1] + '7838587500' + parts[2];
            for (let i = 3; i < parts.length; i++) {
                newIndex += '9987090631' + parts[i];
            }
            content = newIndex;
            console.log(`Replaced secondary numbers in index ${file}`);
        }
    }
    
    fs.writeFileSync(file, content);
});

console.log("Fixing deploy gallery...");

const images = [
    'Screenshot 2026-04-07 192029.png',
    'Screenshot 2026-04-07 192218.png',
    'Screenshot 2026-04-07 192246.png',
    'Screenshot 2026-04-07 192310.png',
    'Screenshot 2026-04-07 192331.png',
    'Screenshot 2026-04-07 192704.png',
    'Screenshot 2026-04-07 192839.png'
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let galleryFile = 'deploy/gallery/index.html';
if (fs.existsSync(galleryFile)) {
    let gContent = fs.readFileSync(galleryFile, 'utf8');
    const containerStart = '<div class="elementor-gallery__container">';
    const containerEnd = '</div>';
    
    let startIndex = gContent.indexOf(containerStart);
    let endIndex = gContent.indexOf(containerEnd, startIndex + containerStart.length);
    
    if (startIndex !== -1 && endIndex !== -1) {
        let galleryHtml = gContent.substring(startIndex + containerStart.length, endIndex);
        
        const aTagsRaw = galleryHtml.split(/<\/a>/).filter(tag => tag.trim().length > 0).map(tag => tag + '</a>');
        
        // Exclude specific old ones
        const imagesToRemove = [
            '4ea2dccf-82ea-438c-b712-54df82f6a035-300x135-1.jpg',
            '18485377_789905847845117_3197995626600413391_n-300x300-1.jpg',
            'WhatsApp-Image-2017-04-03-at-9.45.56-PM-300x169-1.jpeg'
        ];
        
        const filteredTags = aTagsRaw.filter(tag => {
            return !imagesToRemove.some(img => tag.includes(img));
        });

        let template = filteredTags.find(tag => tag.includes('e-gallery-item'));
        
        if (template) {
            let newTags = images.map((imgName, index) => {
                let tag = template + '';
                const url = `../../wp-content/uploads/2026/04/${encodeURIComponent(imgName)}`; 
                // Wait, in deploy/gallery/index.html the path relative to it is also ../wp-content since gallery is 1 level deep.
                // Looking at deploy/gallery/index.html, hrefs are like ../wp-content/... let's use ../
                const realUrl = `../wp-content/uploads/2026/04/${encodeURIComponent(imgName)}`;
                
                tag = tag.replace(/url\([^)]+\)/g, `url("${realUrl}")`);
                tag = tag.replace(/href="[^"]+"/g, `href="${realUrl}"`);
                tag = tag.replace(/data-src="[^"]+"/g, `data-src="${realUrl}"`);
                tag = tag.replace(/data-thumbnail="[^"]+"/g, `data-thumbnail="${realUrl}"`);
                tag = tag.replace(/src="[^"]+"/g, `src="${realUrl}"`);
                
                return tag;
            });
            
            const finalTags = filteredTags.concat(newTags);
            const shuffledTags = shuffle(finalTags);

            const newGalleryHtml = '\n\n' + shuffledTags.join('\n') + '\n';
            gContent = gContent.substring(0, startIndex + containerStart.length) + newGalleryHtml + gContent.substring(endIndex);
            
            fs.writeFileSync(galleryFile, gContent);
            console.log('Deploy Gallery updated successfully.');
        }
    }
}
