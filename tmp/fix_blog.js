const fs = require('fs');
const filePath = 'c:/Users/Vedant/Downloads/thenurturingroots.com/deploy/blog/index.html';

try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Correcting max-width to fixed width and flex
    content = content.replace(/max-width: 400px;/g, 'width: 320px; flex: 0 0 320px; scroll-snap-align: center;');
    
    // Correcting container to use scroll
    content = content.replace(/flex-wrap: wrap; gap: 30px;/g, 'overflow-x: auto; gap: 20px; scroll-snap-type: x mandatory; padding-bottom: 20px;');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully fixed blog index');
} catch (err) {
    console.error('Error fixing blog index:', err);
}
