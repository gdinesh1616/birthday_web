// ==========================================================================
// MIDNIGHT CRIMSON GLOW - BIRTHDAY WEBSITE JAVASCRIPT
// Handles: Audio Engine, Cake Cutting, Balloons, Letter, Quiz, Timeline, Email
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupPersonalization();
    initAmbientCanvas();
    initAudioEngine();
    initCakeExperience();
    initLetterExperience();
    initQuizEngine();
    initTimeline();
    initReplyForm();
    initScrollSpy();
}

// --------------------------------------------------------------------------
// 1. PROGRESSION LOCK & PERSONALIZATION SETUP
// --------------------------------------------------------------------------
const unlockedSections = {
    cake: true,
    letter: false,
    quiz: false,
    memories: false
};

function unlockSection(sectionKey) {
    unlockedSections[sectionKey] = true;
    const sec = document.getElementById(`section-${sectionKey}`);
    const dot = document.getElementById(`dot-${sectionKey}`);
    
    if (sec) {
        sec.classList.remove('section-locked');
        sec.classList.add('unlocked');
    }
    
    if (dot) {
        dot.classList.remove('locked');
        const tip = dot.getAttribute('data-tooltip') || '';
        dot.setAttribute('data-tooltip', tip.replace(' (Locked 🔒)', ''));
    }
}

function setupPersonalization() {
    if (typeof CONFIG === 'undefined') return;

    // Title & Name replacements
    const heroName = document.getElementById('hero-friend-name');
    const navTag = document.getElementById('nav-queen-tag');
    const letterSalutation = document.getElementById('letter-salutation');
    const letterBody = document.getElementById('letter-body');
    const letterSignoff = document.getElementById('letter-signoff');
    const letterSignature = document.getElementById('letter-signature');

    if (heroName && CONFIG.friendName) heroName.textContent = CONFIG.friendName;
    if (navTag && CONFIG.friendNickname) navTag.textContent = CONFIG.friendNickname;

    // Page Title
    if (CONFIG.friendName) {
        document.title = `Happy Birthday, ${CONFIG.friendName}! ✨`;
    }

    // Prepare Letter placeholders (body will be dynamically typed when opened)
    if (CONFIG.letter) {
        if (letterSalutation) letterSalutation.textContent = "";
        if (letterBody) letterBody.innerHTML = "";
        if (letterSignoff) letterSignoff.textContent = CONFIG.letter.signOff || "With all our love and warmest wishes,";
        if (letterSignature) letterSignature.textContent = CONFIG.letter.signature || CONFIG.senderName || "Dinesh, Kireeti & Bhargavi";
    }

    // Dynamic Footer Signature
    const footerSign = document.querySelector('.footer-sign');
    if (footerSign && CONFIG.senderName) {
        footerSign.innerHTML = `${escapeHTML(CONFIG.senderName)} &copy; 2026`;
    }
}

// Helper to escape HTML safely
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// --------------------------------------------------------------------------
// 2. AMBIENT EMBER & STAR PARTICLES (HTML5 CANVAS)
// --------------------------------------------------------------------------
function initAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const isMobileDevice = width <= 768;
    const particleCount = isMobileDevice ? 18 : 55;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.2 + 0.6,
            speedY: Math.random() * -0.6 - 0.2,
            speedX: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.7 + 0.2,
            pulseSpeed: Math.random() * 0.02 + 0.01,
            color: Math.random() > 0.4 ? '255, 0, 64' : (Math.random() > 0.5 ? '255, 43, 102' : '255, 209, 102')
        });
    }

    function renderEmbers() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.01;
            p.opacity = Math.max(0.1, Math.min(0.85, p.opacity));

            // Wrap around
            if (p.y < -10) p.y = height + 10;
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
            if (!isMobileDevice) {
                ctx.shadowBlur = 8;
                ctx.shadowColor = `rgb(${p.color})`;
            }
            ctx.fill();
        });

        requestAnimationFrame(renderEmbers);
    }

    renderEmbers();
}

// --------------------------------------------------------------------------
// 3. AUDIO ENGINE & SOUND EFFECTS (WEB AUDIO API + FALLBACK)
// --------------------------------------------------------------------------
let audioCtx = null;
let isMusicPlaying = false;
let ambientMusicInterval = null;
let audioTrack = null;

function initAudioEngine() {
    const musicBtn = document.getElementById('music-toggle');
    const musicLabel = document.getElementById('music-label');

    if (typeof CONFIG !== 'undefined' && CONFIG.musicPath && CONFIG.musicPath.trim() !== '') {
        audioTrack = new Audio(CONFIG.musicPath);
        audioTrack.loop = true;
    }

    if (musicBtn) {
        musicBtn.addEventListener('click', () => {
            toggleMusic();
        });
    }
}

function getAudioContext() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function toggleMusic() {
    const musicBtn = document.getElementById('music-toggle');
    const musicLabel = document.getElementById('music-label');

    if (isMusicPlaying) {
        // Pause
        if (audioTrack) {
            audioTrack.pause();
        } else {
            clearInterval(ambientMusicInterval);
        }
        isMusicPlaying = false;
        if (musicBtn) musicBtn.classList.remove('playing');
        if (musicLabel) musicLabel.textContent = "Play Music";
    } else {
        // Play
        getAudioContext();
        if (audioTrack) {
            audioTrack.play().catch(e => console.log('Audio track autoplay blocked', e));
        } else {
            startProceduralMelody();
        }
        isMusicPlaying = true;
        if (musicBtn) musicBtn.classList.add('playing');
        if (musicLabel) musicLabel.textContent = "Pause Music";
        showToast("🎵 Playing sweet birthday vibes ✨");
    }
}

