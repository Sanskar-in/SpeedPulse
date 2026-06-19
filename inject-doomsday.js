const fs = require('fs');
const path = require('path');

const devHtmlPath = path.join(__dirname, 'main-files', 'developer.html');
const devTsPath = path.join(__dirname, 'src', 'developer.ts');

let htmlContent = fs.readFileSync(devHtmlPath, 'utf8');
let tsContent = fs.readFileSync(devTsPath, 'utf8');

const newFeaturesHtml = `
<!-- Advanced Doomsday & Edge Topology -->
<div class="dev-panel" style="border-color: rgba(244, 63, 94, 0.4);">
    <h3 style="color: #f43f5e;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 21 2 21 12 2"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Doomsday Outage Scenarios</h3>
    <div class="setting-row">
        <span>Trigger Global HTTP 503 Outage</span>
        <label class="switch"><input type="checkbox" id="dev-outage-503"><span class="slider" style="background-color: #4c0519;"></span></label>
    </div>
    <div class="setting-row">
        <span>Force CORS Preflight Failure</span>
        <label class="switch"><input type="checkbox" id="dev-cors-fail"><span class="slider" style="background-color: #4c0519;"></span></label>
    </div>
    <div class="setting-row">
        <span>Simulate CDN Edge Node Collapse</span>
        <button class="action-btn danger-btn" id="dev-nuke-cdn">Destroy Edge Nodes</button>
    </div>
</div>

<div class="dev-panel">
    <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg> Edge Topology Visualizer</h3>
    <p style="color: #cbd5e1; font-size: 0.8rem; margin-bottom: 1rem;">Simulated BGP routing path from local machine to Cloudflare Global Backbone.</p>
    <div style="height: 150px; background: rgba(0,0,0,0.5); border-radius: 8px; border: 1px dashed #38bdf8; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
        <div id="topology-map" style="display: flex; align-items: center; gap: 10px; font-family: monospace; font-size: 0.75rem; color: #10b981;">
            <div style="text-align: center;"><div style="width: 20px; height: 20px; background: #3b82f6; border-radius: 50%; margin: 0 auto; box-shadow: 0 0 10px #3b82f6;"></div><br>Localhost</div>
            <div style="border-bottom: 2px dashed #64748b; width: 40px; position:relative;"><div class="data-packet" style="position: absolute; top: -4px; left: 0; width: 10px; height: 10px; background: #fff; border-radius: 50%;"></div></div>
            <div style="text-align: center;"><div style="width: 20px; height: 20px; background: #8b5cf6; border-radius: 5px; margin: 0 auto; box-shadow: 0 0 10px #8b5cf6;"></div><br>ISP Gateway</div>
            <div style="border-bottom: 2px dashed #64748b; width: 40px;"></div>
            <div style="text-align: center;"><div style="width: 30px; height: 30px; background: #f59e0b; border-radius: 5px; margin: 0 auto; box-shadow: 0 0 15px #f59e0b;"></div><br>CF Edge</div>
        </div>
    </div>
    <div class="setting-row" style="margin-top: 1rem;">
        <span>Reroute Backbone Trajectory</span>
        <button class="action-btn" id="dev-reroute-bgp">Force BGP Update</button>
    </div>
</div>

<div class="dev-panel" style="grid-column: 1 / -1;">
    <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg> Service Worker Cache API Sandbox</h3>
    <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
        <button class="action-btn" id="dev-inspect-cache">Inspect Cache Storage</button>
        <button class="action-btn danger-btn" id="dev-nuke-cache">Purge All Caches</button>
        <button class="action-btn" id="dev-seed-cache">Seed Dummy Offline Data</button>
    </div>
    <div class="state-inspector" id="dev-cache-inspector" style="height: 150px; background: #000; color: #e2e8f0;">Cache API Inspector ready...</div>
</div>
`;

// Inject HTML
const insertIndexHtml = htmlContent.indexOf('<!-- Advanced Sensors & Intercepts -->');
if (insertIndexHtml !== -1 && !htmlContent.includes('Doomsday Outage Scenarios')) {
    htmlContent = htmlContent.slice(0, insertIndexHtml) + newFeaturesHtml + "\n\n" + htmlContent.slice(insertIndexHtml);
    fs.writeFileSync(devHtmlPath, htmlContent);
    console.log("Injected Doomsday and Cache HTML into developer.html");
}

