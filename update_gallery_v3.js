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
    
    // Find all existing items
    const startTag = '<div class="elementor-gallery__container">';
    const endPattern = /<div class="elementor-element elementor-element-9f14479/; // As from fix_gallery_v2.js
    let startIndex = content.indexOf(startTag);
    let endMatch = content.substring(startIndex).match(endPattern);
    
    if (startIndex === -1 || !endMatch) {
         console.log("Could not find bounds in", filePath);
         return;
    }
    
    let endIndex = startIndex + endMatch.index;
    let galleryBlock = content.substring(startIndex + startTag.length, endIndex);
    
    // Extract existing <a> tags
    let aTags = galleryBlock.match(/<a class="e-gallery-item[^>]*>[\s\S]*?<\/a>/g) || [];
    
    // Create new tags
    let newTags = images.map((img, index) => {
        const path = `../wp-content/uploads/2026/04/${encodeURIComponent(img)}`;
        return `                                <a class="e-gallery-item elementor-gallery-item elementor-animated-content"
                                  href="${path}"
                                  data-elementor-open-lightbox="yes" data-elementor-lightbox-slideshow="all-b8b6a2a"
                                  data-elementor-lightbox-title="New Activity ${index+1}">
                                  <div class="e-gallery-image elementor-gallery-item__image"
                                    data-thumbnail="${path}"
                                    data-width="1200" data-height="900" alt="New School Activity ${index+1}"></div>
                                  <div class="elementor-gallery-item__overlay"></div>
                                </a>`;
    });
    
    // Some images to remove based on earlier requests
    const imagesToRemove = [
        '4ea2dccf-82ea-438c-b712-54df82f6a035-300x135-1.jpg',
        '18485377_789905847845117_3197995626600413391_n-300x300-1.jpg',
        'WhatsApp-Image-2017-04-03-at-9.45.56-PM-300x169-1.jpeg'
    ];
    let filteredTags = aTags.filter(tag => {
        return !imagesToRemove.some(img => tag.includes(img));
    });

    let allTags = filteredTags.concat(newTags);
    let shuffledTags = shuffle(allTags);
    
    // Wait, the end pattern matching is:
    // <div class="elementor-gallery__container"> ... 
    // </div>
    // </div>
    // ...
    // The previous script had:
    const pattern = /<div class="elementor-gallery__container">[\s\S]*?<div class="elementor-element elementor-element-9f14479/;
    const replacement = `<div class="elementor-gallery__container">\n${shuffledTags.join('\n')}\n                              </div>\n                            </div>\n                          </div>\n                          <div class="elementor-element elementor-element-9f14479`;
    
    content = content.replace(pattern, replacement);
    fs.writeFileSync(filePath, content);
    console.log(`Gallery fixed and shuffled in ${filePath}.`);
}

processFile('gallery/index.html');