// Ambient Procedural Birthday Arpeggio Synthesizer
function startProceduralMelody() {
    const ctx = getAudioContext();
    // Warm romantic pentatonic notes (in Hz): C4, D4, E4, G4, A4, C5, D5, E5, G5
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
    let noteIndex = 0;

    function playNextNote() {
        if (!isMusicPlaying) return;
        const note = scale[noteIndex % scale.length];
        noteIndex = (noteIndex + Math.floor(Math.random() * 3) + 1);

        playSoftBell(note, 0.12, 1.8);
    }

    playNextNote();
    ambientMusicInterval = setInterval(playNextNote, 600);
}

function playSoftBell(freq, volume = 0.1, duration = 1.5) {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.error(e);
    }
}

// Sound FX: Candle Blow
function playBlowSound() {
    if (!audioCtx) getAudioContext();
    try {
        const bufferSize = audioCtx.sampleRate * 0.8;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.8);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        noise.start();
    } catch (e) {
        console.log(e);
    }
}

// Sound FX: Chime / Slice
function playSliceChime() {
    if (!audioCtx) getAudioContext();
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        setTimeout(() => playSoftBell(freq, 0.18, 1.2), i * 120);
    });
}

// Sound FX: Pop
function playPopSound() {
    if (!audioCtx) getAudioContext();
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
        console.log(e);
    }
}

// Sound FX: Gentle Typewriter Key Click
function playTypewriterTick() {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(650 + Math.random() * 250, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.035);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {}
}

// Sound FX: Firecracker Blast & Crackling Sparks
function playFirecrackerBlastSound() {
    if (!audioCtx) getAudioContext();
    if (!audioCtx) return;

    try {
        const now = audioCtx.currentTime;

        // 1. Initial Thump / Boom
        const boomOsc = audioCtx.createOscillator();
        const boomGain = audioCtx.createGain();
        boomOsc.type = 'sine';
        boomOsc.frequency.setValueAtTime(140, now);
        boomOsc.frequency.exponentialRampToValueAtTime(30, now + 0.25);

        boomGain.gain.setValueAtTime(0.28, now);
        boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        boomOsc.connect(boomGain);
        boomGain.connect(audioCtx.destination);
        boomOsc.start(now);
        boomOsc.stop(now + 0.3);

        // 2. Crackling burst (7-9 crispy snaps)
        const popCount = 8;
        for (let i = 0; i < popCount; i++) {
            const popTime = now + 0.03 + (i * 0.032) + (Math.random() * 0.025);
            const bufferSize = Math.floor(audioCtx.sampleRate * 0.025);
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let j = 0; j < bufferSize; j++) {
                data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufferSize * 0.35));
            }

            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(1000 + Math.random() * 1500, popTime);

            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.18, popTime);
            gain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.025);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            noise.start(popTime);
        }
    } catch (e) {}
}

// --------------------------------------------------------------------------
// 4. SECTION 1: CAKE CUTTING & GLOWING BALLOON CELEBRATION
// --------------------------------------------------------------------------
function initCakeExperience() {
    const btnBlow = document.getElementById('btn-blow');
    const btnCut = document.getElementById('btn-cut');
    const cakeStatusMsg = document.getElementById('cake-status-msg');
    const cakeKnife = document.getElementById('cake-knife');
    const cutSlice = document.getElementById('cut-slice');
    const cakeUnlockPrompt = document.getElementById('cake-unlock-prompt');
    const flameWrappers = document.querySelectorAll('.flame-wrapper');

    let candlesBlown = false;
    let cakeCut = false;

    // Step 1: Blow Candles
    btnBlow.addEventListener('click', () => {
        if (candlesBlown) return;
        candlesBlown = true;

        playBlowSound();

        // Extinguish flames with smoke puff
        flameWrappers.forEach((fw, index) => {
            setTimeout(() => {
                fw.classList.add('extinguished');
                createSmokePuff(fw);
            }, index * 90);
        });

        // Trigger gentle confetti spark
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 25,
                spread: 40,
                origin: { y: 0.6 },
                colors: ['#ff0040', '#ffd166', '#ffffff']
            });
        }

        cakeStatusMsg.textContent = "✨ Your wish has been made! Now grab the knife and slice the cake! 🔪";
        btnBlow.classList.add('disabled');
        btnBlow.disabled = true;

        btnCut.classList.remove('disabled');
        btnCut.disabled = false;
        btnCut.focus();

        showToast("🕯️ Candles blown! Make a secret wish ❤️");
    });

    // Step 2: Cut Cake
    btnCut.addEventListener('click', () => {
        if (cakeCut || !candlesBlown) return;
        cakeCut = true;

        // Animate Knife
        cakeKnife.classList.add('animate-slice');
        playSliceChime();

        setTimeout(() => {
            cutSlice.classList.add('sliced');
            // Trigger spectacular firecrackers & fireworks blast!
            triggerFirecrackerShow();
            // Confetti Cannons
            triggerBigConfetti();
        }, 500);

        btnCut.classList.add('disabled');
        btnCut.disabled = true;
        cakeStatusMsg.textContent = "🎉 Happy Birthday! The celebration has officially begun! 🎈";

        // Start background music automatically if not already playing!
        if (!isMusicPlaying) {
            toggleMusic();
        }

        // Trigger Rising Glowing Balloons
        triggerBalloonStorm();

        // Unlock Next Section (Letter)
        unlockSection('letter');

        setTimeout(() => {
            cakeUnlockPrompt.classList.remove('hidden');
            cakeUnlockPrompt.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 2200);

        showToast("🎂 Cake sliced! Chapter II Letter unlocked! 💌");
    });
}

