const fs = require('fs');

const newBio = `                                      <p>
                                        <span style="font-weight: 400">Dr. Priyanka Sharma is a devoted mother, visionary educator, and Co-Founder of Nurturing Roots, bringing over a decade of deep-rooted expertise in early childhood education and development.</span>
                                      </p>
                                      <p>
                                        <span style="font-weight: 400">She holds a Bachelor’s in Education and an Honorary Doctorate in Education Philosophy, a testament to her lifelong dedication to the field. Driven by her belief that great institutions are built on great leadership, she furthered her academic journey by completing the prestigious Education Leadership Programme at IIM Kolkata.</span>
                                      </p>
                                      <p>
                                        <span style="font-weight: 400">With a thorough command of diverse early childhood pedagogies, Dr. Sharma approaches every child’s learning journey with both scientific rigour and heartfelt empathy. At the core of her philosophy lies a powerful conviction that the strongest foundations for tomorrow’s leaders are laid in their earliest years, through the right blend of support, encouragement, and nurturing guidance.</span>
                                      </p>
                                      <p>
                                        <span style="font-weight: 400">Her expertise, combined with a dynamic co-partnership with Suhani Gupta, has transformed the lives of over 500 children, empowering each one to discover and grow into the best version of themselves. For Dr. Sharma, this is not just a profession it is a purpose, and the pursuit of excellence shows no signs of slowing down.</span>
                                      </p>`;

function updateBio(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Update Name Title
    content = content.replace(/Priyanka Sharma\s*<br>\( Founder \)/g, 'Dr. Priyanka Sharma <br>( Founder )');
    
    // 2. Update Bio
    // Look for the div with data-id="46d1898" and replace its container content
    const bioAreaPattern = /(<div\s+class="elementor-element\s+elementor-element-46d1898[\s\S]*?<div\s+class="elementor-widget-container">)[\s\S]*?(<\/div>\s*<\/div>)/i;
    
    // The previous bio text editor content
    // Actually, I'll just replace everything between <div class="elementor-widget-container"> and </div></div>
    // But be careful not to match too much. 
    // Usually there is a style block first.
    
    const bioContentPattern = /(<div\s+class="elementor-element\s+elementor-element-46d1898[\s\S]*?<div\s+class="elementor-widget-container">[\s\S]*?<\/style>)([\s\S]*?)(<\/div>\s*<\/div>)/i;
    
    const updatedContent = content.replace(bioContentPattern, (match, prefix, oldBio, suffix) => {
        return prefix + '\n' + newBio + '\n' + suffix;
    });
    
    if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Updated ${filePath}`);
    } else {
        console.log(`No changes made to ${filePath}`);
    }
}

updateBio('founders/index.html');
updateBio('deploy/founders/index.html');
