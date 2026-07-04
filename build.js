const fs = require('fs');
const path = require('path');

// Configure directories
const SRC_DIR = path.join(__dirname, 'src');
const OUTPUT_FILE = path.join(__dirname, 'index.html');

console.log('--- Initializing Static Site Generator Build Process ---');

// 1. Read source data
console.log('Reading data.json...');
const dataPath = path.join(SRC_DIR, 'data.json');
if (!fs.existsSync(dataPath)) {
    console.error('Error: src/data.json not found!');
    process.exit(1);
}
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 2. Read styles and scripts
console.log('Reading style.css...');
const cssPath = path.join(SRC_DIR, 'style.css');
const cssContent = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';

console.log('Reading script.js...');
const jsPath = path.join(SRC_DIR, 'script.js');
const jsContent = fs.existsSync(jsPath) ? fs.readFileSync(jsPath, 'utf8') : '';

// 3. Compile Good Reads list
console.log('Compiling good reads list...');
let goodReadsHtml = '';
data.good_reads.forEach(read => {
    goodReadsHtml += `
    <li>
        <a href="${read.url}" target="_blank" class="reads-link">${read.name}</a>
        <span class="feed">transmission_source</span>
    </li>`;
});

// 4. Compile Blog Posts list (space for blog)
console.log('Compiling blog logs...');
let blogHtml = '';
data.blog.posts.forEach(post => {
    blogHtml += `
    <article class="blog-post" id="${post.id}">
        <div class="blog-header">
            <h3 class="blog-post-title">&gt; ${post.title}</h3>
            <div class="blog-meta">
                <span class="blog-date">${post.date}</span>
                <span class="blog-toggle-icon">▶</span>
            </div>
        </div>
        <div class="blog-content">
            <p class="blog-summary">${post.summary}</p>
            <div class="blog-body-text">
                ${post.content.replace(/\n/g, '<br>')}
            </div>
        </div>
    </article>`;
});

// 5. Read and compile template
console.log('Compiling template.html...');
const templatePath = path.join(SRC_DIR, 'template.html');
if (!fs.existsSync(templatePath)) {
    console.error('Error: src/template.html not found!');
    process.exit(1);
}
let template = fs.readFileSync(templatePath, 'utf8');

// Replace placeholders
template = template
    .replace(/{{TITLE}}/g, data.title)
    .replace(/{{TAGLINE}}/g, data.tagline)
    .replace(/{{GITHUB_URL}}/g, data.github_url)
    .replace(/{{LINKEDIN_URL}}/g, data.linkedin_url)
    .replace(/{{MEDIUM_URL}}/g, data.medium_url)
    .replace(/{{GOOD_READS}}/g, goodReadsHtml)
    .replace(/{{BLOG_POSTS}}/g, blogHtml)
    .replace(/{{CSS}}/g, cssContent)
    .replace(/{{JS}}/g, jsContent);

// 6. Write final output file
console.log(`Writing self-contained output to ${OUTPUT_FILE}...`);
fs.writeFileSync(OUTPUT_FILE, template, 'utf8');

console.log('Build completed successfully! index.html is fully compiled.');
