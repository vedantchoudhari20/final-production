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

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    const containerStart = '<div class="elementor-gallery__container">';
    const containerEnd = '</div>';
    
    let startIndex = content.indexOf(containerStart);
    let endIndex = content.indexOf(containerEnd, startIndex + containerStart.length);
    
    if (startIndex === -1 || endIndex === -1) {
        console.error('Gallery container not found in', filePath);
        return;
    }
    
    let galleryHtml = content.substring(startIndex + containerStart.length, endIndex);
    
    // Extract existing <a> tags
    const aTagsRaw = galleryHtml.split(/<\/a>/).filter(tag => tag.trim().length > 0).map(tag => tag + '</a>');
    
    let template = aTagsRaw.find(tag => tag.includes('e-gallery-item'));
    if (!template && aTagsRaw.length > 0) template = aTagsRaw[0];
    if (!template) {
        template = `                                <a class="e-gallery-item elementor-gallery-item elementor-animated-content"
                                  href="PATH"
                                  data-elementor-open-lightbox="yes" data-elementor-lightbox-slideshow="all-b8b6a2a"
                                  data-elementor-lightbox-title="New Activity">
                                  <div class="e-gallery-image elementor-gallery-item__image"
                                    data-thumbnail="PATH"
                                    data-width="1200" data-height="900" alt="New School Activity"></div>
                                  <div class="elementor-gallery-item__overlay"></div>
                                </a>`;
    }
    
    // Create new tags
    let newTags = images.map((imgName, index) => {
        let tag = template + '';
        const url = `../wp-content/uploads/2026/04/${encodeURIComponent(imgName)}`;
        
        tag = tag.replace(/url\([^)]+\)/g, `url("${url}")`);
        tag = tag.replace(/href="[^"]+"/g, `href="${url}"`);
        tag = tag.replace(/data-src="[^"]+"/g, `data-src="${url}"`);
        tag = tag.replace(/data-thumbnail="[^"]+"/g, `data-thumbnail="${url}"`);
        tag = tag.replace(/src="[^"]+"/g, `src="${url}"`);
        // if template was string template string above
        tag = tag.replace(/PATH/g, url);
        return tag;
    });
    
    const imagesToRemove = [
        '4ea2dccf-82ea-438c-b712-54df82f6a035-300x135-1.jpg',
        '18485377_789905847845117_3197995626600413391_n-300x300-1.jpg',
        'WhatsApp-Image-2017-04-03-at-9.45.56-PM-300x169-1.jpeg'
    ];
    
    const filteredTags = aTagsRaw.filter(tag => {
        return !imagesToRemove.some(img => tag.includes(img));
    });

    const finalTags = filteredTags.concat(newTags);
    const shuffledTags = shuffle(finalTags);

    const newGalleryHtml = '\n\n' + shuffledTags.join('\n') + '\n';
    
    content = content.substring(0, startIndex + containerStart.length) + newGalleryHtml + content.substring(endIndex);
    
    fs.writeFileSync(filePath, content);
    console.log('Gallery index.html updated successfully with new images shuffled in:', filePath);
}

processFile('gallery/index.html');