function createSmokePuff(parentElement) {
    const puff = document.createElement('div');
    puff.className = 'smoke-puff';
    puff.style.setProperty('--smoke-x', `${(Math.random() - 0.5) * 20}px`);
    parentElement.appendChild(puff);
    setTimeout(() => puff.remove(), 1200);
}

// Confetti Blast
function triggerBigConfetti() {
    if (typeof confetti !== 'function') return;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 90 : 200;
    const defaults = {
        origin: { y: 0.7 },
        colors: ['#ff0040', '#ff2b66', '#c40032', '#ffd166', '#ffffff', '#800020']
    };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }

    fire(0.25, { spread: 26, startVelocity: isMobile ? 40 : 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    if (!isMobile) {
        fire(0.1, { spread: 120, startVelocity: 45 });
    }
}

// Ambient Screen Flash for Firecracker Explosions
let crackerFlashTimer = null;
function triggerCrackerFlash() {
    const flashEl = document.getElementById('cracker-flash');
    if (!flashEl) return;

    if (crackerFlashTimer) {
        clearTimeout(crackerFlashTimer);
    }
    flashEl.classList.add('active');
    crackerFlashTimer = setTimeout(() => {
        flashEl.classList.remove('active');
        crackerFlashTimer = null;
    }, 90);
}

// Multi-Stage Firecracker Blasting Show (Sparks, Sounds, Flashes & Sky Aerials)
function triggerFirecrackerShow() {
    if (typeof confetti !== 'function') return;

    const isMobile = window.innerWidth < 768;
    const cakeContainer = document.querySelector('.cake-container') || document.querySelector('.cake-stand') || document.getElementById('cake-knife');

    let cakeX = 0.5;
    let cakeY = 0.62;
    if (cakeContainer) {
        const rect = cakeContainer.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            cakeX = Math.max(0.15, Math.min(0.85, (rect.left + rect.width / 2) / window.innerWidth));
            cakeY = Math.max(0.2, Math.min(0.85, (rect.top + rect.height * 0.45) / window.innerHeight));
        }
    }

    const crackerPalettes = [
        ['#ffd700', '#ff0040', '#ffffff', '#ff9f1c', '#ff007f'], // Gold & Ruby Spark
        ['#ff0055', '#4cc9f0', '#ffffff', '#ffd166', '#b5179e'], // Neon Rainbow Blast
        ['#ff9900', '#ff3366', '#ffff80', '#ffffff', '#ff0033'], // Fiery Ember Cracker
        ['#7209b7', '#f72585', '#4cc9f0', '#ffd700', '#ffffff'], // Electric Starlight
        ['#ff0040', '#ffd700', '#ffffff', '#ff6b6b', '#ffe66d']  // Golden Grand Finale
    ];

    function fireSingleCrackerBurst(x, y, palette, particleMult = 1, isFountain = false) {
        triggerCrackerFlash();
        playFirecrackerBlastSound();

        const baseCount = isMobile ? 45 : 85;
        const count = Math.floor(baseCount * particleMult);

        if (isFountain) {
            // Upward spark fountain from the cake / ground
            confetti({
                particleCount: Math.floor(count * 0.8),
                angle: 90,
                spread: 65,
                origin: { x, y },
                startVelocity: isMobile ? 38 : 50,
                decay: 0.92,
                gravity: 1.15,
                colors: palette,
                shapes: ['circle', 'square'],
                ticks: 200,
                zIndex: 1000
            });
        }

        // 360-degree radial crackle explosion
        confetti({
            particleCount: count,
            angle: 90,
            spread: 360,
            origin: { x, y },
            startVelocity: isMobile ? 26 : 38,
            decay: 0.90,
            gravity: 0.95,
            scalar: 0.9,
            colors: palette,
            shapes: ['circle'],
            ticks: 180,
            zIndex: 1000
        });
    }

    // Stage 1: Immediate explosive spark fountain bursting straight from the cake slice
    fireSingleCrackerBurst(cakeX, cakeY, crackerPalettes[0], 1.25, true);

    // Stage 2: Sequential Aerial Firecracker Bursts popping across the sky
    const aerialBursts = [
        { delay: 300, x: isMobile ? 0.25 : 0.22, y: 0.30, palette: crackerPalettes[1], mult: 0.9 },
        { delay: 620, x: isMobile ? 0.75 : 0.78, y: 0.26, palette: crackerPalettes[2], mult: 0.95 },
        { delay: 960, x: isMobile ? 0.32 : 0.36, y: 0.20, palette: crackerPalettes[3], mult: 1.0 },
        { delay: 1300, x: isMobile ? 0.68 : 0.65, y: 0.23, palette: crackerPalettes[4], mult: 1.05 },
        // Stage 3: Grand Finale Double Starburst at 1700ms
        { delay: 1700, x: 0.50, y: 0.18, palette: crackerPalettes[0], mult: 1.35, isFountain: true }
    ];

    aerialBursts.forEach(burst => {
        setTimeout(() => {
            fireSingleCrackerBurst(burst.x, burst.y, burst.palette, burst.mult, !!burst.isFountain);
        }, burst.delay);
    });
}

