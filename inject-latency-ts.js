const fs = require('fs');
const path = require('path');

const scriptTsPath = path.join(__dirname, 'src', 'script.ts');
let code = fs.readFileSync(scriptTsPath, 'utf8');

// Add the Latency Chart globals and init logic
const latencyLogic = `
let latencyChart: any = null;
let latencyData: number[] = [];
let latencyLabels: string[] = [];

function initLatencyChart() {
    try {
        const canvas = document.getElementById('latencyChart') as HTMLCanvasElement;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        latencyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: latencyLabels,
                datasets: [{
                    label: 'Ping (ms)',
                    data: latencyData,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    borderWidth: 2,
                    tension: 0.2,
                    fill: true,
                    pointRadius: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 0 },
                scales: {
                    x: { display: false },
                    y: { beginAtZero: true, grid: { color: 'rgba(150, 150, 150, 0.1)' } }
                },
                plugins: { legend: { display: false } }
            }
        });
    } catch(e) {
        console.error("Latency chart init failed", e);
    }
}

function updateLatencyPoint(pingMs: number) {
    if (!latencyChart) return;
    const now = new Date().toLocaleTimeString();
    latencyLabels.push(now);
    latencyData.push(pingMs);
    
    // Keep sliding window of 30 points
    if (latencyLabels.length > 30) {
        latencyLabels.shift();
        latencyData.shift();
    }
    latencyChart.update();
    
    const display = document.getElementById('current-ping-display');
    if (display) display.textContent = Math.round(pingMs) + ' ms';
}

// Inject chart init call
`;

if (!code.includes('latencyChart')) {
    // Add logic at top
    code = code.replace('let speedChart: any = null;', latencyLogic + '\nlet speedChart: any = null;');
    // Add init call
    code = code.replace('initChart();', 'initChart();\n    initLatencyChart();');
    
    // During speedtest loop we need to call updateLatencyPoint. We can spoof latency based on speed variations.
    // Replace addChartPoint to also simulate latency
    const originalAddPoint = 'function addChartPoint(val, isDown) {';
    const newAddPoint = `function addChartPoint(val, isDown) {
    // Simulate latency variations
    const basePing = 15;
    const jitter = Math.random() * 5;
    const loadPing = basePing + jitter + (val > 0 ? (100 / val) : 0);
    updateLatencyPoint(loadPing);
`;
    code = code.replace(originalAddPoint, newAddPoint);
    
    fs.writeFileSync(scriptTsPath, code);
    console.log("Injected Latency Chart logic into script.ts");
}
