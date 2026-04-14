
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * This script is designed to be run periodically to synchronize blog content
 * and ensure all posts follow the responsive video and link rules.
 * 
 * Rules:
 * 1. Replace all jequandavis.wordpress.com links with jequandavis.wpcomstaging.com
 * 2. Wrap all iframes/videos in a .video-container div for mobile responsiveness
 */

const BLOG_SOURCE_URL = 'https://jequandavis.wpcomstaging.com';
const WP_DOMAIN = 'jequandavis.wordpress.com';
const STAGING_DOMAIN = 'jequandavis.wpcomstaging.com';

async function transformContent(content) {
    // 1. Replace WordPress links
    let transformed = content.replace(new RegExp(WP_DOMAIN, 'g'), STAGING_DOMAIN);

    // 2. Wrap iframes/videos in .video-container if not already wrapped
    // This regex looks for iframes/videos that are NOT already inside a div with class video-container
    const mediaRegex = /<(iframe|video|embed|object)[^>]*>.*?<\/\1>|<(iframe|video|embed|object)[^>]*\/>/gs;
    
    transformed = transformed.replace(mediaRegex, (match) => {
        if (match.includes('video-container')) return match;
        return `<div class="video-container">${match}</div>`;
    });

    return transformed;
}

async function syncBlog() {
    console.log(`Starting blog sync from ${BLOG_SOURCE_URL}...`);
    
    // Note: In a real environment, this would fetch from the WP REST API
    // For now, we apply the transformation rules to existing files in the repo
    // to ensure they stay compliant.
    
    const filesToProcess = [
        path.join(__dirname, 'src/App.tsx'),
        path.join(__dirname, 'index.html')
    ];

    for (const filePath of filesToProcess) {
        if (fs.existsSync(filePath)) {
            console.log(`Processing ${filePath}...`);
            const content = fs.readFileSync(filePath, 'utf8');
            const transformed = await transformContent(content);
            if (content !== transformed) {
                fs.writeFileSync(filePath, transformed);
                console.log(`Updated ${filePath}`);
            } else {
                console.log(`No changes needed for ${filePath}`);
            }
        }
    }

    console.log('Blog sync and transformation complete.');
}

syncBlog().catch(err => {
    console.error('Error during blog sync:', err);
    process.exit(1);
});
