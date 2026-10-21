/**
 * Romantic Proposal Website Logic
 * - Runaway "Қарсымын" button stays strictly inside viewport at all times
 * - "Қарсы емеспін" celebration with massive heart explosions
 * - Full responsive touch adaptation for mobile devices
 * - Web Audio API synthesized romantic melody & cute sound effects
 */

// DOM Elements
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const noText = document.getElementById('no-text');
const buttonsArea = document.getElementById('buttons-area');
const questionState = document.getElementById('question-state');
const successState = document.getElementById('success-state');
const replayBtn = document.getElementById('replay-btn');
const catsContainer = document.getElementById('cats-container');
const soundToggle = document.getElementById('sound-toggle');
const soundIcon = document.getElementById('sound-icon');

// Canvases
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
const fireworksCanvas = document.getElementById('fireworks-canvas');
const fwCtx = fireworksCanvas.getContext('2d');

// State
let isSoundEnabled = true;
let dodgeCount = 0;
let isCelebrationActive = false;
let yesScale = 1;

// Playful evasive texts in Kazakh
const dodgeTexts = [
  "Қарсымын 🙈",
  "Мүмкін емес 😜",
  "Ұстай алмайсың! 🏃‍♂️💨",
  "Ой, байқамай қалдың! 🤭",
  "Тағы да қашып кетті! 💨",
  "Бұл басылмайды 😉",
  "Тек «Қарсы емеспін»! 💖",
  "Бағынсаңшы енді 🥺",
  "Қаша беремін 🕊️",
  "Жасыл/қызғылтты бас! ✨"
];

// ----------------------------------------------------
// 1. Web Audio API Sound Effects
// ----------------------------------------------------
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play cute dodge boing/pop
function playDodgeSound() {
  if (!isSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.1);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  } catch (e) {
    // Audio context fallback
  }
}

// Play celebratory magic chime arpeggio
function playCelebrationSound() {
  if (!isSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    });
  } catch (e) {}
}

// Toggle sound button
soundToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  isSoundEnabled = !isSoundEnabled;
  soundIcon.textContent = isSoundEnabled ? '🔊' : '🔇';
  if (isSoundEnabled) {
    getAudioContext();
  }
});

// ----------------------------------------------------
// 2. Runaway "Қарсымын" Button Logic (GUARANTEED VISIBLE ON SCREEN)
// ----------------------------------------------------
function moveNoButton() {
  if (isCelebrationActive) return;

  dodgeCount++;
  playDodgeSound();

  // If not already in body, append to document.body so CSS transforms on parents don't break positioning
  if (noBtn.parentElement !== document.body) {
    document.body.appendChild(noBtn);
  }

  noBtn.classList.add('running-away');

  // Update text with cute message
  const nextText = dodgeTexts[dodgeCount % dodgeTexts.length];
  noText.textContent = nextText;

  // Viewport dimensions (handles mobile browser chrome accurately)
  const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;

  const btnW = Math.max(noBtn.offsetWidth, 120);
  const btnH = Math.max(noBtn.offsetHeight, 46);

  // Safe padding from viewport boundaries
  const padLeft = 16;
  const padRight = 16;
  const padTop = 60; // leave room for sound toggle at top
  const padBottom = 80; // leave room for cats at bottom

  const minX = padLeft;
  const maxX = Math.max(minX, vw - btnW - padRight);

  const minY = padTop;
  const maxY = Math.max(minY, vh - btnH - padBottom);

  // Yes button bounding box to avoid landing right on top of "Қарсы емеспін"
  const yesRect = yesBtn.getBoundingClientRect();

  let targetX, targetY;
  let attempts = 0;

  do {
    targetX = Math.round(minX + Math.random() * (maxX - minX));
    targetY = Math.round(minY + Math.random() * (maxY - minY));
    attempts++;

    // Check collision with yesBtn
    const isOverlappingYes = (
      targetX < yesRect.right + 20 &&
      targetX + btnW > yesRect.left - 20 &&
      targetY < yesRect.bottom + 20 &&
      targetY + btnH > yesRect.top - 20
    );

    if (!isOverlappingYes || attempts > 10) break;
  } while (attempts < 12);

  // Ensure strict bounding so it never leaves the screen
  targetX = Math.max(minX, Math.min(targetX, maxX));
  targetY = Math.max(minY, Math.min(targetY, maxY));

  noBtn.style.left = `${targetX}px`;
  noBtn.style.top = `${targetY}px`;

  // Make the "Қарсы емеспін" button grow slightly
  if (yesScale < 1.35) {
    yesScale += 0.05;
    yesBtn.style.transform = `scale(${yesScale})`;
  }

  // Spawn mini floating particle
  spawnMiniParticle(targetX + btnW / 2, targetY + btnH / 2, ['😜', '💨', '🤭', '✨'][dodgeCount % 4]);
}

