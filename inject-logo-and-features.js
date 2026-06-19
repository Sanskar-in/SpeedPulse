const fs = require('fs');
const path = require('path');

const mainFilesDir = path.join(__dirname, 'main-files');
const htmlFiles = fs.readdirSync(mainFilesDir).filter(f => f.endsWith('.html'));

// HTML to inject the Sanskar Developer Logo
const logoHtml = `
            <div style="text-align: center; margin-top: 2rem;">
                <img src="Sanskar Developer.svg" alt="Built by Sanskar Developer" style="max-width: 250px; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5)); transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            </div>
`;

// 1. Inject the logo into ALL HTML files
htmlFiles.forEach(file => {
    const filePath = path.join(mainFilesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Inject right before the footer-bottom block
    const targetDiv = '<div class="footer-bottom"';
    if (content.includes(targetDiv) && !content.includes('Sanskar Developer.svg')) {
        content = content.replace(targetDiv, logoHtml + '\n            ' + targetDiv);
        fs.writeFileSync(filePath, content);
        console.log('Injected Sanskar Developer.svg into', file);
    }
});

// 2. Inject the Latency Graph Canvas into index.html
const indexFile = path.join(mainFilesDir, 'index.html');
let indexContent = fs.readFileSync(indexFile, 'utf8');

const latencyGraphHtml = `
            <!-- Real-Time Latency Jitter Graph -->
            <div class="glass-panel" style="margin-top: 2rem; padding: 1.5rem; border-radius: 16px;">
                <h3 style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 1rem; display: flex; justify-content: space-between;">
                    <span><svg width="18" height="18" style="vertical-align: middle; margin-right: 5px;" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg> Real-Time Jitter & Latency</span>
                    <span id="current-ping-display" style="color: #f59e0b; font-weight: bold;">-- ms</span>
                </h3>
                <div style="height: 120px; width: 100%; position: relative;">
                    <canvas id="latencyChart"></canvas>
                </div>
            </div>
`;

const resultGridEnd = '</div>\n            </div>\n\n            <!-- History Section -->';
if (indexContent.includes('<!-- History Section -->') && !indexContent.includes('id="latencyChart"')) {
    indexContent = indexContent.replace('<!-- History Section -->', latencyGraphHtml + '\n            <!-- History Section -->');
    fs.writeFileSync(indexFile, indexContent);
    console.log('Injected Latency Graph HTML into index.html');
}
