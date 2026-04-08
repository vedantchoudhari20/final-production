const fs = require('fs');

const imagesToRemove = [
    '4ea2dccf-82ea-438c-b712-54df82f6a035-300x135-1.jpg',
    '18485377_789905847845117_3197995626600413391_n-300x300-1.jpg',
    'WhatsApp-Image-2017-04-03-at-9.45.56-PM-300x169-1.jpeg'
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
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
    
    // Extract <a> tags
    const aTags = galleryHtml.split(/<\/a>/).filter(tag => tag.trim().length > 0).map(tag => tag + '</a>');
    
    // Filter and shuffle
    const filteredTags = aTags.filter(tag => {
        return !imagesToRemove.some(img => tag.includes(img));
    });
    
    const shuffledTags = shuffle([...filteredTags]);
    
    const newGalleryHtml = '\n\n' + shuffledTags.join('\n') + '\n';
    
    content = content.substring(0, startIndex + containerStart.length) + newGalleryHtml + content.substring(endIndex);
    
    fs.writeFileSync(filePath, content);
}

processFile('gallery/index.html');
processFile('deploy/gallery/index.html');
console.log('Gallery updated and shuffled.');