// Glowing Colorful Balloons Release Engine
function triggerBalloonStorm() {
    const container = document.getElementById('balloons-container');
    if (!container) return;

    const balloonColors = [
        // Vibrant Ruby Red
        { bg: 'radial-gradient(circle at 35% 35%, #ff4d6d, #c40032, #5a0017)', glow: 'rgba(255, 0, 64, 0.75)' },
        // Electric Hot Pink / Magenta
        { bg: 'radial-gradient(circle at 35% 35%, #ff3898, #ff0077, #7a0039)', glow: 'rgba(255, 0, 119, 0.85)' },
        // Neon Violet / Purple
        { bg: 'radial-gradient(circle at 35% 35%, #b5179e, #7209b7, #3a0ca3)', glow: 'rgba(181, 23, 158, 0.8)' },
        // Radiant Solar Gold
        { bg: 'radial-gradient(circle at 35% 35%, #ffe66d, #ffd166, #b07d00)', glow: 'rgba(255, 209, 102, 0.85)' },
        // Electric Cyan / Turquoise
        { bg: 'radial-gradient(circle at 35% 35%, #4cc9f0, #00b4d8, #005f73)', glow: 'rgba(76, 201, 240, 0.85)' },
        // Emerald Glow
        { bg: 'radial-gradient(circle at 35% 35%, #57cc99, #38a3a5, #13505b)', glow: 'rgba(87, 204, 153, 0.8)' },
        // Neon Sunset Coral / Tangerine
        { bg: 'radial-gradient(circle at 35% 35%, #ff7b00, #ff5400, #9e2a2b)', glow: 'rgba(255, 123, 0, 0.85)' },
        // Royal Sapphire Blue
        { bg: 'radial-gradient(circle at 35% 35%, #4361ee, #3a0ca3, #1e0066)', glow: 'rgba(67, 97, 238, 0.85)' },
        // Pearl Rose Gold
        { bg: 'radial-gradient(circle at 35% 35%, #ffcad4, #f4acb7, #9d0208)', glow: 'rgba(244, 172, 183, 0.8)' },
        // Deep Crimson Velvet
        { bg: 'radial-gradient(circle at 35% 35%, #ff0040, #9d0208, #370617)', glow: 'rgba(255, 0, 64, 0.85)' }
    ];

    const isMobile = window.innerWidth < 480;
    const isTablet = window.innerWidth < 768;
    // Reduced balloon count for an airy, elegant, lag-free celebration
    const balloonCount = isMobile ? 6 : (isTablet ? 10 : 16);
    const staggerInterval = isMobile ? 320 : (isTablet ? 240 : 180);

    for (let i = 0; i < balloonCount; i++) {
        setTimeout(() => {
            const wrapper = document.createElement('div');
            wrapper.className = 'balloon-wrapper';

            const b = document.createElement('div');
            b.className = 'balloon';

            const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
            const size = isMobile 
                ? Math.floor(Math.random() * 18) + 40   // 40px to 58px on mobile
                : Math.floor(Math.random() * 26) + 48;  // 48px to 74px on desktop

            // Keep within visible margins to prevent edge clipping
            const minLeft = isMobile ? 8 : 5;
            const maxLeft = isMobile ? 82 : 90;
            const left = Math.random() * (maxLeft - minLeft) + minLeft;

            // Slower, smooth float duration (6.0s to 7.5s on mobile)
            const duration = isMobile 
                ? Math.random() * 1.5 + 6.0 
                : Math.random() * 1.8 + 5.5;

            // Gentle sway parameters
            const swayDistance = isMobile ? Math.floor(Math.random() * 6) + 6 : Math.floor(Math.random() * 10) + 8;
            const swayRot = isMobile ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * 4) + 4;
            const swayDuration = Math.random() * 1.0 + 2.2;

            wrapper.style.left = `${left}vw`;
            wrapper.style.setProperty('--duration', `${duration.toFixed(2)}s`);

            b.style.width = `${size}px`;
            b.style.height = `${Math.floor(size * 1.25)}px`;
            b.style.background = color.bg;
            b.style.setProperty('--glow-color', color.glow);
            b.style.setProperty('--sway-duration', `${swayDuration.toFixed(2)}s`);
            b.style.setProperty('--sway-left', `-${swayDistance}px`);
            b.style.setProperty('--sway-right', `${swayDistance}px`);
            b.style.setProperty('--rot-left', `-${swayRot}deg`);
            b.style.setProperty('--rot-right', `${swayRot}deg`);

            // Inner shine highlight
            const shine = document.createElement('div');
            shine.className = 'balloon-shine';
            b.appendChild(shine);

            // Knot
            const knot = document.createElement('div');
            knot.className = 'balloon-knot';
            b.appendChild(knot);

            wrapper.appendChild(b);

            // Pop interaction: fades out immediately without touching transform (no downward teleport!)
            let isPopped = false;
            const popBalloon = (e) => {
                if (e) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                if (isPopped) return;
                isPopped = true;

                playPopSound();
                if (typeof confetti === 'function') {
                    const rect = b.getBoundingClientRect();
                    confetti({
                        particleCount: isMobile ? 10 : 16,
                        origin: {
                            x: (rect.left + rect.width / 2) / window.innerWidth,
                            y: (rect.top + rect.height / 2) / window.innerHeight
                        },
                        colors: ['#ff0040', '#ffd166', '#ffffff', '#ff00aa', '#00e5ff']
                    });
                }

                wrapper.style.pointerEvents = 'none';
                wrapper.style.opacity = '0';
                wrapper.style.transition = 'opacity 0.15s ease';
                setTimeout(() => {
                    if (wrapper.parentElement) wrapper.remove();
                }, 160);
            };

            wrapper.addEventListener('pointerdown', popBalloon, { passive: false });
            wrapper.addEventListener('click', popBalloon);

            // Automatically clean up when the balloon finishes floating off the top
            wrapper.addEventListener('animationend', () => {
                if (wrapper.parentElement) wrapper.remove();
            });

            // Backup timer cleanup
            setTimeout(() => {
                if (wrapper.parentElement) wrapper.remove();
            }, (duration + 1) * 1000);

            container.appendChild(wrapper);

        }, i * staggerInterval);
    }
}

