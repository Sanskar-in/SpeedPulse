const fs = require('fs');
const path = require('path');

const devHtmlPath = path.join(__dirname, 'main-files', 'developer.html');
let htmlContent = fs.readFileSync(devHtmlPath, 'utf8');

// 1. Generate 100+ Themes
const themes = [];
const colorBases = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#22c55e', '#84cc16', '#eab308', '#f59e0b', '#f97316', '#ef4444'];
const bgBases = ['#0f172a', '#1e1b4b', '#2e1065', '#4c1d95', '#020617', '#171717', '#052e16', '#082f49'];

for (let i = 1; i <= 105; i++) {
    const primary = colorBases[Math.floor(Math.random() * colorBases.length)];
    const secondary = colorBases[Math.floor(Math.random() * colorBases.length)];
    const bg = bgBases[Math.floor(Math.random() * bgBases.length)];
    const glass = `rgba(${Math.floor(Math.random()*50)}, ${Math.floor(Math.random()*50)}, ${Math.floor(Math.random()*50)}, 0.7)`;
    
    let name = `Theme Engine v${i}`;
    if (i === 1) name = "Cyberpunk 2077";
    if (i === 2) name = "Synthwave Retro";
    if (i === 3) name = "Dracula Dark";
    if (i === 4) name = "Solarized Night";
    if (i === 5) name = "Matrix Terminal";

    themes.push({
        id: `theme_${i}`,
        name: name,
        primary,
        secondary,
        bg,
        glass
    });
}

// Build the HTML for 100+ Themes
let themesHtml = `
<div class="dev-panel" style="grid-column: 1 / -1; margin-top: 1rem;">
    <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> The 100+ Infinite Theme Matrix</h3>
    <p style="color: #cbd5e1; font-size: 0.9rem; margin-bottom: 1rem;">Instantly override global CSS variables with 100+ procedurally generated aesthetics.</p>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.8rem; max-height: 350px; overflow-y: auto; padding-right: 10px;">
`;

themes.forEach(t => {
    themesHtml += `
        <button class="action-btn theme-apply-btn" 
                data-primary="${t.primary}" 
                data-secondary="${t.secondary}" 
                data-bg="${t.bg}" 
                data-glass="${t.glass}"
                style="background: ${t.bg}; border: 1px solid ${t.primary}; color: #fff; text-align: left; padding: 0.8rem; display: flex; flex-direction: column; gap: 0.4rem;">
            <span style="font-weight: bold; font-size: 0.85rem;">${t.name}</span>
            <div style="display: flex; gap: 5px;">
                <div style="width: 15px; height: 15px; border-radius: 50%; background: ${t.primary};"></div>
                <div style="width: 15px; height: 15px; border-radius: 50%; background: ${t.secondary};"></div>
            </div>
        </button>
    `;
});
themesHtml += `</div></div>`;

// Build More Developer Features HTML
const moreFeaturesHtml = `
<!-- Advanced Sensors & Intercepts -->
<div class="dev-panel">
    <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Sensor & Location Spoofing</h3>
    <div class="setting-row">
        <span>Enable GPS Spoofing</span>
        <label class="switch"><input type="checkbox" id="dev-spoof-gps"><span class="slider"></span></label>
    </div>
    <div class="setting-row">
        <span>Latitude</span>
        <input type="text" id="dev-gps-lat" value="35.6895" placeholder="e.g. 35.6895">
    </div>
    <div class="setting-row">
        <span>Longitude</span>
        <input type="text" id="dev-gps-lng" value="139.6917" placeholder="e.g. 139.6917">
    </div>
    <div class="setting-row">
        <span>Force Device Offline Mode</span>
        <label class="switch"><input type="checkbox" id="dev-force-offline"><span class="slider"></span></label>
    </div>
</div>

<div class="dev-panel">
    <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> WebSocket & DOM Auditing</h3>
    <div class="setting-row">
        <span>Enable DOM Mutation Observer</span>
        <label class="switch"><input type="checkbox" id="dev-dom-observer"><span class="slider"></span></label>
    </div>
    <div class="setting-row">
        <span>Simulate WSS Connection Drops</span>
        <label class="switch"><input type="checkbox" id="dev-wss-drops"><span class="slider"></span></label>
    </div>
    <div class="setting-row">
        <span>Simulate WSS Latency (ms)</span>
        <input type="number" id="dev-wss-latency" value="0" min="0" max="5000">
    </div>
    <div class="setting-row" style="flex-direction: column; align-items: stretch; gap: 10px;">
        <button class="action-btn danger-btn" id="dev-trigger-memory-leak">Simulate Memory Leak Warning</button>
        <button class="action-btn" id="dev-run-benchmark">Run CPU Crypto Benchmark</button>
    </div>
</div>
`;

// Inject into HTML
// Find where the Dev Dashboard ends or insert before Diagnostics Telemetry
const telemetryString = "<!-- Diagnostics Telemetry -->";
const insertIndex = htmlContent.indexOf(telemetryString);

if (insertIndex !== -1) {
    htmlContent = htmlContent.slice(0, insertIndex) + moreFeaturesHtml + "\n" + themesHtml + "\n\n" + htmlContent.slice(insertIndex);
    fs.writeFileSync(devHtmlPath, htmlContent);
    console.log("Successfully injected 100+ themes and new advanced sensors into developer.html.");
} else {
    console.log("Error finding insertion point in HTML.");
}
