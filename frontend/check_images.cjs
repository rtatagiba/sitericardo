const fs = require('fs');
const path = require('path');

const publicDir = 'c:/Users/Ricardo Guedes/Desktop/projects/Site Ricardo/frontend/public';
const blogDir = 'c:/Users/Ricardo Guedes/Desktop/projects/Site Ricardo/frontend/src/content/blog';

// Find all webp images in public
const allWebpFiles = [];
function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const fullPath = path.join(dir, f);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.webp')) {
            allWebpFiles.push(fullPath.replace(/\\/g, '/').replace(publicDir.replace(/\\/g, '/'), ''));
        }
    }
}
walk(publicDir);

const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
const updates = [];

files.forEach(file => {
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/image:\s*"([^"]+)"/);
    if (match) {
        const oldImage = match[1];
        if (oldImage.endsWith('.webp')) return;
        
        let newImage = oldImage.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        // Check if this precise webp exists
        let exists = allWebpFiles.find(p => p.toLowerCase() === newImage.toLowerCase());
        
        if (!exists) {
            // Check if it exists in root /images/
            const baseName = path.basename(newImage);
            exists = allWebpFiles.find(p => path.basename(p).toLowerCase() === baseName.toLowerCase());
        }

        if (exists) {
            updates.push({file, oldImage, newImage: exists});
        } else {
            updates.push({file, oldImage, error: "No matching webp found"});
        }
    }
});

fs.writeFileSync('c:/Users/Ricardo Guedes/Desktop/projects/Site Ricardo/frontend/updates.json', JSON.stringify(updates, null, 2));
console.log("Done");