// --------------------------------------------------------------------------
// 5. SECTION 2: ENVELOPE & COMPUTER TYPEWRITER LETTER
// --------------------------------------------------------------------------
let letterTypingTimer = null;
let isLetterTyping = false;

function initLetterExperience() {
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const envelopeBox = document.getElementById('envelope-box');
    const openedLetter = document.getElementById('opened-letter');
    const skipBtn = document.getElementById('skip-typing-btn');

    if (!envelopeWrapper) return;

    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            skipLetterTypewriter();
        });
    }

    envelopeWrapper.addEventListener('click', () => {
        if (envelopeBox.classList.contains('open')) return;
        envelopeBox.classList.add('open');
        playSliceChime();

        setTimeout(() => {
            openedLetter.classList.remove('hidden');
            if (skipBtn) skipBtn.classList.remove('hidden');
            openedLetter.scrollIntoView({ behavior: 'smooth', block: 'start' });
            showToast("💌 Letter opened for you ❤️");

            // Start computer typewriter effect
            startLetterTypewriter();
        }, 600);
    });
}

function startLetterTypewriter() {
    if (isLetterTyping) return;
    isLetterTyping = true;

    const letterSalutation = document.getElementById('letter-salutation');
    const letterBody = document.getElementById('letter-body');

    const salutationText = (typeof CONFIG !== 'undefined' && CONFIG.letter && CONFIG.letter.salutation) 
        ? CONFIG.letter.salutation 
        : "Dearest,";
    const paragraphs = (typeof CONFIG !== 'undefined' && CONFIG.letter && Array.isArray(CONFIG.letter.paragraphs)) 
        ? CONFIG.letter.paragraphs 
        : [];

    if (letterSalutation) letterSalutation.innerHTML = '<span class="typing-cursor">|</span>';
    if (letterBody) letterBody.innerHTML = '';

    // First type salutation
    let charIndex = 0;
    function typeSalutation() {
        if (charIndex < salutationText.length) {
            charIndex++;
            if (letterSalutation) {
                letterSalutation.innerHTML = escapeHTML(salutationText.substring(0, charIndex)) + '<span class="typing-cursor">|</span>';
            }
            playTypewriterTick();
            letterTypingTimer = setTimeout(typeSalutation, 45 + Math.random() * 30);
        } else {
            // Salutation done, remove cursor from salutation
            if (letterSalutation) letterSalutation.innerHTML = escapeHTML(salutationText);
            // Start typing paragraphs
            typeNextParagraph(0);
        }
    }

    function typeNextParagraph(pIndex) {
        if (pIndex >= paragraphs.length) {
            finishLetterTypewriting();
            return;
        }

        const pText = paragraphs[pIndex];
        const pElem = document.createElement('p');
        if (letterBody) letterBody.appendChild(pElem);

        let pCharIdx = 0;
        function typeParagraphChar() {
            if (pCharIdx < pText.length) {
                pCharIdx++;
                pElem.innerHTML = escapeHTML(pText.substring(0, pCharIdx)) + '<span class="typing-cursor">|</span>';
                if (pCharIdx % 2 === 0) playTypewriterTick();
                letterTypingTimer = setTimeout(typeParagraphChar, 20 + Math.random() * 15);
            } else {
                pElem.innerHTML = escapeHTML(pText);
                letterTypingTimer = setTimeout(() => typeNextParagraph(pIndex + 1), 350);
            }
        }

        typeParagraphChar();
    }

    letterTypingTimer = setTimeout(typeSalutation, 400);
}

