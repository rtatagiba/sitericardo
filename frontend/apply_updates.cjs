const fs = require('fs');
const path = require('path');

const blogDir = 'c:/Users/Ricardo Guedes/Desktop/projects/Site Ricardo/frontend/src/content/blog';
const updates = require('./updates.json');

updates.forEach(u => {
    if (u.newImage) {
        const filePath = path.join(blogDir, u.file);
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(`image: "${u.oldImage}"`, `image: "${u.newImage}"`);
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${u.file}`);
    }
});

// Update hero section
const indexAstroPath = 'c:/Users/Ricardo Guedes/Desktop/projects/Site Ricardo/frontend/src/pages/index.astro';
let indexContent = fs.readFileSync(indexAstroPath, 'utf8');
indexContent = indexContent.replace('src="/images/Ricardo Tatagiba SEO Img Hero Matrix.png"', 'src="/images/Ricardo Tatagiba SEO Img Hero Matrix.webp"');
fs.writeFileSync(indexAstroPath, indexContent);
console.log('Updated index.astro');