// Touch and Pointer Events for Desktop & Mobile
['mouseenter', 'mouseover', 'pointerenter', 'pointerdown', 'touchstart'].forEach(eventType => {
  noBtn.addEventListener(eventType, (e) => {
    e.preventDefault();
    e.stopPropagation();
    moveNoButton();
  }, { passive: false });
});

// Click prevention
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  moveNoButton();
});

// Proximity detection for desktop cursor
document.addEventListener('mousemove', (e) => {
  if (isCelebrationActive) return;
  const rect = noBtn.getBoundingClientRect();
  const btnCenterX = rect.left + rect.width / 2;
  const btnCenterY = rect.top + rect.height / 2;
  const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

  if (dist < 60) {
    moveNoButton();
  }
});

// Touch proximity: mobile finger drag towards button
document.addEventListener('touchmove', (e) => {
  if (isCelebrationActive || !e.touches || e.touches.length === 0) return;
  const touch = e.touches[0];
  const rect = noBtn.getBoundingClientRect();
  const btnCenterX = rect.left + rect.width / 2;
  const btnCenterY = rect.top + rect.height / 2;
  const dist = Math.hypot(touch.clientX - btnCenterX, touch.clientY - btnCenterY);

  if (dist < 70) {
    moveNoButton();
  }
}, { passive: true });

// ----------------------------------------------------
// 3. Acceptance & Celebration Logic
// ----------------------------------------------------
yesBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  isCelebrationActive = true;
  playCelebrationSound();

  // Hide question state and display success state
  questionState.classList.add('hidden');
  successState.classList.remove('hidden');

  // Hide the runaway button completely
  noBtn.style.display = 'none';

  // Trigger heart burst animations
  triggerCelebrationHearts();

  // Cats celebration animation
  catsContainer.classList.add('celebrating');
  const catBubble = document.getElementById('love-bubble');
  if (catBubble) {
    catBubble.innerHTML = '<span class="floating-heart" style="font-size:32px;">💖</span>';
  }
});

// Replay Button logic
replayBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  isCelebrationActive = false;
  dodgeCount = 0;
  yesScale = 1;
  yesBtn.style.transform = 'scale(1)';

  // Reset states
  questionState.classList.remove('hidden');
  successState.classList.add('hidden');

  // Put No button back into buttonsArea
  if (noBtn.parentElement !== buttonsArea) {
    buttonsArea.appendChild(noBtn);
  }
  noBtn.classList.remove('running-away');
  noBtn.style.display = 'inline-flex';
  noBtn.style.left = '';
  noBtn.style.top = '';
  noText.textContent = "Қарсымын";

  // Clear fireworks
  fireworksParticles = [];
  fwCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
});

// ----------------------------------------------------
// 4. Floating DOM Hearts Burst
// ----------------------------------------------------
function triggerCelebrationHearts() {
  const heartEmojis = ['💖', '💕', '❤️', '💗', '💓', '✨', '🌸', '🥰', '💌'];
  const count = 45;

  const cardRect = document.getElementById('main-card').getBoundingClientRect();
  const startX = cardRect.left + cardRect.width / 2;
  const startY = cardRect.top + cardRect.height / 2;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const heartEl = document.createElement('div');
      heartEl.className = 'floating-particle-heart';
      heartEl.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

      const angle = Math.random() * Math.PI * 2;
      const distance = 90 + Math.random() * 280;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 60;
      const rot = (Math.random() - 0.5) * 60;

      heartEl.style.left = `${startX}px`;
      heartEl.style.top = `${startY}px`;
      heartEl.style.setProperty('--dx', `${dx}px`);
      heartEl.style.setProperty('--dy', `${dy}px`);
      heartEl.style.setProperty('--rot', `${rot}deg`);
      heartEl.style.fontSize = `${20 + Math.random() * 26}px`;

      document.body.appendChild(heartEl);

      setTimeout(() => {
        heartEl.remove();
      }, 1600);
    }, i * 25);
  }

  // Also trigger canvas fireworks
  for (let b = 0; b < 6; b++) {
    setTimeout(() => {
      const rx = window.innerWidth * (0.2 + Math.random() * 0.6);
      const ry = window.innerHeight * (0.2 + Math.random() * 0.5);
      createFireworkBurst(rx, ry);
    }, b * 200);
  }
}

function spawnMiniParticle(x, y, emoji = '✨') {
  const el = document.createElement('div');
  el.className = 'floating-particle-heart';
  el.textContent = emoji;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.setProperty('--dx', `${(Math.random() - 0.5) * 80}px`);
  el.style.setProperty('--dy', `${-40 - Math.random() * 60}px`);
  el.style.setProperty('--rot', `${(Math.random() - 0.5) * 40}deg`);
  el.style.fontSize = '22px';
  document.body.appendChild(el);

  setTimeout(() => el.remove(), 1200);
}