function skipLetterTypewriter() {
    clearTimeout(letterTypingTimer);
    finishLetterTypewriting(true);
}

function finishLetterTypewriting(wasSkipped = false) {
    isLetterTyping = false;
    clearTimeout(letterTypingTimer);

    const letterSalutation = document.getElementById('letter-salutation');
    const letterBody = document.getElementById('letter-body');
    const letterClosing = document.getElementById('letter-closing');
    const letterPolaroids = document.getElementById('letter-polaroids');
    const letterCta = document.getElementById('letter-cta-container');
    const skipBtn = document.getElementById('skip-typing-btn');

    if (skipBtn) skipBtn.classList.add('hidden');

    const salutationText = (typeof CONFIG !== 'undefined' && CONFIG.letter && CONFIG.letter.salutation) 
        ? CONFIG.letter.salutation 
        : "Dearest,";
    const paragraphs = (typeof CONFIG !== 'undefined' && CONFIG.letter && Array.isArray(CONFIG.letter.paragraphs)) 
        ? CONFIG.letter.paragraphs 
        : [];

    if (letterSalutation) letterSalutation.innerHTML = escapeHTML(salutationText);
    if (letterBody) {
        letterBody.innerHTML = paragraphs.map(p => `<p>${escapeHTML(p)}</p>`).join('');
    }

    // Reveal closing, polaroids, and quiz CTA
    if (letterClosing) letterClosing.classList.remove('hidden');
    if (letterPolaroids) letterPolaroids.classList.remove('hidden');
    if (letterCta) letterCta.classList.remove('hidden');

    // Unlock Section 3: Quiz!
    unlockSection('quiz');

    // Celebration
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 30,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#ff0040', '#ff2b66', '#ffd166']
        });
    }

    showToast(wasSkipped ? "⚡ Full letter revealed! Chapter III Quiz unlocked! 🏆" : "✨ Letter finished! Chapter III Quiz unlocked! 🏆");
}

// --------------------------------------------------------------------------
// 6. SECTION 3: FRIENDSHIP TRIVIA & QUESTIONS
// --------------------------------------------------------------------------
let currentQuestionIndex = 0;
let userScore = 0;

function initQuizEngine() {
    if (typeof CONFIG === 'undefined' || !Array.isArray(CONFIG.quiz) || CONFIG.quiz.length === 0) return;

    renderQuizQuestion(0);

    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentQuestionIndex++;
            if (currentQuestionIndex < CONFIG.quiz.length) {
                renderQuizQuestion(currentQuestionIndex);
            } else {
                showQuizResults();
            }
        });
    }
}

function renderQuizQuestion(index) {
    const qData = CONFIG.quiz[index];
    const totalQ = CONFIG.quiz.length;

    const counter = document.getElementById('quiz-counter');
    const progressBar = document.getElementById('quiz-progress-bar');
    const questionTitle = document.getElementById('quiz-question-title');
    const optionsContainer = document.getElementById('quiz-options-container');
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const actionContainer = document.getElementById('quiz-action-container');

    if (!qData) return;

    if (counter) counter.textContent = `Question ${index + 1} of ${totalQ}`;
    if (progressBar) progressBar.style.width = `${((index + 1) / totalQ) * 100}%`;
    if (questionTitle) questionTitle.textContent = qData.question;

    if (feedbackBox) feedbackBox.classList.add('hidden');
    if (actionContainer) actionContainer.classList.add('hidden');

    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        qData.options.forEach((optText, optIdx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.innerHTML = `<span>${escapeHTML(optText)}</span> <span class="opt-badge">✨</span>`;
            
            btn.addEventListener('click', () => {
                handleQuizSelection(optIdx, qData, btn);
            });
            optionsContainer.appendChild(btn);
        });
    }
}

function handleQuizSelection(selectedIdx, qData, clickedBtn) {
    const allOptionBtns = document.querySelectorAll('.quiz-option-btn');
    allOptionBtns.forEach(btn => btn.disabled = true);

    const feedbackBox = document.getElementById('quiz-feedback-box');
    const feedbackText = document.getElementById('feedback-text');
    const actionContainer = document.getElementById('quiz-action-container');

    clickedBtn.classList.add('selected-correct');
    userScore++;
    playSliceChime();

    if (typeof confetti === 'function') {
        confetti({
            particleCount: 20,
            spread: 50,
            origin: { y: 0.6 },
            colors: ['#ff0040', '#00ff73', '#ffd166']
        });
    }

    if (feedbackBox && feedbackText) {
        feedbackText.textContent = qData.feedback || "Awesome choice! ✨";
        feedbackBox.classList.remove('hidden');
    }

    if (actionContainer) {
        actionContainer.classList.remove('hidden');
    }
}

function showQuizResults() {
    const quizCard = document.getElementById('quiz-card');
    const resultsCard = document.getElementById('quiz-results-card');

    if (quizCard) quizCard.classList.add('hidden');
    if (resultsCard) {
        resultsCard.classList.remove('hidden');
        triggerBigConfetti();
        
        // Unlock Section 4 (Timeline of Memories & Words for Me)
        unlockSection('memories');
        
        resultsCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast("🏆 All questions complete! Chapter IV Memories unlocked! ✨");
    }
}

