const fs = require('fs');
const indexFile = 'c:/Users/Vedant/Downloads/thenurturingroots.com/deploy/blog/index.html';

const staticStyle = `
        <style>
          /* Make non-highlighted blog posts look static */
          .elementor-post article, .elementor-posts article.elementor-post {
            cursor: default !important;
          }
          .elementor-post a:not(.latest-blog-read-more), .elementor-posts a:not(.latest-blog-read-more) {
            pointer-events: none !important;
            text-decoration: none !important;
          }
           /* Ensure highlight section stays active */
          #dynamic-latest-blogs a, .latest-blog-card a {
            pointer-events: auto !important;
            cursor: pointer !important;
          }
        </style>`;

try {
    let content = fs.readFileSync(indexFile, 'utf8');
    if (!content.includes('static blog posts look static')) {
        content = content.replace('</style>', '</style>' + staticStyle);
        fs.writeFileSync(indexFile, content, 'utf8');
        console.log('Added static blog styling');
    }
} catch (err) {
    console.error('Failed to add style:', err);
}
