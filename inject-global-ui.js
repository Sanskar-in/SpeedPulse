const fs = require('fs');
const path = require('path');

const mainFilesDir = path.join(__dirname, 'main-files');
const htmlFiles = fs.readdirSync(mainFilesDir).filter(f => f.endsWith('.html'));

// 1. The Global Splash Screen & Custom Cursor CSS to inject into <head>
const globalHeadCss = `
    <!-- Global SpeedPulse UI Systems -->
    <style>
        /* Flash Screen (Splash) */
        #global-splash-screen {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: #020617;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transition: opacity 0.8s ease-out, visibility 0.8s ease-out;
        }
        .splash-logo {
            width: 350px;
            animation: pulse-glow 2s infinite;
        }
        @keyframes pulse-glow {
            0% { filter: drop-shadow(0 0 10px rgba(56,189,248,0.5)); transform: scale(1); }
            50% { filter: drop-shadow(0 0 30px rgba(236,72,153,0.8)); transform: scale(1.05); }
            100% { filter: drop-shadow(0 0 10px rgba(56,189,248,0.5)); transform: scale(1); }
        }
        
        /* Scroll Progress Bar */
        #scroll-progress-bar {
            position: fixed;
            top: 0; left: 0; height: 4px;
            background: linear-gradient(90deg, #3b82f6, #ec4899);
            z-index: 999998;
            width: 0%;
            transition: width 0.1s;
        }

        /* Custom Context Menu */
        #custom-context-menu {
            position: fixed;
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(56, 189, 248, 0.3);
            border-radius: 12px;
            padding: 0.5rem 0;
            min-width: 200px;
            z-index: 9999999;
            box-shadow: 0 15px 35px rgba(0,0,0,0.5);
            display: none;
            flex-direction: column;
            transform-origin: top left;
            animation: contextFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes contextFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .context-menu-item {
            padding: 0.75rem 1.25rem;
            color: #e2e8f0;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.2s;
        }
        .context-menu-item:hover {
            background: rgba(56, 189, 248, 0.15);
            color: #38bdf8;
            padding-left: 1.5rem;
        }
        .context-menu-divider {
            height: 1px;
            background: rgba(255,255,255,0.1);
            margin: 0.25rem 0;
        }

        /* Cursor Glow Trail */
        .cursor-trail {
            position: fixed;
            width: 10px; height: 10px;
            background: #ec4899;
            border-radius: 50%;
            pointer-events: none;
            z-index: 999990;
            box-shadow: 0 0 15px #ec4899;
            transition: opacity 0.5s, transform 0.5s;
            opacity: 0.8;
        }
    </style>
`;

// 2. The Global HTML Elements to inject right after <body>
const globalBodyHtml = `
    <!-- Global UI Features -->
    <div id="scroll-progress-bar"></div>
    
    <div id="global-splash-screen">
        <img src="Sanskar Developer.svg" alt="Sanskar Developer Logo" class="splash-logo">
        <div style="margin-top: 2rem; color: #cbd5e1; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; letter-spacing: 2px;">
            INITIALIZING CORE ENGINES...
        </div>
        <!-- Progress Bar inside splash -->
        <div style="width: 250px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 4px; margin-top: 1rem; overflow: hidden;">
            <div id="splash-progress" style="width: 0%; height: 100%; background: #38bdf8; transition: width 0.1s linear;"></div>
        </div>
    </div>

    <div id="custom-context-menu">
        <div class="context-menu-item" onclick="window.location.href='index.html'">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg> Run Speed Test
        </div>
        <div class="context-menu-item" onclick="window.location.href='developer.html'">
            <svg width="16" height="16" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 9.36l-1.63 1.63a1 1 0 0 0-.2.27l-2.43 4.86a1 1 0 0 1-1.8 0L5.3 16.89a1 1 0 0 1-.2-.27l-1.63-1.63a6 6 0 0 1 9.36-7.94l3.77-3.77z"/></svg> Developer Labs
        </div>
        <div class="context-menu-divider"></div>
        <div class="context-menu-item" onclick="navigator.clipboard.writeText(window.location.href); alert('URL Copied!');">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy Page URL
        </div>
        <div class="context-menu-item" onclick="window.location.reload(true)">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Force Reload
        </div>
    </div>

    <!-- Core Global Logic Script -->
    <script>
        // 1. Splash Screen Logic
        document.addEventListener("DOMContentLoaded", () => {
            const splash = document.getElementById('global-splash-screen');
            const progress = document.getElementById('splash-progress');
            let w = 0;
            const interval = setInterval(() => {
                w += Math.random() * 15 + 5;
                if(w >= 100) {
                    w = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        splash.style.opacity = '0';
                        splash.style.visibility = 'hidden';
                    }, 400);
                }
                progress.style.width = w + '%';
            }, 50);
        });

        // 2. Scroll Progress Logic
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById('scroll-progress-bar').style.width = scrolled + '%';
        });

        // 3. Custom Context Menu Logic
        const contextMenu = document.getElementById('custom-context-menu');
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            contextMenu.style.display = 'flex';
            
            // Boundary detection
            let x = e.clientX;
            let y = e.clientY;
            const menuWidth = contextMenu.offsetWidth;
            const menuHeight = contextMenu.offsetHeight;
            if(x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 10;
            if(y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 10;
            
            contextMenu.style.left = x + 'px';
            contextMenu.style.top = y + 'px';
        });
        document.addEventListener('click', () => {
            contextMenu.style.display = 'none';
        });

        // 4. Cursor Trail Logic
        let lastTrail = 0;
        document.addEventListener('mousemove', (e) => {
            const now = performance.now();
            if (now - lastTrail > 40) { // Limit spawn rate
                lastTrail = now;
                const trail = document.createElement('div');
                trail.className = 'cursor-trail';
                trail.style.left = (e.clientX - 5) + 'px';
                trail.style.top = (e.clientY - 5) + 'px';
                // Random color between blue and pink
                trail.style.background = Math.random() > 0.5 ? '#ec4899' : '#38bdf8';
                trail.style.boxShadow = '0 0 15px ' + trail.style.background;
                document.body.appendChild(trail);
                
                // Animate and destroy
                setTimeout(() => {
                    trail.style.opacity = '0';
                    trail.style.transform = 'scale(2)';
                    setTimeout(() => trail.remove(), 500);
                }, 50);
            }
        });
    </script>
`;

htmlFiles.forEach(file => {
    const filePath = path.join(mainFilesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Inject CSS into <head>
    if (!content.includes('id="global-splash-screen"')) {
        const headCloseIndex = content.indexOf('</head>');
        if (headCloseIndex !== -1) {
            content = content.slice(0, headCloseIndex) + globalHeadCss + '\n' + content.slice(headCloseIndex);
        }

        // Inject HTML and Scripts immediately after <body>
        const bodyTagRegex = /<body[^>]*>/i;
        const match = content.match(bodyTagRegex);
        if (match) {
            const insertIndex = match.index + match[0].length;
            content = content.slice(0, insertIndex) + '\n' + globalBodyHtml + content.slice(insertIndex);
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content);
            console.log('Successfully injected Flash Screen, Context Menu, and Cursor Trails into', file);
        }
    } else {
        console.log('Features already exist in', file);
    }
});
