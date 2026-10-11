// ===================================================
// ANEL • RESUME & PORTFOLIO LOGIC
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const themeToggle = document.getElementById('themeToggle');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const quickPrintBtn = document.getElementById('quickPrintBtn');
  const printResumeBtn = document.getElementById('printResumeBtn');

  // Modal elements
  const editDataBtn = document.getElementById('editDataBtn');
  const editModal = document.getElementById('editModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const saveModalBtn = document.getElementById('saveModalBtn');

  // Document fields to update
  const heroCityBadge = document.getElementById('heroCityBadge');
  const docName = document.getElementById('docName');
  const docAge = document.getElementById('docAge');
  const docCity = document.getElementById('docCity');
  const docPhone = document.getElementById('docPhone');
  const docSchedule = document.getElementById('docSchedule');
  const cPhoneText = document.getElementById('cPhoneText');
  const cWaText = document.getElementById('cWaText');
  const cWaLink = document.getElementById('cWaLink');
  const cTgLink = document.getElementById('cTgLink');
  const heroWhatsAppBtn = document.getElementById('heroWhatsAppBtn');

  // Modal input fields
  const inputName = document.getElementById('inputName');
  const inputAge = document.getElementById('inputAge');
  const inputCity = document.getElementById('inputCity');
  const inputPhone = document.getElementById('inputPhone');
  const inputTelegram = document.getElementById('inputTelegram');
  const inputSchedule = document.getElementById('inputSchedule');

  // Form
  const offerForm = document.getElementById('offerForm');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  // 1. Theme Toggle
  const savedTheme = localStorage.getItem('anel_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('anel_theme', nextTheme);
      updateThemeIcon(nextTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
  }

  // 2. Mobile Menu Toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = navLinks.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    // Close on click link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  // 3. Print / PDF Resume
  const triggerPrint = () => {
    window.print();
  };

  if (quickPrintBtn) quickPrintBtn.addEventListener('click', triggerPrint);
  if (printResumeBtn) printResumeBtn.addEventListener('click', triggerPrint);

  // 4. LocalStorage Profile Data
  const defaultProfile = {
    name: 'Анель',
    age: '16 жаста',
    city: 'Алматы / Қазақстан',
    phone: '+7 777 123 45 67',
    telegram: 'anel_profile',
    schedule: 'Жартылай күн (Part-time), икемді кесте'
  };

  function loadProfile() {
    const data = JSON.parse(localStorage.getItem('anel_profile_data')) || defaultProfile;
    
    if (docName) docName.textContent = data.name;
    if (docAge) docAge.textContent = data.age;
    if (docCity) docCity.textContent = data.city;
    if (heroCityBadge) heroCityBadge.textContent = data.city;
    if (docPhone) docPhone.textContent = data.phone;
    if (docSchedule) docSchedule.textContent = data.schedule;
    if (cPhoneText) cPhoneText.textContent = data.phone;
    if (cWaText) cWaText.textContent = data.phone;

    // Update WhatsApp links with phone
    const cleanPhone = data.phone.replace(/[^0-9]/g, '');
    const defaultText = encodeURIComponent(`Сәлеметсіз бе, ${data.name}! Мен сіздің резюмеңізді көріп хабарласып тұрмын.`);
    
    if (cWaLink) {
      cWaLink.href = cleanPhone ? `https://wa.me/${cleanPhone}?text=${defaultText}` : `https://wa.me/?text=${defaultText}`;
    }
    if (heroWhatsAppBtn) {
      heroWhatsAppBtn.href = cleanPhone ? `https://wa.me/${cleanPhone}?text=${defaultText}` : `https://wa.me/?text=${defaultText}`;
    }

    // Telegram
    if (cTgLink) {
      const cleanTg = data.telegram.replace('@', '');
      cTgLink.href = `https://t.me/${cleanTg}`;
      const tgSpan = cTgLink.querySelector('span');
      if (tgSpan) tgSpan.textContent = `@${cleanTg}`;
    }

    // Prepopulate inputs
    if (inputName) inputName.value = data.name;
    if (inputAge) inputAge.value = data.age;
    if (inputCity) inputCity.value = data.city;
    if (inputPhone) inputPhone.value = data.phone;
    if (inputTelegram) inputTelegram.value = data.telegram;
    if (inputSchedule) inputSchedule.value = data.schedule;
  }

  loadProfile();

  // 5. Edit Modal Handling
  if (editDataBtn && editModal) {
    editDataBtn.addEventListener('click', () => {
      editModal.classList.add('active');
    });

    const closeModal = () => editModal.classList.remove('active');
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

    // Save
    if (saveModalBtn) {
      saveModalBtn.addEventListener('click', () => {
        const updatedData = {
          name: inputName.value.trim() || 'Анель',
          age: inputAge.value.trim() || '16 жаста',
          city: inputCity.value.trim() || 'Қазақстан',
          phone: inputPhone.value.trim() || '+7 (7XX) XXX-XX-XX',
          telegram: inputTelegram.value.trim() || 'anel_profile',
          schedule: inputSchedule.value.trim() || 'Жартылай күн, икемді кесте'
        };

        localStorage.setItem('anel_profile_data', JSON.stringify(updatedData));
        loadProfile();
        closeModal();
        showToast('Мәліметтер сәтті сақталды!');
      });
    }
  }

  // 6. Offer Form Submission -> WhatsApp Auto Generator
  if (offerForm) {
    offerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const company = document.getElementById('companyName').value.trim();
      const vacancy = document.getElementById('vacancySelect').value;
      const city = document.getElementById('workCity').value.trim();
      const message = document.getElementById('offerMessage').value.trim();

      const profile = JSON.parse(localStorage.getItem('anel_profile_data')) || defaultProfile;
      const cleanPhone = profile.phone.replace(/[^0-9]/g, '');

      let msgText = `Сәлеметсіз бе, ${profile.name}!\n\n`;
      msgText += `🏢 Ұйым/Компания: ${company}\n`;
      msgText += `💼 Ұсынылатын қызмет: ${vacancy}\n`;
      if (city) msgText += `📍 Қала/Мекенжай: ${city}\n`;
      if (message) msgText += `📝 Қосымша: ${message}\n`;
      msgText += `\nСізбен сұхбаттасу өткізгіміз келеді!`;

      const encodedMsg = encodeURIComponent(msgText);
      const waUrl = cleanPhone 
        ? `https://wa.me/${cleanPhone}?text=${encodedMsg}`
        : `https://wa.me/?text=${encodedMsg}`;

      window.open(waUrl, '_blank');
      showToast('WhatsApp хабарламасы ашылуда...');
    });
  }

  // 7. Toast helper
  function showToast(text) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = text;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // ===================================================
  // 8. ANIMATED BUTTERFLIES ENGINE (ҚОЗҒАЛЫП ТҰРАТЫН КӨБЕЛЕКТЕР)
  // ===================================================
  const butterflyContainer = document.getElementById('butterfliesContainer');
  const BUTTERFLY_COUNT = 9;
  
  const colorPalettes = [
    { c1: '#ff007f', c2: '#ff69b4', c3: '#ffe4e1' }, // Vivid Rose
    { c1: '#ff4081', c2: '#ff80ab', c3: '#fff0f5' }, // Sakura Pink
    { c1: '#e040fb', c2: '#f06292', c3: '#fce4ec' }, // Orchid Blossom
    { c1: '#ff1493', c2: '#ff758c', c3: '#ffebee' }  // Magenta Peach
  ];

  let butterflyIdCounter = 0;

  class Butterfly {
    constructor(container) {
      this.container = container;
      this.id = ++butterflyIdCounter;
      this.el = document.createElement('div');
      
      const pal = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
      this.scale = 0.65 + Math.random() * 0.45; // 0.65 to 1.1
      
      this.el.className = 'butterfly';
      this.el.innerHTML = `
        <div class="butterfly-inner">
          <svg class="wing wing-left" viewBox="0 0 30 46">
            <defs>
              <linearGradient id="bfGradL${this.id}" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="${pal.c1}"/>
                <stop offset="55%" stop-color="${pal.c2}"/>
                <stop offset="100%" stop-color="${pal.c3}"/>
              </linearGradient>
            </defs>
            <path d="M28,20 C28,8 20,1 10,2 C2,3 0,11 3,20 C6,27 20,25 28,20 Z" fill="url(#bfGradL${this.id})" stroke="rgba(255,255,255,0.75)" stroke-width="0.8"/>
            <path d="M28,21 C18,24 6,26 4,32 C2,39 12,45 20,43 C26,41 28,31 28,21 Z" fill="url(#bfGradL${this.id})" opacity="0.95" stroke="rgba(255,255,255,0.75)" stroke-width="0.8"/>
            <path d="M28,20 Q12,12 8,6 M28,20 Q10,18 5,16 M28,21 Q14,30 10,38" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="0.7"/>
          </svg>
          <div class="butterfly-body"></div>
          <svg class="wing wing-right" viewBox="0 0 30 46">
            <defs>
              <linearGradient id="bfGradR${this.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${pal.c1}"/>
                <stop offset="55%" stop-color="${pal.c2}"/>
                <stop offset="100%" stop-color="${pal.c3}"/>
              </linearGradient>
            </defs>
            <path d="M2,20 C2,8 10,1 20,2 C28,3 30,11 27,20 C24,27 10,25 2,20 Z" fill="url(#bfGradR${this.id})" stroke="rgba(255,255,255,0.75)" stroke-width="0.8"/>
            <path d="M2,21 C12,24 24,26 26,32 C28,39 18,45 10,43 C4,41 2,31 2,21 Z" fill="url(#bfGradR${this.id})" opacity="0.95" stroke="rgba(255,255,255,0.75)" stroke-width="0.8"/>
            <path d="M2,20 Q18,12 22,6 M2,20 Q20,18 25,16 M2,21 Q16,30 20,38" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="0.7"/>
          </svg>
        </div>
      `;
      this.container.appendChild(this.el);

      // Positioning
      this.x = Math.random() * (window.innerWidth - 60);
      this.y = Math.random() * (window.innerHeight - 60);
      this.targetX = Math.random() * (window.innerWidth - 60);
      this.targetY = Math.random() * (window.innerHeight - 60);

      this.speed = 1.3 + Math.random() * 1.5;
      this.angle = 0;
      this.phase = Math.random() * Math.PI * 2;
      this.sparkleTimer = 0;

      // Click to flutter away fast
      this.el.addEventListener('click', () => {
        this.targetX = Math.random() * window.innerWidth;
        this.targetY = Math.random() * window.innerHeight;
        this.speed = 4.5;
        setTimeout(() => { this.speed = 1.4; }, 1400);
      });
    }

    update(time) {
      this.phase += 0.04;
      
      // Distance to target
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 40) {
        // Pick new random waypoint
        this.targetX = 40 + Math.random() * (window.innerWidth - 120);
        this.targetY = 40 + Math.random() * (window.innerHeight - 120);
      }

      // Smooth steering towards target
      const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      
      // Smooth angle interpolation
      let diff = (targetAngle - this.angle) % 360;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      this.angle += diff * 0.05;

      // Velocity with natural sine bobbing
      const rad = (this.angle - 90) * (Math.PI / 180);
      const bobbing = Math.cos(this.phase) * 1.5;

      this.x += Math.cos(rad) * this.speed;
      this.y += Math.sin(rad) * this.speed + bobbing;

      // Keep within viewport boundaries
      if (this.x < -30) this.x = window.innerWidth;
      if (this.x > window.innerWidth + 30) this.x = -20;
      if (this.y < -30) this.y = window.innerHeight;
      if (this.y > window.innerHeight + 30) this.y = -20;

      // Render
      this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) rotate(${this.angle}deg) scale(${this.scale})`;

      // Periodic sparkles
      this.sparkleTimer++;
      if (this.sparkleTimer > 18 && Math.random() > 0.4) {
        this.sparkleTimer = 0;
        this.createSparkle(this.x + 20, this.y + 20);
      }
    }

    createSparkle(sx, sy) {
      if (!this.container) return;
      const sp = document.createElement('div');
      sp.className = 'butterfly-sparkle';
      sp.style.left = `${sx}px`;
      sp.style.top = `${sy}px`;
      this.container.appendChild(sp);
      setTimeout(() => sp.remove(), 1200);
    }
  }

  // Initialize butterflies
  if (butterflyContainer) {
    const butterflies = [];
    for (let i = 0; i < BUTTERFLY_COUNT; i++) {
      butterflies.push(new Butterfly(butterflyContainer));
    }

    let lastTime = 0;
    function animateButterflies(time) {
      butterflies.forEach(b => b.update(time));
      requestAnimationFrame(animateButterflies);
    }
    requestAnimationFrame(animateButterflies);

    // Optional mouse interaction: a butterfly is attracted to gentle mouse movement
    let mouseThrottle = 0;
    window.addEventListener('mousemove', (e) => {
      mouseThrottle++;
      if (mouseThrottle % 8 === 0) {
        const closest = butterflies[0];
        if (closest && Math.random() > 0.6) {
          closest.targetX = e.clientX + (Math.random() - 0.5) * 100;
          closest.targetY = e.clientY + (Math.random() - 0.5) * 100;
        }
      }
    });
  }

  // ===================================================
  // 7. SHARE & COPY LINK LOGIC
  // ===================================================
  const copyCurrentLink = () => {
    const currentUrl = window.location.href;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        showToast('Сайттың сілтемесі көшірілді! 📋 Кез келген жерде бөлісе аласыз.');
      }).catch(() => {
        fallbackCopyText(currentUrl);
      });
    } else {
      fallbackCopyText(currentUrl);
    }
  };

  function fallbackCopyText(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast('Сайттың сілтемесі көшірілді! 📋');
    } catch (err) {
      prompt('Сайт сілтемесін мына жерден көшіріп алыңыз:', text);
    }
    document.body.removeChild(tempInput);
  }

  const shareLinkBtn = document.getElementById('shareLinkBtn');
  const heroCopyLinkBtn = document.getElementById('heroCopyLinkBtn');

  if (shareLinkBtn) {
    shareLinkBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'Анель • Резюме-Портфолио',
          text: 'Анельдің интерактивті резюме-портфолиосы мен ерекше анкетасы:',
          url: window.location.href
        }).catch(() => {
          copyCurrentLink();
        });
      } else {
        copyCurrentLink();
      }
    });
  }

  if (heroCopyLinkBtn) {
    heroCopyLinkBtn.addEventListener('click', copyCurrentLink);
  }

  // ===================================================
  // 8. COMPLIMENTS & POETIC PRAISES FOR ANEL
  // ===================================================
  const anelComplimentsList = [
    "«Анель — айналасына нұр шашатын, көздерінен мейірім төгілген ерекше ару. Оның күлкісі көктемнің шуағындай жылы, ал жаны таңғы шықтай мөлдір!»",
    "«Сен жай ғана сұлу емессің, сенің әрбір қимылыңнан терең парасат, ерекше сыпайылық пен биязылық аңғарылады. Сендей ғажайып ару өмірде сирек кездеседі!»",
    "«Анель — бұл өмірдің ең көркем әуені, әрбір сәті шабытқа толы қайталанбас тұлға. Қарапайымдылығың — ең бағалы асылың!»",
    "«Күлкіңнен көктемнің жұпар лебі, жүзіңнен шуақты таңның нұры сезіледі. Сен күлімдегенде, айналаңдағы барлық мұң сейіліп кетеді!»",
    "«Әсемдік пен ақылдың, нәзіктік пен жауапкершіліктің таңғажайып үйлесімі! Сенің әрбір қадамың биік белестерге жетелей берсін!»",
    "«Сенің көздеріңде таудың мөлдір бұлағындай тазалық бар. Ішкі дүниеңнің сұлулығы жүзіңді одан сайын нұрландырып тұрады.»",
    "«Сен бар жерде әрқашан жылылық, сәуле және ерекше таза көңіл-күй орнайды. Әлемді мейірімді әрі әсем ететін ең ерекше қызсың!»",
    "«Анель — кез келген ортаның көркі, жүректердің шабыты. Табиғи сұлулығың мен пәк ниетің ешқашан сөнбесін!»",
    "«Әрбір сөзің мен әрекетіңнен биік мәдениет пен биязылық байқалады. Сен — өмірді сүюге, жақсылық жасауға құштар сиқырлы жансың!»",
    "«Ең нәзік, ең ақылды әрі ең мейірімді ару! Сенің бақытың шалқып, барлық асқақ армандарың орындала берсін!»"
  ];

  let currentComplimentIdx = 0;
  const complimentQuoteText = document.getElementById('complimentQuoteText');
  const nextComplimentBtn = document.getElementById('nextComplimentBtn');
  const sendHeartBtn = document.getElementById('sendHeartBtn');
  const heartsCounter = document.getElementById('heartsCounter');

  let storedHearts = parseInt(localStorage.getItem('anel_hearts_count')) || 128;
  if (heartsCounter) heartsCounter.textContent = storedHearts;

  if (nextComplimentBtn && complimentQuoteText) {
    nextComplimentBtn.addEventListener('click', () => {
      complimentQuoteText.style.opacity = '0';
      complimentQuoteText.style.transform = 'translateY(8px)';
      
      setTimeout(() => {
        currentComplimentIdx = (currentComplimentIdx + 1) % anelComplimentsList.length;
        complimentQuoteText.textContent = anelComplimentsList[currentComplimentIdx];
        complimentQuoteText.style.opacity = '1';
        complimentQuoteText.style.transform = 'translateY(0)';
      }, 250);

      createFloatingHearts(nextComplimentBtn, 3);
    });
  }

  if (sendHeartBtn) {
    sendHeartBtn.addEventListener('click', (e) => {
      storedHearts++;
      localStorage.setItem('anel_hearts_count', storedHearts);
      if (heartsCounter) heartsCounter.textContent = storedHearts;

      createFloatingHearts(sendHeartBtn, 8);
      showToast('Анельге махаббат пен жылы лебіз сыйланды! 💖');
    });
  }

  function createFloatingHearts(anchorEl, count = 5) {
    const rect = anchorEl ? anchorEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0 };
    const hearts = ['💖', '💕', '✨', '🌸', '🦋', '❤️', '🌟'];

    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      
      const startX = rect.left + rect.width / 2 + (Math.random() - 0.5) * 80;
      const startY = rect.top + (Math.random() - 0.5) * 20;

      heart.style.left = `${startX}px`;
      heart.style.top = `${startY}px`;
      heart.style.fontSize = `${Math.floor(Math.random() * 16) + 18}px`;

      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 2400);
    }
  }

  // ===================================================
  // 9. MOLDANAZAR "МАХАББАТЫМ" AUDIO PLAYER LOGIC
  // ===================================================
  const musicPlayerWidget = document.getElementById('musicPlayerWidget');
  const bgMusic = document.getElementById('bgMusic');
  const musicPlayBtn = document.getElementById('musicPlayBtn');
  const musicPlayIcon = document.getElementById('musicPlayIcon');
  const musicVinylBox = document.getElementById('musicVinylBox');
  const musicMuteBtn = document.getElementById('musicMuteBtn');
  const musicVolIcon = document.getElementById('musicVolIcon');
  const musicCollapseBtn = document.getElementById('musicCollapseBtn');
  const musicCollapseIcon = document.getElementById('musicCollapseIcon');
  const musicStatusText = document.getElementById('musicStatusText');

  let isAudioPlaying = false;
  let isSynthFallbackActive = false;
  let audioCtx = null;
  let synthInterval = null;

  // Gentle pentatonic ambient fallback synth if remote audio is blocked or fails
  function startSynthMelodyFallback() {
    if (synthInterval) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      audioCtx = audioCtx || new AudioContext();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C D E G A C
      let noteIdx = 0;

      synthInterval = setInterval(() => {
        if (!isAudioPlaying) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[noteIdx % notes.length], audioCtx.currentTime);
        noteIdx = (noteIdx + Math.floor(Math.random() * 3) + 1) % notes.length;

        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.07, audioCtx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
      }, 700);
      isSynthFallbackActive = true;
    } catch (e) {
      console.warn('Audio fallback not supported', e);
    }
  }

  function stopSynthMelodyFallback() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
    isSynthFallbackActive = false;
  }

  function updateMusicUI(playing) {
    isAudioPlaying = playing;
    if (musicPlayerWidget) {
      musicPlayerWidget.classList.toggle('playing', playing);
    }
    if (musicPlayIcon) {
      musicPlayIcon.className = playing ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    }
    if (musicStatusText) {
      musicStatusText.textContent = playing ? 'Ойнап жатыр • Махаббатым' : 'Әуенді тыңдау үшін басыңыз';
    }
  }

  async function toggleMusicPlayback() {
    if (!bgMusic) return;

    if (isAudioPlaying) {
      bgMusic.pause();
      stopSynthMelodyFallback();
      updateMusicUI(false);
    } else {
      try {
        bgMusic.muted = false;
        bgMusic.volume = 0.95;
        if (musicVolIcon) musicVolIcon.className = 'fa-solid fa-volume-high';
        await bgMusic.play();
        updateMusicUI(true);
      } catch (err) {
        console.warn('Native audio play error, launching romantic ambient melodic fallback:', err);
        startSynthMelodyFallback();
        updateMusicUI(true);
      }
    }
  }

  if (musicPlayBtn) musicPlayBtn.addEventListener('click', toggleMusicPlayback);
  if (musicVinylBox) musicVinylBox.addEventListener('click', toggleMusicPlayback);

  if (bgMusic) {
    bgMusic.addEventListener('play', () => updateMusicUI(true));
    bgMusic.addEventListener('pause', () => updateMusicUI(false));
    bgMusic.addEventListener('ended', () => updateMusicUI(false));
  }

  // Mute / Unmute
  if (musicMuteBtn && bgMusic) {
    musicMuteBtn.addEventListener('click', () => {
      bgMusic.muted = !bgMusic.muted;
      if (musicVolIcon) {
        musicVolIcon.className = bgMusic.muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
      }
    });
  }

  // Collapse / Expand Widget
  if (musicCollapseBtn && musicPlayerWidget) {
    musicCollapseBtn.addEventListener('click', () => {
      musicPlayerWidget.classList.toggle('collapsed');
      const isCollapsed = musicPlayerWidget.classList.contains('collapsed');
      if (musicCollapseIcon) {
        musicCollapseIcon.className = isCollapsed ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down';
      }
    });
  }
});
