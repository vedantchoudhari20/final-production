const fs = require('fs');

const images = [
    'Screenshot 2026-04-07 192029.png',
    'Screenshot 2026-04-07 192218.png',
    'Screenshot 2026-04-07 192246.png',
    'Screenshot 2026-04-07 192310.png',
    'Screenshot 2026-04-07 192331.png',
    'Screenshot 2026-04-07 192704.png',
    'Screenshot 2026-04-07 192839.png'
];

function updateGallery(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`File ${filePath} not found.`);
        return;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    const containerStart = '<div class="elementor-gallery__container">';
    const containerEnd = '</div>';
    
    let startIndex = content.indexOf(containerStart);
    let endIndex = content.indexOf(containerEnd, startIndex + containerStart.length);
    
    if (startIndex === -1 || endIndex === -1) {
        console.log('Gallery container not found.');
        return;
    }

    let galleryHtml = content.substring(startIndex + containerStart.length, endIndex);
    const aTags = galleryHtml.split(/<\/a>/).filter(tag => tag.trim().length > 0).map(tag => tag + '</a>');
    
    // Create new tags based on the template (take the first one)
    const template = aTags[0];
    
    const newTags = images.map(imgName => {
        let tag = template + '';
        const url = `../wp-content/uploads/2026/04/${encodeURIComponent(imgName)}`;
        
        tag = tag.replace(/href="[^"]+"/g, `href="${url}"`);
        tag = tag.replace(/data-thumbnail="[^"]+"/g, `data-thumbnail="${url}"`);
        tag = tag.replace(/data-elementor-lightbox-title="[^"]+"/g, `data-elementor-lightbox-title="Gallery Image"`);
        tag = tag.replace(/alt="[^"]+"/g, `alt="The Nurturing Roots Gallery Image"`);
        // Remove style attribute if it has backgroundImage to let my new script handle it
        tag = tag.replace(/style="[^"]*background-image:[^"]*"/g, '');
        
        return tag;
    });

    // Combine and shuffle
    const allTags = aTags.concat(newTags);
    
    // Shuffle helper
    for (let i = allTags.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allTags[i], allTags[j]] = [allTags[j], allTags[i]];
    }

    const newGalleryHtml = '\n\n' + allTags.join('\n') + '\n';
    const finalContent = content.substring(0, startIndex + containerStart.length) + newGalleryHtml + content.substring(endIndex);
    
    fs.writeFileSync(filePath, finalContent);
    console.log(`Updated ${filePath} with new images.`);
}

updateGallery('gallery/index.html');
