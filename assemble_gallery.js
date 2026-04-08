const fs = require('fs');

let images = ["g1.jpg","g2.png","g3.png","g4.png","g5.png","g6.png","g7.png","g8.png","g9.png","g10.png","g11.png","g12.png","g13.jpeg","g14.jpeg","g15.jpeg","sc1.png","sc2.png","sc3.png","sc4.png","sc5.png","sc6.png","sc7.png"];

function assembleGallery() {
    let shuffled_images = images.slice();
    for (let i = shuffled_images.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled_images[i], shuffled_images[j]] = [shuffled_images[j], shuffled_images[i]];
    }

    const rootIndex = 'index.html';
    if (!fs.existsSync(rootIndex)) return;
    const rootContent = fs.readFileSync(rootIndex, 'utf8');

    // 1. Get Header
    const headerEndSignature = '<div id="content" class="site-content">';
    const headerIndex = rootContent.indexOf(headerEndSignature);
    if (headerIndex === -1) return;
    let header = rootContent.substring(0, headerIndex + headerEndSignature.length);
    
    // Thouroughly fix all relative paths
    // Match any sequence starting with ./ and replace with ../
    // But exclude the ones that are inside my own new gallery HTML later (not an issue yet)
    
    // Replace all instances of ./ with ../ in the header/footer
    const fixPaths = (str) => {
        return str.replace(/\.\//g, '../');
    };

    header = fixPaths(header);
    header = header.replace('<title>The Nurturing Roots</title>', '<title>Gallery - The Nurturing Roots</title>');

    // 2. Get Footer
    const footerStartSignature = '<div id="chatbot-widget">';
    const footerIndex = rootContent.indexOf(footerStartSignature);
    if (footerIndex === -1) return;
    let footer = rootContent.substring(footerIndex);
    
    footer = fixPaths(footer);

    // 3. Build Gallery Body
    const galleryHtml = `
      <div class="ast-container">
        <div id="primary" class="content-area primary">
          <main id="main" class="site-main">
            <article class="post-252 page type-page status-publish ast-article-single">
              <header class="entry-header ast-no-thumbnail ast-no-title ast-header-without-markup"></header>
              <div class="entry-content clear">
                <div class="elementor elementor-252">
                  <section class="elementor-section elementor-top-section elementor-element elementor-section-boxed" style="padding-top: 50px;">
                    <div class="elementor-container elementor-column-gap-default">
                      <div class="elementor-column elementor-col-100 elementor-top-column elementor-element">
                        <div class="elementor-widget-wrap elementor-element-populated">
                           <div class="elementor-element elementor-widget elementor-widget-heading">
                             <div class="elementor-widget-container" style="text-align: center; padding: 40px 0;">
                               <h1 class="elementor-heading-title elementor-size-default" style="font-family: inherit; color: #ff6b6b; font-size: 3rem;">Our Gallery</h1>
                               <p style="font-size: 1.2rem; color: #666;">Capturing precious moments at The Nurturing Roots</p>
                               <div style="width: 80px; height: 4px; background: #ff6b6b; margin: 20px auto; border-radius: 2px;"></div>
                             </div>
                           </div>
                           <div class="elementor-gallery__container">
                             ${shuffled_images.map(img => {
            const url = `../wp-content/uploads/2026/04/${img}`;
            return `
            <a class="clean-gallery-item" href="${url}" target="_blank">
                <img src="${url}" alt="Gallery Image" class="clean-gallery-img">
            </a>`.trim();
        }).join('\n')}
                           </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </article>
          </main>
        </div>
      </div>
    `;

    const fullStyles = `
  <style>
    .elementor-gallery__container {
        display: flex !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
        gap: 25px !important;
        width: 100% !important;
        padding-bottom: 80px !important;
    }
    .clean-gallery-item {
        flex: 0 1 350px !important;
        height: 280px !important;
        overflow: hidden !important;
        border-radius: 20px !important;
        box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
        transition: all 0.5s ease !important;
        display: block !important;
        background: #eee !important;
        border: 5px solid #fff !important;
    }
    .clean-gallery-item:hover {
        transform: translateY(-15px) rotate(2deg) !important;
        box-shadow: 0 30px 60px rgba(0,0,0,0.2) !important;
        z-index: 10 !important;
    }
    .clean-gallery-img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        display: block !important;
    }
    @media (max-width: 768px) {
        .clean-gallery-item {
            flex: 0 1 90% !important;
            height: auto !important;
            min-height: 280px !important;
        }
    }
  </style>
    `;

    header = header.replace('</head>', fullStyles + '\n</head>');

    fs.writeFileSync('gallery/index.html', header + galleryHtml + footer);
    console.log('Successfully re-assembled Gallery page with corrected paths.');
}

assembleGallery();
