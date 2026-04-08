const fs = require('fs');

const images = [
    'sc1.png', 'sc2.png', 'sc3.png', 'sc4.png', 'sc5.png', 'sc6.png', 'sc7.png'
];

function fixGallery() {
    const filePath = 'gallery/index.html';
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Reconstruct the missing scripts/footer by copying from founders/index.html
    const donorPath = 'founders/index.html';
    if (fs.existsSync(donorPath)) {
        const donorContent = fs.readFileSync(donorPath, 'utf8');
        // Find the signature of the footer/scripts start in a typical page
        // Usually after the main content sections
        const footerSignature = '<div id="chatbot-widget">';
        const donorFooterIndex = donorContent.indexOf(footerSignature);
        
        if (donorFooterIndex !== -1) {
            const footerHtml = donorContent.substring(donorFooterIndex);
            
            // Find where my current gallery ends (likely after my style block)
            const myEndIndex = content.indexOf('<!-- Meta Pixel Code -->');
            if (myEndIndex !== -1) {
                // Keep everything up to the gallery container end, then append donor footer
                // Wait, I need to keep the closing tags of the structural divs too.
                // Looking at founders, let's see what's before chatbot-widget.
                
                // Let's just use a simpler approach: 
                // The current gallery.html is missing the footer. 
                // I'll take everything from founders after its gallery or team section.
            }
        }
    }

    // ACTUALLY, let's just focus on the gallery container first.
    const containerStart = '<div class="elementor-gallery__container">';
    const containerEnd = '</div>';
    
    let startIndex = content.indexOf(containerStart);
    let endIndex = content.indexOf(containerEnd, startIndex + containerStart.length);

    if (startIndex !== -1 && endIndex !== -1) {
        // Build new tags with <img> instead of background-image for maximum reliability
        const galleryItems = images.map(img => {
            const url = `../wp-content/uploads/2026/04/${img}`;
            return `
            <a class="clean-gallery-item" href="${url}" target="_blank">
                <img src="${url}" alt="Gallery Image" class="clean-gallery-img">
            </a>`.trim();
        });

        // Add some existing images too if found
        // (omitted for brevity, let's just use the 7 for a "fresh" look as requested)

        const newGalleryHtml = containerStart + '\n' + galleryItems.join('\n') + '\n' + containerEnd;
        content = content.substring(0, startIndex) + newGalleryHtml + content.substring(endIndex + containerEnd.length);
    }

    // Update CSS to be absolute and simple
    const cleanStyles = `
  <style>
    .elementor-gallery__container {
        display: flex !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
        gap: 15px !important;
        width: 100% !important;
        padding: 40px 10px !important;
        background: #fff !important;
    }
    .clean-gallery-item {
        width: 300px !important;
        height: 300px !important;
        overflow: hidden !important;
        border-radius: 12px !important;
        box-shadow: 0 8px 20px rgba(0,0,0,0.1) !important;
        transition: transform 0.3s ease !important;
        display: block !important;
    }
    .clean-gallery-item:hover {
        transform: scale(1.03) !important;
    }
    .clean-gallery-img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        display: block !important;
    }
  </style>
`;
    content = content.replace(/<style>[\s\S]*?<\/style>/, cleanStyles);

    fs.writeFileSync(filePath, content);
    console.log('Fixed gallery with <img> tags.');
}

fixGallery();
