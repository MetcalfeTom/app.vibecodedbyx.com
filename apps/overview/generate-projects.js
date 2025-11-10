#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const appsDir = path.join(__dirname, '..');
const outputFile = path.join(__dirname, 'projects.json');

function extractMetadata(htmlContent, folder) {
    // Extract title
    const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : folder;

    // Extract og:description
    const descMatch = htmlContent.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
    let description = descMatch ? descMatch[1] : '';

    // Fallback to meta description
    if (!description) {
        const metaDescMatch = htmlContent.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
        description = metaDescMatch ? metaDescMatch[1] : 'No description available';
    }

    // Extract favicon emoji from emojicdn.elk.sh
    let icon = '🎮';
    const faviconMatch = htmlContent.match(/<link\s+rel=["']icon["']\s+href=["']https:\/\/emojicdn\.elk\.sh\/([^"']+)["']/i);
    if (faviconMatch) {
        icon = decodeURIComponent(faviconMatch[1]);
    }

    // Categorize based on keywords
    const fullText = (title + ' ' + description).toLowerCase();
    let category = 'other';

    if (fullText.match(/game|play|puzzle|arcade|adventure|rpg|battle|catch|quest|racing|fight|shooter/)) {
        category = 'game';
    } else if (fullText.match(/tool|converter|editor|tracker|generator|calculator|tracker|hub/)) {
        category = 'tool';
    } else if (fullText.match(/art|draw|paint|creative|design|visual|generative/)) {
        category = 'art';
    }

    return { title, description, icon, category };
}

function scanApps() {
    const projects = [];

    const folders = fs.readdirSync(appsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .filter(name => name !== 'overview'); // Exclude overview itself

    for (const folder of folders) {
        const indexPath = path.join(appsDir, folder, 'index.html');

        if (fs.existsSync(indexPath)) {
            try {
                const htmlContent = fs.readFileSync(indexPath, 'utf8');
                const metadata = extractMetadata(htmlContent, folder);

                projects.push({
                    folder,
                    title: metadata.title,
                    description: metadata.description,
                    icon: metadata.icon,
                    category: metadata.category,
                    url: `/${folder}/`
                });
            } catch (err) {
                console.error(`Error processing ${folder}:`, err.message);
            }
        }
    }

    // Sort alphabetically by title
    projects.sort((a, b) => a.title.localeCompare(b.title));

    return projects;
}

const projects = scanApps();

fs.writeFileSync(outputFile, JSON.stringify(projects, null, 2));

console.log(`✅ Generated ${projects.length} projects to projects.json`);
