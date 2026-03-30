const fs = require('fs');
const indexFile = 'c:/Users/Vedant/Downloads/thenurturingroots.com/deploy/blog/index.html';

try {
    let content = fs.readFileSync(indexFile, 'utf8');

    // 1. Identify the container
    const startTag = '<div id="dynamic-latest-blogs" class="elementor-posts-container"';
    const endMarker = '<!-- FALLBACK CONTENT -->';
    
    const startIndex = content.indexOf(startTag);
    const splitIndex = content.indexOf('>', startIndex) + 1;
    const endIndex = content.indexOf(endMarker);

    if (startIndex > -1 && endIndex > -1) {
        const head = content.substring(0, splitIndex);
        const tail = content.substring(endIndex);

        const newStaticCards = `
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
                                <p style="color: #666; line-height: 1.5; font-size: 14px; font-family: sans-serif; height: 75px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">Modern parenting in the 2020s. Learn about research-based strategies for emotionally healthy, resilient children.</p>
                                <a href="new-age-parenting-guide/index.html" class="latest-blog-read-more" style="font-size: 14px;">Read Full Story →</a>
                              </div>
                            </div>
                            <!-- Static Horizontal Learning Blog -->
                            <div class="latest-blog-card">
                              <div class="latest-blog-image-wrapper">
                                <a href="what-is-horizontal-learning-tnr/index.html">
                                  <img src="../images/horizontal_activity.png" alt="Horizontal Learning Activity" style="width: 100%; height: 250px; object-fit: cover;">
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
`;
        
        fs.writeFileSync(indexFile, head + "\n" + newStaticCards + "\n                            " + tail, 'utf8');
        console.log('Successfully fully cleaned and rebuilt carousel');
    }
} catch (err) {
    console.error('Final cleanup failed:', err);
}
