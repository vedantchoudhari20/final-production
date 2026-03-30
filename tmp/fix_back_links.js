const fs = require('fs');
const files = [
    'c:/Users/Vedant/Downloads/thenurturingroots.com/deploy/blog/what-is-horizontal-learning-tnr/index.html',
    'c:/Users/Vedant/Downloads/thenurturingroots.com/deploy/blog/new-age-parenting-guide/index.html'
];

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/href="\.\.\/"/g, 'href="../index.html"');
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed link in ' + file);
    } catch (err) {
        console.warn('Could not fix ' + file + ':', err.message);
    }
});