// --------------------------------------------------------------------------
// 7. SECTION 4: TIMELINE & LIGHTBOX
// --------------------------------------------------------------------------
function initTimeline() {
    if (typeof CONFIG === 'undefined' || !Array.isArray(CONFIG.timeline)) return;

    const container = document.getElementById('timeline-container');
    if (!container) return;

    container.innerHTML = '';

    CONFIG.timeline.forEach((item, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'timeline-card-wrapper';

        wrapper.innerHTML = `
            <div class="timeline-node"></div>
            <div class="timeline-card">
                ${item.tag ? `<span class="timeline-tag">${escapeHTML(item.tag)}</span>` : ''}
                <div class="timeline-date">${escapeHTML(item.date)}</div>
                <h4 class="timeline-card-title">${escapeHTML(item.title)}</h4>
                ${item.image ? `
                    <div class="timeline-img-box" data-img="${escapeHTML(item.image)}" data-caption="${escapeHTML(item.title)}">
                        <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" loading="lazy">
                    </div>
                ` : ''}
                <p class="timeline-desc">${escapeHTML(item.description)}</p>
            </div>
        `;

        container.appendChild(wrapper);
    });

    // Lightbox modal setup
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    document.querySelectorAll('.timeline-img-box').forEach(box => {
        box.addEventListener('click', () => {
            const imgSrc = box.getAttribute('data-img');
            const caption = box.getAttribute('data-caption');
            if (lightboxImg && lightboxCaption && lightboxModal) {
                lightboxImg.src = imgSrc;
                lightboxCaption.textContent = caption;
                lightboxModal.classList.remove('hidden');
            }
        });
    });

    if (lightboxClose && lightboxModal) {
        lightboxClose.addEventListener('click', () => lightboxModal.classList.add('hidden'));
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) lightboxModal.classList.add('hidden');
        });
    }
}

