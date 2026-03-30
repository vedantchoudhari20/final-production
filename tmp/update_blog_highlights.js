const fs = require('fs');
const filePath = 'c:/Users/Vedant/Downloads/thenurturingroots.com/deploy/blog/index.html';

const staticCards = `
                            <!-- Static Horizontal Learning Blog -->
                            <div class="latest-blog-card">
                              <div class="latest-blog-image-wrapper">
                                <a href="what-is-horizontal-learning-tnr/index.html">
                                  <img src="../images/horizontal_activity.png" alt="What is Horizontal Learning?" style="width: 100%; height: 250px; object-fit: cover;">
                                </a>
                              </div>
                              <div class="latest-blog-content">
                                <span style="background: #fff9c4; color: #f9a825; padding: 5px 12px; border-radius: 50px; font-size: 11px; font-weight: 700; text-transform: uppercase;">Methodology</span>
                                <h3 style="font-family: 'Kids Knowledge', sans-serif; font-size: 24px; margin: 12px 0 8px; line-height: 1.2;">What is Horizontal Learning?</h3>
                                <div style="font-size: 13px; color: #999; margin-bottom: 5px;">AUTHOR: The Nurturing Roots Team</div>
                                <p style="color: #666; line-height: 1.5; font-size: 14px; font-family: sans-serif; height: 75px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">Discover the beautiful buzz of activity that makes Horizontal Learning so effective at TNR.</p>
                                <a href="what-is-horizontal-learning-tnr/index.html" class="latest-blog-read-more" style="font-size: 14px;">Read Full Story →</a>
                              </div>
                            </div>
                            <!-- Static New Age Parenting Blog -->
                            <div class="latest-blog-card">
                              <div class="latest-blog-image-wrapper">
                                <a href="new-age-parenting-guide/index.html">
                                  <img src="../images/parenting_guide.png" alt="New Age Parenting Guide" style="width: 100%; height: 250px; object-fit: cover;">
                                </a>
                              </div>
                              <div class="latest-blog-content">
                                <span style="background: #fff9c4; color: #f9a825; padding: 5px 12px; border-radius: 50px; font-size: 11px; font-weight: 700; text-transform: uppercase;">Insight</span>
                                <h3 style="font-family: 'Kids Knowledge', sans-serif; font-size: 24px; margin: 12px 0 8px; line-height: 1.2;">New Age Parenting Guide</h3>
                                <div style="font-size: 13px; color: #999; margin-bottom: 5px;">AUTHOR: The Nurturing Roots Team</div>
                                <p style="color: #666; line-height: 1.5; font-size: 14px; font-family: sans-serif; height: 75px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">Modern parenting in the 2020s. Learn about gentle parenting, digital native navigation and research-based strategies.</p>
                                <a href="new-age-parenting-guide/index.html" class="latest-blog-read-more" style="font-size: 14px;">Read Full Story →</a>
                              </div>
                            </div>
`;

try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove individual static cards if they exist to avoid duplicates
    if (content.includes('what-is-horizontal-learning-tnr')) {
       // Clean up logic: Remove up to the end of the script tag if needed, but a simple replace is safer
       // Actually, I'll just clear the inserted block and re-insert
       content = content.replace(/<!-- Static Horizontal Learning Blog -->[\s\S]*?<!-- Static New Age Parenting Blog -->[\s\S]*?<\/div>/, '');
       content = content.replace(/<!-- Static Horizontal Learning Blog -->[\s\S]*?<\/div>/, ''); // Catch if only one was there
    }

    // Insert after the dynamic container opens
    content = content.replace(/<div id="dynamic-latest-blogs"[^>]*>/, m => m + staticCards);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully updated blog Highlights with both cards');
} catch (err) {
    console.error('Error updating blog highlights:', err);
}