// Click anywhere after celebration to spawn hearts
document.addEventListener('click', (e) => {
  if (!isCelebrationActive) return;
  if (e.target.closest('#replay-btn') || e.target.closest('#sound-toggle')) return;

  const heartEmojis = ['💖', '💕', '❤️', '✨', '🥰'];
  for (let i = 0; i < 4; i++) {
    const el = document.createElement('div');
    el.className = 'floating-particle-heart';
    el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    el.style.left = `${e.clientX || window.innerWidth / 2}px`;
    el.style.top = `${e.clientY || window.innerHeight / 2}px`;
    el.style.setProperty('--dx', `${(Math.random() - 0.5) * 100}px`);
    el.style.setProperty('--dy', `${-40 - Math.random() * 80}px`);
    el.style.setProperty('--rot', `${(Math.random() - 0.5) * 45}deg`);
    el.style.fontSize = `${18 + Math.random() * 16}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }
});

// Click on cute cats for a blush sound & heart
catsContainer.addEventListener('click', (e) => {
  const rect = catsContainer.getBoundingClientRect();
  spawnMiniParticle(rect.left + rect.width / 2, rect.top + 20, '💖');
  if (isSoundEnabled) {
    const ctx = getAudioContext();
    if (ctx) {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
      } catch (err) {}
    }
  }
});

// ----------------------------------------------------
// 5. Ambient Background Canvas Particles
// ----------------------------------------------------
let bgParticles = [];

function resizeCanvases() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvases);
window.addEventListener('orientationchange', () => {
  setTimeout(resizeCanvases, 200);
});
resizeCanvases();

class BgHeartParticle {
  constructor() {
    this.reset();
    this.y = Math.random() * bgCanvas.height;
  }

  reset() {
    this.x = Math.random() * bgCanvas.width;
    this.y = bgCanvas.height + 20;
    this.size = 10 + Math.random() * 18;
    this.speedY = 0.6 + Math.random() * 1.2;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.opacity = 0.2 + Math.random() * 0.45;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.02;
    this.color = Math.random() > 0.4 ? '#ff6584' : '#ffffff';
  }

  update() {
    this.y -= this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotSpeed;

    if (this.y < -30) {
      this.reset();
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;

    const s = this.size / 15;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-5 * s, -7 * s, -12 * s, -2 * s, -12 * s, 4 * s);
    ctx.bezierCurveTo(-12 * s, 10 * s, -5 * s, 15 * s, 0, 20 * s);
    ctx.bezierCurveTo(5 * s, 15 * s, 12 * s, 10 * s, 12 * s, 4 * s);
    ctx.bezierCurveTo(12 * s, -2 * s, 5 * s, -7 * s, 0, 0);
    ctx.fill();

    ctx.restore();
  }
}

for (let i = 0; i < 30; i++) {
  bgParticles.push(new BgHeartParticle());
}

// ----------------------------------------------------
// 6. Fireworks Canvas Particles
// ----------------------------------------------------
let fireworksParticles = [];

class FireworkParticle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 6;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.gravity = 0.12;
    this.alpha = 1;
    this.decay = 0.014 + Math.random() * 0.018;
    this.size = 3 + Math.random() * 4;
  }

  update() {
    this.vx *= 0.98;
    this.vy *= 0.98;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function createFireworkBurst(x, y) {
  const colors = ['#ff3366', '#ff6b8b', '#ff94b4', '#ffd1dc', '#ffffff', '#ffd700'];
  const pCount = 45;
  for (let i = 0; i < pCount; i++) {
    const col = colors[Math.floor(Math.random() * colors.length)];
    fireworksParticles.push(new FireworkParticle(x, y, col));
  }
}

// ----------------------------------------------------
// 7. Master Animation Loop
// ----------------------------------------------------
function animate() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  bgParticles.forEach(p => {
    p.update();
    p.draw(bgCtx);
  });

  fwCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
  for (let i = fireworksParticles.length - 1; i >= 0; i--) {
    const p = fireworksParticles[i];
    p.update();
    p.draw(fwCtx);
    if (p.alpha <= 0) {
      fireworksParticles.splice(i, 1);
    }
  }

  if (isCelebrationActive && Math.random() < 0.035) {
    const rx = window.innerWidth * (0.15 + Math.random() * 0.7);
    const ry = window.innerHeight * (0.15 + Math.random() * 0.6);
    createFireworkBurst(rx, ry);
  }

  requestAnimationFrame(animate);
}

animate();