// --------------------------------------------------------------------------
// 8. PART B: "WORDS FOR ME" PERSONAL EMAIL DISPATCH FORM
// --------------------------------------------------------------------------
function initReplyForm() {
    const form = document.getElementById('reply-form');
    if (!form) return;

    // Recipient Selector (Dinesh, Kireeti, Bhargavi)
    const recipientChips = document.querySelectorAll('.recipient-chip');
    const recipientInput = document.getElementById('selected-recipient-input');
    const replyTitleTarget = document.getElementById('reply-title-target');
    const targetMemName = document.getElementById('target-recipient-mem-name');
    const targetMsgName = document.getElementById('target-recipient-msg-name');
    const btnSubmitText = document.getElementById('btn-submit-text');
    const favMemoryInput = document.getElementById('input-fav-memory');
    const messageInput = document.getElementById('input-message');

    function getRecipientData(key) {
        if (typeof CONFIG !== 'undefined' && CONFIG.recipients && CONFIG.recipients[key]) {
            return CONFIG.recipients[key];
        }
        const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
        return {
            name: capitalized,
            avatar: "✨",
            email: (typeof CONFIG !== 'undefined' && CONFIG.yourEmail) ? CONFIG.yourEmail : "gdinesh1616@gmail.com",
            formspreeEndpoint: ""
        };
    }

    function updateRecipientUI(key) {
        const rec = getRecipientData(key);
        if (replyTitleTarget) replyTitleTarget.textContent = rec.name;
        if (targetMemName) targetMemName.textContent = rec.name;
        if (targetMsgName) targetMsgName.textContent = rec.name;
        if (btnSubmitText) btnSubmitText.textContent = `Send This Note To ${rec.name}`;
        if (favMemoryInput) favMemoryInput.placeholder = `e.g. That time when ${rec.name} and I...`;
        if (messageInput) messageInput.placeholder = `Write anything from the heart for ${rec.name}...`;
    }

    recipientChips.forEach(chip => {
        chip.addEventListener('click', () => {
            recipientChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const key = chip.getAttribute('data-recipient') || 'dinesh';
            if (recipientInput) recipientInput.value = key;
            updateRecipientUI(key);
        });
    });

    // Mood Selector
    const moodBtns = document.querySelectorAll('.mood-btn');
    const moodInput = document.getElementById('selected-mood-input');

    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            moodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (moodInput) moodInput.value = btn.getAttribute('data-mood');
        });
    });

    // Form Submission & Multi-Recipient Delivery
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('btn-submit-note');
        const spinner = document.getElementById('submit-spinner');
        const feedbackBox = document.getElementById('form-feedback-box');
        const feedbackHead = document.getElementById('form-feedback-head');
        const feedbackDesc = document.getElementById('form-feedback-desc');

        const recipientKey = recipientInput ? recipientInput.value : 'dinesh';
        const rec = getRecipientData(recipientKey);
        const favMemory = favMemoryInput ? favMemoryInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';
        const mood = moodInput ? moodInput.value : '🥰 Loved';

        if (!message || !favMemory) {
            alert(`Please share a memory and message for ${rec.name}!`);
            return;
        }

        // Loading State
        submitBtn.disabled = true;
        if (spinner) spinner.classList.remove('hidden');
        if (btnSubmitText) btnSubmitText.textContent = `Sending to ${rec.name}...`;

        const hasFormspree = rec.formspreeEndpoint && rec.formspreeEndpoint.trim() !== '';
        const endpoint = hasFormspree ? rec.formspreeEndpoint.trim() : null;

        if (endpoint) {
            // Direct submission via personal Formspree endpoint
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        recipient: rec.name,
                        mood: mood,
                        favorite_memory: favMemory,
                        message: message,
                        sent_from: 'Birthday Wishes Website'
                    })
                });

                if (response.ok) {
                    showSuccessState(rec);
                } else {
                    await tryFormSubmitOrFallback(rec, mood, favMemory, message);
                }
            } catch (err) {
                console.error("Formspree error:", err);
                await tryFormSubmitOrFallback(rec, mood, favMemory, message);
            }
        } else {
            // Direct inbox forwarding via FormSubmit.co API or fallback
            await tryFormSubmitOrFallback(rec, mood, favMemory, message);
        }

        async function tryFormSubmitOrFallback(recipient, m, mem, msg) {
            const email = (recipient.email && recipient.email.trim() !== '') ? recipient.email.trim() : 'gdinesh1616@gmail.com';
            const isPlaceholder = email.includes('YOUR_EMAIL_HERE') || email.includes('_email@gmail.com') || email.includes('example.com');

            if (!isPlaceholder) {
                try {
                    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            _subject: `💌 Birthday Note for ${recipient.name} (${m})`,
                            recipient: recipient.name,
                            mood: m,
                            favorite_memory: mem,
                            message: msg
                        })
                    });

                    if (response.ok) {
                        showSuccessState(recipient);
                        return;
                    }
                } catch (err) {
                    console.warn("FormSubmit fetch issue, using email client fallback", err);
                }
            }

            // Direct mailto client fallback targeted specifically to that recipient
            handleEmailFallback(recipient, m, mem, msg);
        }

        function showSuccessState(recipient, isMailto = false) {
            if (spinner) spinner.classList.add('hidden');
            form.classList.add('hidden');
            if (feedbackBox) {
                feedbackBox.classList.remove('hidden');
                feedbackHead.textContent = `Note for ${recipient.name} Sent! ❤️`;
                feedbackDesc.textContent = isMailto
                    ? `Your personal message for ${recipient.name} (${recipient.email}) has been prepared! Your email client was opened and the text was copied to your clipboard.`
                    : `Your heartfelt message and memory have been dispatched directly to ${recipient.name}'s personal inbox (${recipient.email})!`;
            }
            triggerBigConfetti();
            showToast(`💌 Note sent to ${recipient.name}! ✨`);
        }

        function handleEmailFallback(recipient, m, mem, msg) {
            if (spinner) spinner.classList.add('hidden');
            submitBtn.disabled = false;
            if (btnSubmitText) btnSubmitText.textContent = `Send This Note To ${recipient.name}`;

            const targetEmail = recipient.email || 'gdinesh1616@gmail.com';
            const subject = encodeURIComponent(`Birthday Note for ${recipient.name} (${m})`);
            const body = encodeURIComponent(`Hey ${recipient.name}!\n\nHere is my birthday note for you:\n\nMy Mood: ${m}\n\nA Memory With You I'll Never Forget:\n${mem}\n\nMy Message For You:\n${msg}\n\nWith lots of love ❤️`);
            const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

            if (navigator.clipboard) {
                navigator.clipboard.writeText(`Note for ${recipient.name}\nMood: ${m}\nMemory: ${mem}\nMessage: ${msg}`);
            }

            window.open(mailtoUrl, '_blank');
            showSuccessState(recipient, true);
        }
    });

    // "Send a Note to Another Friend" Reset Action
    const btnWriteAnother = document.getElementById('btn-write-another');
    if (btnWriteAnother) {
        btnWriteAnother.addEventListener('click', () => {
            if (favMemoryInput) favMemoryInput.value = '';
            if (messageInput) messageInput.value = '';

            const submitBtn = document.getElementById('btn-submit-note');
            const spinner = document.getElementById('submit-spinner');
            const feedbackBox = document.getElementById('form-feedback-box');

            if (spinner) spinner.classList.add('hidden');
            if (submitBtn) submitBtn.disabled = false;

            const currentKey = recipientInput ? recipientInput.value : 'dinesh';
            const rec = getRecipientData(currentKey);
            if (btnSubmitText) btnSubmitText.textContent = `Send This Note To ${rec.name}`;

            if (feedbackBox) feedbackBox.classList.add('hidden');
            form.classList.remove('hidden');

            form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }
}

// --------------------------------------------------------------------------
// 9. SCROLL SPY & NAVIGATION DOTS
// --------------------------------------------------------------------------
function initScrollSpy() {
    const sections = document.querySelectorAll('section');
    const dots = document.querySelectorAll('.section-indicator .dot');

    // Prevent jumping to locked sections via dots
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            if (dot.classList.contains('locked')) {
                e.preventDefault();
                showToast("🔒 Complete the current chapter first to unlock this! ✨");
            }
        });
    });

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            if (section.classList.contains('section-locked')) return;
            const sectionTop = section.offsetTop - 180;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        dots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('href') === `#${currentSectionId}`) {
                dot.classList.add('active');
            }
        });
    });
}

// --------------------------------------------------------------------------
// 10. TOAST NOTIFICATION HELPER
// --------------------------------------------------------------------------
let toastTimer = null;
function showToast(message) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}
