const fs = require('fs');
const filePath = 'c:/Users/Vedant/Downloads/thenurturingroots.com/deploy/blog/index.html';

const horizontalLearningCard = `
                            <!-- Static Horizontal Learning Blog -->
                            <div class="latest-blog-card">
                              <div class="latest-blog-image-wrapper">
                                <a href="what-is-horizontal-learning-tnr/index.html">
                                  <img src="../images/blog_nurturing.png" alt="What is Horizontal Learning?" style="width: 100%; height: 250px; object-fit: cover;">
                                </a>
                              </div>
                              <div class="latest-blog-content">
                                <span style="background: #fff9c4; color: #f9a825; padding: 5px 12px; border-radius: 50px; font-size: 11px; font-weight: 700; text-transform: uppercase;">Methodology</span>
                                <h3 style="font-family: 'Kids Knowledge', sans-serif; font-size: 24px; margin: 12px 0 8px; line-height: 1.2;">What is Horizontal Learning?</h3>
                                <div style="font-size: 13px; color: #999; margin-bottom: 5px;">AUTHOR: The Nurturing Roots Team</div>
                                <p style="color: #666; line-height: 1.5; font-size: 14px; font-family: sans-serif; height: 75px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">Discover the beautiful buzz of activity that makes Horizontal Learning so effective at TNR.</p>
                                <a href="what-is-horizontal-learning-tnr/index.html" class="latest-blog-read-more" style="font-size: 14px;">Read Full Story →</a>
                              </div>
                            </div>`;

try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Insert after the dynamic container opens if not already there
    if (!content.includes('what-is-horizontal-learning-tnr')) {
        content = content.replace(/<div id="dynamic-latest-blogs"[^>]*>/, m => m + horizontalLearningCard);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Successfully added static blog card');
    } else {
        console.log('Static blog card already exists');
    }
} catch (err) {
    console.error('Error adding static blog card:', err);
}