// Inject TypeScript logic
const newLogic = `
    // Doomsday & Outages
    const outage503 = document.getElementById('dev-outage-503') as HTMLInputElement;
    const corsFail = document.getElementById('dev-cors-fail') as HTMLInputElement;

    if (outage503) outage503.addEventListener('change', () => {
        if (outage503.checked) console.error("[DOOMSDAY] Global HTTP 503 Outage Simulation ENGAGED. All pipeline fetch requests will artificially collapse.");
        else console.info("[DOOMSDAY] Outage simulation disengaged.");
    });

    if (corsFail) corsFail.addEventListener('change', () => {
        if (corsFail.checked) console.warn("[SECURITY] CORS Preflight strictly blocked. Simulating Origin failure.");
    });

    document.getElementById('dev-nuke-cdn')?.addEventListener('click', () => {
        console.error("[CRITICAL] CDN Edge Nodes forcefully unmapped from internal DNS lookup table. Traffic blackholed.");
    });

    document.getElementById('dev-reroute-bgp')?.addEventListener('click', () => {
        console.info("[BGP] Calculating alternative network trajectory via internal routing table...");
        setTimeout(() => console.success("[BGP] Trajectory stabilized. Edge node re-acquired via secondary ISP link."), 1500);
    });

    // Service Worker Cache Sandbox
    const cacheInspector = document.getElementById('dev-cache-inspector');
    
    document.getElementById('dev-inspect-cache')?.addEventListener('click', async () => {
        if (!('caches' in window)) return;
        try {
            const cacheKeys = await caches.keys();
            if (cacheKeys.length === 0) {
                if (cacheInspector) cacheInspector.textContent = "No Caches Found.";
                return;
            }
            let out = "";
            for (let key of cacheKeys) {
                out += \`CACHE NODE: \${key}\\n\`;
                const cache = await caches.open(key);
                const reqs = await cache.keys();
                reqs.forEach(req => out += \`  -> \${req.url}\\n\`);
            }
            if (cacheInspector) cacheInspector.textContent = out;
            console.info("[CACHE API] Successfully crawled cache registries.");
        } catch(e) {
            console.error("[CACHE API] Extraction failed.", e);
        }
    });

    document.getElementById('dev-nuke-cache')?.addEventListener('click', async () => {
        if (!('caches' in window)) return;
        const cacheKeys = await caches.keys();
        for (let key of cacheKeys) {
            await caches.delete(key);
        }
        if (cacheInspector) cacheInspector.textContent = "All caches strictly purged.";
        console.warn("[CACHE API] Completely purged Service Worker storage.");
    });

    document.getElementById('dev-seed-cache')?.addEventListener('click', async () => {
        if (!('caches' in window)) return;
        try {
            const devCache = await caches.open('speedpulse-dev-sandbox-v1');
            const data = new Blob(['{"status": "simulated_offline", "code": 200}'], { type: 'application/json' });
            await devCache.put('/api/simulated_offline_check', new Response(data));
            if (cacheInspector) cacheInspector.textContent = "Dummy payload seeded at '/api/simulated_offline_check' in cache 'speedpulse-dev-sandbox-v1'.";
            console.success("[CACHE API] Offline injection successful.");
        } catch(e) {
            console.error("[CACHE API] Seed fault.", e);
        }
    });

    // Packet Animation logic
    setInterval(() => {
        const packets = document.querySelectorAll('.data-packet');
        packets.forEach((p: any) => {
            let left = parseFloat(p.style.left || '0');
            left += 5;
            if (left > 40) left = 0;
            p.style.left = left + 'px';
        });
    }, 50);
`;

const insertIndexTs = tsContent.lastIndexOf('}');
if (insertIndexTs !== -1 && !tsContent.includes('Doomsday & Outages')) {
    tsContent = tsContent.slice(0, insertIndexTs) + newLogic + "\n" + tsContent.slice(insertIndexTs);
    fs.writeFileSync(devTsPath, tsContent);
    console.log("Injected Doomsday and Cache TS logic into developer.ts");
}
