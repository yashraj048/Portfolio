/* ============================================================
   YASH RAJ SHARMA — Portfolio Script
   ============================================================ */

'use strict';

/* ─── 1. CANVAS PARTICLE NETWORK ─────────────────────────── */
(function initParticles() {
  const canvas  = document.getElementById('bg-canvas');
  const ctx     = canvas.getContext('2d');
  let W, H, particles, animId;

  const CONFIG = {
    count:        90,
    maxDist:      140,
    speed:        0.35,
    dotRadius:    1.8,
    dotColor:     'rgba(0,229,255,',    // appended with alpha
    lineColor:    'rgba(0,229,255,',
    lineColorAlt: 'rgba(155,89,245,',
  };

  class Particle {
    constructor() { this.reset(true); }
    reset(random) {
      this.x  = random ? Math.random() * W : (Math.random() < 0.5 ? 0 : W);
      this.y  = random ? Math.random() * H : Math.random() * H;
      this.vx = (Math.random() - 0.5) * CONFIG.speed;
      this.vy = (Math.random() - 0.5) * CONFIG.speed;
      this.r  = Math.random() * CONFIG.dotRadius + 0.8;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = CONFIG.dotColor + this.alpha + ')';
      ctx.fill();
    }
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    if (!particles) {
      particles = Array.from({ length: CONFIG.count }, () => new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.maxDist) {
          const a    = 1 - dist / CONFIG.maxDist;
          // alternate between cyan and violet based on index parity
          const col  = (i + j) % 3 === 0 ? CONFIG.lineColorAlt : CONFIG.lineColor;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = col + (a * 0.35) + ')';
          ctx.lineWidth   = a * 1.2;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  loop();
})();


/* ─── 2. CURSOR GLOW ──────────────────────────────────────── */
(function initCursor() {
  const glow = document.getElementById('cursor-glow');
  let mx = -999, my = -999;
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    glow.style.left = mx + 'px';
    glow.style.top  = my + 'px';
  });
})();


/* ─── 3. STICKY NAVBAR ────────────────────────────────────── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();


/* ─── 4. HAMBURGER MENU ───────────────────────────────────── */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });

  // close when a link is clicked
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();


/* ─── 5. TYPING ANIMATION ─────────────────────────────────── */
(function initTyping() {
  const el      = document.getElementById('typing-text');
  const phrases = [
    'ECE Student @ MRIIRS',
    'AI & ML Enthusiast',
    'Quantum Computing Explorer',
    'Arduino & Raspberry Pi Tinkerer',
    'Physics + Math Nerd',
  ];
  let pIdx = 0, cIdx = 0, deleting = false, delay = 120;

  function tick() {
    const phrase = phrases[pIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++cIdx);
      if (cIdx === phrase.length) { deleting = true; delay = 2000; }
      else delay = 70 + Math.random() * 50;
    } else {
      el.textContent = phrase.slice(0, --cIdx);
      delay = 35;
      if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; delay = 300; }
    }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 800);
})();


/* ─── 6. SCROLL REVEAL ────────────────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  // Stagger siblings with data-delay
  items.forEach(el => {
    const delay = el.dataset.delay || 0;
    el.style.transitionDelay = delay + 'ms';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
})();


/* ─── 7. SKILL BAR ANIMATION ──────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.bar-fill');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pct = entry.target.dataset.pct;
        // slight delay for visual delight
        setTimeout(() => {
          entry.target.style.width = pct + '%';
        }, 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => observer.observe(f));
})();


/* ─── 8. CONTACT FORM ─────────────────────────────────────── */
(function initForm() {
  const form    = document.getElementById('contact-form');
  const sendBtn = document.getElementById('send-btn');
  const success = document.getElementById('form-success');

  function validate() {
    let ok = true;

    const name  = document.getElementById('name');
    const email = document.getElementById('email');
    const msg   = document.getElementById('message');

    const nameErr  = document.getElementById('name-error');
    const emailErr = document.getElementById('email-error');
    const msgErr   = document.getElementById('message-error');

    // clear
    [nameErr, emailErr, msgErr].forEach(e => e.textContent = '');
    [name, email, msg].forEach(f => f.style.borderColor = '');

    if (!name.value.trim()) {
      nameErr.textContent = '⚠ Name is required.';
      name.style.borderColor = '#ff6b6b';
      ok = false;
    }

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      emailErr.textContent = '⚠ Email is required.';
      email.style.borderColor = '#ff6b6b';
      ok = false;
    } else if (!emailRx.test(email.value)) {
      emailErr.textContent = '⚠ Please enter a valid email.';
      email.style.borderColor = '#ff6b6b';
      ok = false;
    }

    if (!msg.value.trim() || msg.value.trim().length < 10) {
      msgErr.textContent = '⚠ Message must be at least 10 characters.';
      msg.style.borderColor = '#ff6b6b';
      ok = false;
    }

    return ok;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;

    // Simulate sending (replace with actual fetch/EmailJS in production)
    sendBtn.disabled = true;
    const origContent = sendBtn.innerHTML;
    sendBtn.innerHTML = '<i class="ph ph-spinner-gap" style="animation:spin 0.8s linear infinite"></i> Sending…';

    // Add spinner keyframe dynamically once
    if (!document.getElementById('spin-kf')) {
      const style = document.createElement('style');
      style.id = 'spin-kf';
      style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }

    setTimeout(() => {
      sendBtn.disabled = false;
      sendBtn.innerHTML = origContent;
      success.style.display = 'flex';
      form.reset();
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    }, 1600);
  });
})();


/* ─── 9. RESUME BUTTON ────────────────────────────────────── */
(function initResume() {
  document.getElementById('resume-btn').addEventListener('click', e => {
    e.preventDefault();
    // Replace '#' with your actual resume PDF URL when ready
    alert('📄 Resume will be available soon! Check back later.');
  });
})();


/* ─── 10. FOOTER YEAR ─────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();


/* ─── 11. ACTIVE NAV LINK ON SCROLL ──────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScroll() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }

  // Add active styles via JS (small addition to CSS)
  const style = document.createElement('style');
  style.textContent = '.nav-link.active { color: var(--cyan) !important; }';
  document.head.appendChild(style);

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ─── 12. PROJECT CARD PARALLAX ON MOUSE ─────────────────── */
(function initCardTilt() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const x     = (e.clientX - rect.left) / rect.width  - 0.5;
      const y     = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
      card.style.transition = 'transform 0.1s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), border-color 0.4s, box-shadow 0.4s';
    });
  });
})();
