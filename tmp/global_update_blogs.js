const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/Vedant/Downloads/thenurturingroots.com/deploy';

const filesToUpdate = [
    'gallery/index.html',
    'our-centers/index.html',
    'about-us/index.html',
    'our-mission/index.html',
    'our-team/index.html',
    'preschool-franchise/index.html',
    'rising-star-1/index.html',
    'rising-star-2/index.html',
    'kids-nursery-in-nerul/index.html',
    'best-day-care-centre-in-nerul-pune/index.html',
    'index.html'
];

function getNewPostsHtml(relPath) {
    const blogBase = relPath + 'blog/';
    const imgBase = relPath + 'images/';
    
    return `
                                        <div class="elementor-posts-container elementor-posts elementor-posts--skin-classic elementor-grid">
                                          <!-- Post 1 -->
                                          <article class="elementor-post elementor-grid-item">
                                            <a class="elementor-post__thumbnail__link" href="${blogBase}new-age-parenting-guide/index.html">
                                              <div class="elementor-post__thumbnail">
                                                <img src="${imgBase}parenting_guide.png" alt="New Age Parenting Guide" style="height:200px; object-fit:cover; width:100%; border-radius:15px;">
                                              </div>
                                            </a>
                                            <div class="elementor-post__text">
                                              <h3 class="elementor-post__title" style="font-family:'Kids Knowledge', sans-serif; font-size:22px !important;">
                                                <a href="${blogBase}new-age-parenting-guide/index.html">New Age Parenting Guide</a>
                                              </h3>
                                              <div class="elementor-post__excerpt" style="font-size:14px; line-height:1.4; color:#666; height:60px; overflow:hidden;">
                                                <p>Modern parenting in the 2020s. Learn research-based strategies for emotionally healthy, resilient children.</p>
                                              </div>
                                              <a class="elementor-post__read-more" href="${blogBase}new-age-parenting-guide/index.html" style="font-weight:bold; color:#8b4e9d;">Read Full Story »</a>
                                            </div>
                                          </article>
                                          <!-- Post 2 -->
                                          <article class="elementor-post elementor-grid-item">
                                            <a class="elementor-post__thumbnail__link" href="${blogBase}what-is-horizontal-learning-tnr/index.html">
                                              <div class="elementor-post__thumbnail">
                                                <img src="${imgBase}horizontal_activity.png" alt="Horizontal Learning" style="height:200px; object-fit:cover; width:100%; border-radius:15px;">
                                              </div>
                                            </a>
                                            <div class="elementor-post__text">
                                              <h3 class="elementor-post__title" style="font-family:'Kids Knowledge', sans-serif; font-size:22px !important;">
                                                <a href="${blogBase}what-is-horizontal-learning-tnr/index.html">What is Horizontal Learning?</a>
                                              </h3>
                                              <div class="elementor-post__excerpt" style="font-size:14px; line-height:1.4; color:#666; height:60px; overflow:hidden;">
                                                <p>Discover the beautiful buzz of activity that makes Horizontal Learning so effective at TNR.</p>
                                              </div>
                                              <a class="elementor-post__read-more" href="${blogBase}what-is-horizontal-learning-tnr/index.html" style="font-weight:bold; color:#8b4e9d;">Read Full Story »</a>
                                            </div>
                                          </article>
                                          <!-- Post 3 -->
                                          <article class="elementor-post elementor-grid-item">
                                            <a class="elementor-post__thumbnail__link" href="${blogBase}index.html">
                                              <div class="elementor-post__thumbnail">
                                                <img src="${imgBase}annual_function_2026.png" alt="Annual Function 2026" style="height:200px; object-fit:cover; width:100%; border-radius:15px;">
                                              </div>
                                            </a>
                                            <div class="elementor-post__text">
                                              <h3 class="elementor-post__title" style="font-family:'Kids Knowledge', sans-serif; font-size:22px !important;">
                                                <a href="${blogBase}index.html">Annual Function 2026</a>
                                              </h3>
                                              <div class="elementor-post__excerpt" style="font-size:14px; line-height:1.4; color:#666; height:60px; overflow:hidden;">
                                                <p>A Journey of Dreams: Celebrating our children's milestones and creative expressions.</p>
                                              </div>
                                              <a class="elementor-post__read-more" href="${blogBase}index.html" style="font-weight:bold; color:#8b4e9d;">Coming Soon »</a>
                                            </div>
                                          </article>
                                        </div>`;
}

filesToUpdate.forEach(relFilePath => {
    const fullPath = path.join(projectRoot, relFilePath);
    if (!fs.existsSync(fullPath)) return;

    let content = fs.readFileSync(fullPath, 'utf8');
    
    const depth = relFilePath.split('/').filter(x => x && x !== 'index.html').length;
    let prefix = '../'.repeat(depth);
    if (relFilePath === 'index.html') prefix = '';

    const headingMatch = content.match(/News\s+(&|&amp;|&#038;)\s+Blog/i);
    if (headingMatch) {
       const h2Index = headingMatch.index;
       
       // Regex for starting div of posts container
       const containerStartRegex = /<div\s+[^>]*class=["'][^"']*elementor-posts-container/i;
       const remainingContent = content.substring(h2Index);
       const containerMatch = remainingContent.match(containerStartRegex);
       
       if (containerMatch) {
           const blockStart = h2Index + containerMatch.index;
           
           // Search for 3rd closing </article>
           let searchIndex = blockStart;
           let count = 0;
           while(count < 3) {
               let nextClose = content.indexOf('</article>', searchIndex);
               if (nextClose === -1) break;
               count++;
               searchIndex = nextClose + 10;
           }
           
           const blockEnd = content.indexOf('</div>', searchIndex) + 6;
           
           if (blockEnd > blockStart) {
               const head = content.substring(0, blockStart);
               const tail = content.substring(blockEnd);
               content = head + getNewPostsHtml(prefix) + tail;
               
               fs.writeFileSync(fullPath, content, 'utf8');
               console.log(`Updated ${relFilePath}`);
           }
       }
    }
});
