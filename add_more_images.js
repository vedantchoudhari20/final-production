const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceDir = 'C:\\Users\\Vedant\\Pictures\\new g';
const targetDir = 'c:\\Users\\Vedant\\Downloads\\thenurturingroots.com\\wp-content\\uploads\\2026\\04';

function copyImages() {
    if (!fs.existsSync(sourceDir)) {
        console.error('Source dir not found');
        return;
    }
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    const files = fs.readdirSync(sourceDir).filter(f => {
        const ext = path.extname(f).toLowerCase();
        return (ext === '.png' || ext === '.jpg' || ext === '.jpeg') && fs.lstatSync(path.join(sourceDir, f)).isFile();
    });

    console.log(`Found ${files.length} images to copy from ${sourceDir}`);
    
    const copiedFiles = [];
    files.forEach((f, index) => {
        const newName = `g${index + 1}${path.extname(f)}`;
        const sourcePath = path.join(sourceDir, f);
        const targetPath = path.join(targetDir, newName);
        fs.copyFileSync(sourcePath, targetPath);
        copiedFiles.push(newName);
    });

    // Also include sc1.png to sc7.png from previous steps if they exist
    const scFiles = [];
    for (let i = 1; i <= 7; i++) {
        if (fs.existsSync(path.join(targetDir, `sc${i}.png`))) {
            scFiles.push(`sc${i}.png`);
        }
    }

    const allImages = copiedFiles.concat(scFiles);
    
    // REGENERATE GALLERY PAGE
    const assembleGalleryScript = fs.readFileSync('assemble_gallery.js', 'utf8');
    // Modify it to use allImages
    const updatedScript = assembleGalleryScript.replace(/const images = \[[\s\S]*?\];/, `const images = ${JSON.stringify(allImages)};`)
                                              .replace(/\.map\(img => `[\s\S]*?`\)/g, `.map(img => {
            const url = \`../wp-content/uploads/2026/04/\${img}\`;
            return \`
            <a class="clean-gallery-item" href="\${url}" target="_blank">
                <img src="\${url}" alt="Gallery Image" class="clean-gallery-img">
            </a>\`.trim();
        })`)
                                              .replace(/images\.map/g, 'shuffled_images.map'); // need to shuffle

    // Add shuffle logic to the script
    const finalScript = updatedScript.replace('const images =', 'let images =')
                                     .replace('function assembleGallery() {', `function assembleGallery() {
    let shuffled_images = images.slice();
    for (let i = shuffled_images.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled_images[i], shuffled_images[j]] = [shuffled_images[j], shuffled_images[i]];
    }
`);

    fs.writeFileSync('assemble_gallery.js', finalScript);
    console.log('Updated assemble_gallery.js with new images and shuffle logic.');
}

copyImages();
