const fs = require('fs');

const newImages = [
    'sc1.png', 'sc2.png', 'sc3.png', 'sc4.png', 'sc5.png', 'sc6.png', 'sc7.png'
];

function regenerateGallery(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Extract existing gallery images (best effort)
    const regex = /href="([^"]+\.(?:jpg|png|jpeg))"/g;
    let match;
    const existingImages = new Set();
    while ((match = regex.exec(content)) !== null) {
        if (!match[1].includes('Screenshot')) { // skip the ones I'm replacing
            existingImages.add(match[1]);
        }
    }

    const allImageUrls = Array.from(existingImages).concat(newImages.map(img => `../wp-content/uploads/2026/04/${img}`));
    
    // Shuffle
    for (let i = allImageUrls.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allImageUrls[i], allImageUrls[j]] = [allImageUrls[j], allImageUrls[i]];
    }

    // Build fresh HTML
    const newTags = allImageUrls.map(url => {
        return `
        <a class="custom-gallery-item" href="${url}" target="_blank">
          <div class="custom-gallery-image" style="background-image: url('${url}')"></div>
        </a>`.trim();
    });

    const containerStart = '<div class="elementor-gallery__container">';
    const containerEnd = '</div>';
    
    let startIndex = content.indexOf(containerStart);
    let endIndex = content.indexOf(containerEnd, startIndex + containerStart.length);
    
    if (startIndex !== -1 && endIndex !== -1) {
        const newHtml = containerStart + '\n' + newTags.join('\n') + '\n' + containerEnd;
        content = content.substring(0, startIndex) + newHtml + content.substring(endIndex + containerEnd.length);
        
        // Also update CSS
        const styleBlock = `
  <style>
    .elementor-gallery__container {
        display: flex !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
        gap: 15px !important;
        width: 100% !important;
        padding: 20px 0 !important;
    }
    .custom-gallery-item {
        width: 300px !important;
        height: 300px !important;
        display: block !important;
        border-radius: 8px !important;
        overflow: hidden !important;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important;
        transition: transform 0.3s ease !important;
    }
    .custom-gallery-item:hover {
        transform: scale(1.05) !important;
    }
    .custom-gallery-image {
        width: 100% !important;
        height: 100% !important;
        background-size: cover !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
    }
  </style>
`;
        // Replace existing style and script with just this style
        content = content.replace(/<style>[\s\S]*?<\/style>/, styleBlock);
        // Remove the hardFix script
        content = content.replace(/<script>[\s\S]*?hardFix[\s\S]*?<\/script>/, '');
        
        fs.writeFileSync(filePath, content);
        console.log('Regenerated gallery with clean HTML.');
    }
}

regenerateGallery('gallery/index.html');
