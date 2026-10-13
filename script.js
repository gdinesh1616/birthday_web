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
        if (letterSignoff) letterSignoff.textContent = CONFIG.letter.signOff || "With all my love,";
        if (letterSignature) letterSignature.textContent = CONFIG.letter.signature || CONFIG.senderName || "Dinesh";
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
    const particleCount = Math.min(width > 768 ? 60 : 30, 80);

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
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgb(${p.color})`;
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
        }, 500);

        btnCut.classList.add('disabled');
        btnCut.disabled = true;
        cakeStatusMsg.textContent = "🎉 Happy Birthday! The celebration has officially begun! 🎈";

        // Start background music automatically if not already playing!
        if (!isMusicPlaying) {
            toggleMusic();
        }

        // Trigger Big Celebration:
        // 1. Confetti Cannons
        triggerBigConfetti();

        // 2. Rising Glowing Balloons
        triggerBalloonStorm();

        // 3. Unlock Next Section (Letter)
        unlockSection('letter');

        setTimeout(() => {
            cakeUnlockPrompt.classList.remove('hidden');
            cakeUnlockPrompt.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 1200);

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

    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
        colors: ['#ff0040', '#ff2b66', '#c40032', '#ffd166', '#ffffff', '#800020']
    };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
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

    const balloonCount = window.innerWidth < 768 ? 26 : 42;

    for (let i = 0; i < balloonCount; i++) {
        setTimeout(() => {
            const b = document.createElement('div');
            b.className = 'balloon';

            const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
            const size = Math.floor(Math.random() * 35) + 50; // 50px to 85px
            const left = Math.random() * 95; // 0 to 95vw
            const duration = Math.random() * 2.2 + 3.8; // 3.8s to 6.0s (faster and brisk!)
            const sway = Math.random() * 12 + 6;

            b.style.width = `${size}px`;
            b.style.height = `${Math.floor(size * 1.25)}px`;
            b.style.left = `${left}vw`;
            b.style.background = color.bg;
            b.style.setProperty('--glow-color', color.glow);
            b.style.setProperty('--duration', `${duration}s`);
            b.style.setProperty('--sway-deg', `${sway}deg`);
            b.style.setProperty('--sway-deg-rev', `-${sway}deg`);

            // Inner shine highlight
            const shine = document.createElement('div');
            shine.className = 'balloon-shine';
            b.appendChild(shine);

            // Knot
            const knot = document.createElement('div');
            knot.className = 'balloon-knot';
            b.appendChild(knot);

            // Interactive Pop on Click
            b.addEventListener('click', (e) => {
                e.stopPropagation();
                playPopSound();
                if (typeof confetti === 'function') {
                    const rect = b.getBoundingClientRect();
                    confetti({
                        particleCount: 18,
                        origin: {
                            x: (rect.left + rect.width / 2) / window.innerWidth,
                            y: (rect.top + rect.height / 2) / window.innerHeight
                        },
                        colors: ['#ff0040', '#ffd166', '#ffffff', '#ff00aa', '#00e5ff']
                    });
                }
                b.style.transform = 'scale(1.4)';
                b.style.opacity = '0';
                setTimeout(() => b.remove(), 200);
            });

            container.appendChild(b);

            // Remove after finished floating
            setTimeout(() => {
                if (b.parentElement) b.remove();
            }, duration * 1000 + 500);

        }, i * 140);
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
// 8. PART B: "WORDS FOR ME" EMAIL DISPATCH FORM
// --------------------------------------------------------------------------
function initReplyForm() {
    const form = document.getElementById('reply-form');
    if (!form) return;

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

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('btn-submit-note');
        const submitText = document.getElementById('btn-submit-text');
        const spinner = document.getElementById('submit-spinner');
        const feedbackBox = document.getElementById('form-feedback-box');
        const feedbackHead = document.getElementById('form-feedback-head');
        const feedbackDesc = document.getElementById('form-feedback-desc');

        const favMemory = document.getElementById('input-fav-memory').value.trim();
        const message = document.getElementById('input-message').value.trim();
        const mood = moodInput ? moodInput.value : '🥰 Loved';

        if (!message || !favMemory) {
            alert('Please fill in both the memory and message fields!');
            return;
        }

        // Loading State
        submitBtn.disabled = true;
        if (spinner) spinner.classList.remove('hidden');
        if (submitText) submitText.textContent = "Sending your note...";

        const endpoint = (typeof CONFIG !== 'undefined' && CONFIG.formspreeEndpoint && CONFIG.formspreeEndpoint.trim() !== '')
            ? CONFIG.formspreeEndpoint.trim()
            : null;

        if (endpoint) {
            // Send via Formspree API
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        mood: mood,
                        favorite_memory: favMemory,
                        message: message,
                        sent_from: 'Birthday Wishes Website',
                        recipient: (typeof CONFIG !== 'undefined' && CONFIG.senderName) ? CONFIG.senderName : 'Dinesh'
                    })
                });

                if (response.ok) {
                    showSuccessState();
                } else {
                    handleEmailFallback(mood, favMemory, message);
                }
            } catch (err) {
                console.error("Formspree submission error:", err);
                handleEmailFallback(mood, favMemory, message);
            }
        } else {
            // Direct email / mailto fallback when endpoint is not configured yet
            handleEmailFallback(mood, favMemory, message);
        }

        function showSuccessState() {
            if (spinner) spinner.classList.add('hidden');
            form.classList.add('hidden');
            if (feedbackBox) {
                feedbackBox.classList.remove('hidden');
                feedbackHead.textContent = "Your Note Has Been Sent! ❤️";
                feedbackDesc.textContent = `Your heartfelt message and memory have been dispatched directly to ${CONFIG.senderName || 'Dinesh'}'s email.`;
            }
            triggerBigConfetti();
            showToast("💌 Note dispatched successfully! ✨");
        }

        function handleEmailFallback(m, mem, msg) {
            if (spinner) spinner.classList.add('hidden');
            submitBtn.disabled = false;
            if (submitText) submitText.textContent = "Send This Note To Dinesh";

            // Prepare email link
            const targetEmail = (typeof CONFIG !== 'undefined' && CONFIG.yourEmail) ? CONFIG.yourEmail : 'dinesh@example.com';
            const subject = encodeURIComponent(`Birthday Note for ${CONFIG.senderName || 'Dinesh'} (${m})`);
            const body = encodeURIComponent(`Hey ${CONFIG.senderName || 'Dinesh'},\n\nHere is my birthday note for you:\n\nMy Mood: ${m}\n\nA Memory I'll Never Forget:\n${mem}\n\nMy Message For You:\n${msg}\n\nWith love ❤️`);
            const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

            // Copy to clipboard for convenience
            if (navigator.clipboard) {
                navigator.clipboard.writeText(`Mood: ${m}\nMemory: ${mem}\nMessage: ${msg}`);
            }

            // Open user's email client
            window.open(mailtoUrl, '_blank');

            // Show confirmation
            showSuccessState();
            if (feedbackDesc) {
                feedbackDesc.textContent = `Note prepared! Your email app has been opened to send this directly to ${targetEmail} (and also copied to your clipboard!).`;
            }
        }
    });
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
