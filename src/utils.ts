/**
 * SpeedPulse - Utilities
 */

// Format speed to chosen unit
export function formatSpeed(mbps, unit = 'Mbps') {
    if (isNaN(mbps) || mbps === null) return '0.00';
    let val = parseFloat(mbps);
    switch (unit) {
        case 'MB/s': val = val / 8; break;
        case 'Gbps': val = val / 1000; break;
        default: break; // Mbps is default
    }
    return val.toFixed(2);
}

// Simple Web Audio API Synthesizer for UI Sounds
let audioCtx = null;

export function playSound(type) {
    if (document.body.classList.contains('sound-muted')) return;

    // Lazy init for Safari compatibility (must be created/resumed inside user gesture)
    if (!audioCtx) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'start') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'finish') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.15); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.3); // G5
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gainNode.gain.setValueAtTime(0.1, now + 0.4);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
    }
}

// Grade calculation logic based on typical broadband tiers
export function calculateGrade(down, up, ping) {
    if (!down || !up || !ping) return { grade: '-', text: 'Incomplete test' };

    let score = 0;

    // Download scoring (max 40)
    if (down > 500) score += 40;
    else if (down > 100) score += 30;
    else if (down > 25) score += 20;
    else if (down > 10) score += 10;

    // Upload scoring (max 30)
    if (up > 100) score += 30;
    else if (up > 20) score += 20;
    else if (up > 5) score += 10;

    // Ping scoring (max 30, lower is better)
    if (ping < 20) score += 30;
    else if (ping < 50) score += 20;
    else if (ping < 100) score += 10;

    if (score >= 90) return { grade: 'A+', text: 'Incredible speed. Perfect for 8K streaming and pro gaming.' };
    if (score >= 80) return { grade: 'A', text: 'Excellent. Great for 4K streaming and heavy use.' };
    if (score >= 70) return { grade: 'B', text: 'Good. Handles HD video calls and regular use well.' };
    if (score >= 50) return { grade: 'C', text: 'Fair. Might struggle with multiple 4K streams.' };
    if (score >= 30) return { grade: 'D', text: 'Slow. Basic web browsing and SD video only.' };
    return { grade: 'F', text: 'Very poor. Connection is severely degraded.' };
}

// Confetti Particle System
let confettiActive = false;
export function fireConfetti() {
    if (confettiActive) return;
    confettiActive = true;

    const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

    for (let i = 0; i < 150; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2 + 100,
            r: Math.random() * 6 + 2,
            dx: Math.random() * 20 - 10,
            dy: Math.random() * -20 - 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngle: 0,
            tiltAngleInc: (Math.random() * 0.07) + 0.05
        });
    }

    let frameId;
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let activeParticles = 0;

        particles.forEach(p => {
            p.tiltAngle += p.tiltAngleInc;
            p.y += (Math.cos(p.tiltAngle) + 1 + p.r / 2) / 2;
            p.x += Math.sin(p.tiltAngle) * 2;
            p.dy += 0.5; // gravity
            p.x += p.dx;
            p.y += p.dy;

            if (p.y <= canvas.height) {
                activeParticles++;
                ctx.beginPath();
                ctx.lineWidth = p.r;
                ctx.strokeStyle = p.color;
                ctx.moveTo(p.x + p.tilt + p.r, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
                ctx.stroke();
            }
        });

        if (activeParticles > 0) {
            frameId = requestAnimationFrame(render);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            confettiActive = false;
        }
    }
    render();
}
