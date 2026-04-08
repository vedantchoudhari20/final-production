const fs = require('fs');

const images = [
    { src: 'Screenshot_2026-03-31_123203.png', title: 'School Activity', alt: 'Nurturing Roots School Activity' },
    { src: 'Screenshot_2026-03-31_123333.png', title: 'School Activity', alt: 'Nurturing Roots School Activity' },
    { src: 'Screenshot_2026-03-31_123423.png', title: 'School Activity', alt: 'Nurturing Roots School Activity' },
    { src: 'Screenshot_2026-03-31_123532.png', title: 'School Activity', alt: 'Nurturing Roots School Activity' },
    { src: 'Screenshot_2026-03-31_123638.png', title: 'School Activity', alt: 'Nurturing Roots School Activity' },
    { src: 'Screenshot_2026-03-31_123719.png', title: 'School Activity', alt: 'Nurturing Roots School Activity' },
    { src: 'Screenshot_2026-03-31_123756.png', title: 'School Activity', alt: 'Nurturing Roots School Activity' },
    { src: 'Screenshot_2026-03-31_123843.png', title: 'School Activity', alt: 'Nurturing Roots School Activity' },
    { src: 'Screenshot_2026-03-31_124047.png', title: 'School Activity', alt: 'Nurturing Roots School Activity' },
    { src: 'Screenshot_2026-03-31_124325.png', title: 'School Activity', alt: 'Nurturing Roots School Activity' },
    { src: 'Screenshot_2026-03-31_124526.png', title: 'School Activity', alt: 'Nurturing Roots School Activity' },
    { src: 'WhatsApp-Image-2022-05-16-at-9.39.30-AM-2-300x225-1.jpeg', title: 'Curious Cubs at Play', alt: 'Curious Cubs Activity' },
    { src: 'WhatsApp-Image-2022-05-16-at-9.39.30-AM-3.jpeg', title: 'Curious Cubs at Play', alt: 'Curious Cubs Activity' },
    { src: 'WhatsApp-Image-2022-05-21-at-4.04.09-PM-300x225-1.jpeg', title: 'Curious Cubs at Play', alt: 'Curious Cubs Activity' },
    { src: 'WhatsApp-Image-2022-05-21-at-4.04.10-PM-1-300x225-1.jpeg', title: 'Curious Cubs at Play', alt: 'Curious Cubs Activity' },
    { src: 'siblings-playing-with-brain-teaser-toys_23-2149511980-768x512.jpg', title: 'Creative Learning', alt: 'Siblings playing with toys' },
    { src: 'gallery_child_green_ball.jpg', title: 'Outdoor Activity', alt: 'Boy with Green Ball', path: '../images/' },
    { src: 'gallery_children_cleaning.jpg', title: 'Cleaning Activity', alt: 'Children Cleaning', path: '../images/' }
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const shuffled = shuffle([...images]);

function generateHtml(img) {
    const basePath = img.path || '../images/gallery/';
    return `                                <a class="e-gallery-item elementor-gallery-item elementor-animated-content"
                                  href="${basePath}${img.src}"
                                  data-elementor-open-lightbox="yes" data-elementor-lightbox-slideshow="all-b8b6a2a"
                                  data-elementor-lightbox-title="${img.title}">
                                  <div class="e-gallery-image elementor-gallery-item__image"
                                    data-thumbnail="${basePath}${img.src}"
                                    data-width="1200" data-height="900" alt="${img.alt}"></div>
                                  <div class="elementor-gallery-item__overlay"></div>
                                </a>`;
}

const newGalleryContent = shuffled.map(generateHtml).join('\n');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const startTag = '<div class="elementor-gallery__container">';
    const endTag = '<div class="elementor-element elementor-element-9f14479'; // Look for the next widget
    
    const startIndex = content.indexOf(startTag);
    const endIndex = content.indexOf(endTag, startIndex);
    
    if (startIndex === -1 || endIndex === -1) {
        console.error('Tags not found in', filePath);
        return;
    }
    
    // We need to keep the </div> that closes the elementor-widget-container
    // Wait, let's be more precise.
    // The structure is:
    // <div class="elementor-gallery__container"> ... </div> (CLOSES CONTAINER)
    // </div> (CLOSES elementor-widget-container)
    // </div> (CLOSES elementor-element)
    
    const containerDivMatch = content.substring(startIndex).match(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/);
    if (!containerDivMatch) {
       console.error('Container closing pattern not found');
       return;
    }
    
    const actualEndIndex = startIndex + containerDivMatch.index;
    
    // Actually, I'll just find the first </div> after the container starts, but wait, the items might have divs.
    // But e-gallery-image is a div!
    // So the closing </div> for the container is after all the <a> tags.
    
    // Let's use a simpler approach: find the last </a> before the next elementor-element.
}

// SIMPLER FIX:
function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const pattern = /<div class="elementor-gallery__container">[\s\S]*?<div class="elementor-element elementor-element-9f14479/;
    const replacement = `<div class="elementor-gallery__container">\n${newGalleryContent}\n                              </div>\n                            </div>\n                          </div>\n                          <div class="elementor-element elementor-element-9f14479`;
    
    content = content.replace(pattern, replacement);
    fs.writeFileSync(filePath, content);
}

processFile('gallery/index.html');
processFile('deploy/gallery/index.html');
console.log('Gallery fixed and shuffled.');
