const fs = require('fs');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

const images = [
    'Screenshot 2026-04-07 192029.png',
    'Screenshot 2026-04-07 192218.png',
    'Screenshot 2026-04-07 192246.png',
    'Screenshot 2026-04-07 192310.png',
    'Screenshot 2026-04-07 192331.png',
    'Screenshot 2026-04-07 192704.png',
    'Screenshot 2026-04-07 192839.png'
];

let content = fs.readFileSync('gallery/index.html', 'utf8');

const containerStart = '<div class="elementor-gallery__container">';
const containerEnd = '</div>';

let startIndex = content.indexOf(containerStart);
let endIndex = content.indexOf(containerEnd, startIndex + containerStart.length);

let galleryHtml = content.substring(startIndex + containerStart.length, endIndex);
let originalHtml = galleryHtml;

// Split by </a>
const aTagsRaw = galleryHtml.split(/(<\/a>)/gi);
let aTags = [];
for(let i=0; i<aTagsRaw.length; i+=2) {
    if(aTagsRaw[i].trim() && aTagsRaw[i+1]) {
        aTags.push(aTagsRaw[i] + aTagsRaw[i+1]);
    }
}

let template = aTags.find(tag => !tag.includes('button-demo')); // prevent using "Enrol Now" button if exist inside
if(!template && aTags.length > 0) template = aTags[0];

const newTags = images.map(imgName => {
    let tag = template;
    const url = `../wp-content/uploads/2026/04/${encodeURIComponent(imgName)}`;
    
    // Replace all file paths. Standard paths ends with .jpg, .png, .jpeg etc
    // Typical elementor setup replaces href, data-thumbnail, data-src, etc.
    // Also style="background-image: url(...)" may be used.
    
    // We can replace matches of string like .../wp-content/uploads/...jpg with url
    tag = tag.replace(/url\([^)]+\)/g, `url("${url}")`);
    tag = tag.replace(/href="[^"]+"/g, `href="${url}"`);
    tag = tag.replace(/data-src="[^"]+"/g, `data-src="${url}"`);
    tag = tag.replace(/data-thumbnail="[^"]+"/g, `data-thumbnail="${url}"`);
    tag = tag.replace(/src="[^"]+"/g, `src="${url}"`);
    
    return tag;
});

// Remove specifically ignored images just in case (from shuffle_gallery.js)
const imagesToRemove = [
    '4ea2dccf-82ea-438c-b712-54df82f6a035-300x135-1.jpg',
    '18485377_789905847845117_3197995626600413391_n-300x300-1.jpg',
    'WhatsApp-Image-2017-04-03-at-9.45.56-PM-300x169-1.jpeg'
];

const filteredTags = aTags.filter(tag => {
    return !imagesToRemove.some(img => tag.includes(img));
});

const finalTags = filteredTags.concat(newTags);
const shuffledTags = shuffle(finalTags);

const newGalleryHtml = '\n\n' + shuffledTags.join('\n') + '\n';
content = content.substring(0, startIndex + containerStart.length) + newGalleryHtml + content.substring(endIndex);

fs.writeFileSync('gallery/index.html', content);
console.log('Gallery index.html updated successfully with new images shuffled in.');
