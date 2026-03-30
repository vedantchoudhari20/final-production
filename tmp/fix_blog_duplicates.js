const fs = require('fs');
const indexFile = 'c:/Users/Vedant/Downloads/thenurturingroots.com/deploy/blog/index.html';

try {
    let content = fs.readFileSync(indexFile, 'utf8');

    // Remove ALL static cards before re-adding just the Parenting Guide
    // This cleans up my previous insertions
    content = content.replace(/<!-- Static Horizontal Learning Blog -->[\s\S]*?<!-- Static New Age Parenting Blog -->[\s\S]*?<\/div>\s*<\/div>/, '');
    content = content.replace(/<!-- Static Horizontal Learning Blog -->[\s\S]*?<\/div>/g, '');
    content = content.replace(/<!-- Static New Age Parenting Blog -->[\s\S]*?<\/div>/g, '');

    const newParentingCard = `
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
                                <p style="color: #666; line-height: 1.5; font-size: 14px; font-family: sans-serif; height: 75px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">Modern parenting in the 2020s. Learn about research-based strategies for emotionally healthy, resilient children in a digital world.</p>
                                <a href="new-age-parenting-guide/index.html" class="latest-blog-read-more" style="font-size: 14px;">Read Full Story →</a>
                              </div>
                            </div>`;

    // Re-insert just the Parenting Guide after the opening of the container
    content = content.replace(/<div id="dynamic-latest-blogs"[^>]*>/, m => m + newParentingCard);

    fs.writeFileSync(indexFile, content, 'utf8');
    console.log('Cleaned and updated blog highlights');

} catch (err) {
    console.error('Error fixing blog highlights:', err);
}
