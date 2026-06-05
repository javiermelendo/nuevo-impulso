/* ===================================================
   NUEVO IMPULSO ANDALUCÍA — JavaScript Avanzado v2
=================================================== */

/* ===== PRELOADER ===== */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('fade-out');
    setTimeout(() => preloader.remove(), 700);
  }, 2000);
});


/* ===== SCROLL PROGRESS BAR ===== */
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = scrolled + '%';
}, { passive: true });

/* ===== NAVBAR ===== */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

/* ===== TYPED TEXT ===== */
const typedEl  = document.getElementById('typedText');
const typedStr = 'cultura que se siente';
let   typedIdx = 0;

function typeChar() {
  if (!typedEl) return;
  if (typedIdx < typedStr.length) {
    typedEl.textContent += typedStr[typedIdx++];
    setTimeout(typeChar, 75);
  }
}
setTimeout(typeChar, 2500);

/* ===== SPLIT TEXT EN TITULOS ===== */
function splitWords(el) {
  if (!el) return;
  const html = el.innerHTML;
  // Respeta los <br> y <em>
  const parser = new DOMParser();
  const doc    = parser.parseFromString(html, 'text/html');
  const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  let nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    const words = node.textContent.split(' ');
    const frag  = document.createDocumentFragment();
    words.forEach((w, i) => {
      if (!w) return;
      const span = document.createElement('span');
      span.className = 'word-wrap';
      const inner = document.createElement('span');
      inner.className = 'word-inner';
      inner.textContent = w;
      inner.style.transitionDelay = `${i * 0.08}s`;
      span.appendChild(inner);
      frag.appendChild(span);
      if (i < words.length - 1) frag.appendChild(document.createTextNode(' '));
    });
    node.parentNode.replaceChild(frag, node);
  });
  el.innerHTML = doc.body.innerHTML;
}

function revealWords(el) {
  if (!el) return;
  el.querySelectorAll('.word-inner').forEach(w => w.classList.add('visible'));
}

const headings = document.querySelectorAll('.section-header h2');
headings.forEach(h => splitWords(h));

const headingObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealWords(entry.target.querySelector('h2'));
      headingObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.section-header').forEach(el => headingObserver.observe(el));

/* ===== PARTÍCULAS HERO ===== */
const canvas = document.getElementById('heroCanvas');
const ctx    = canvas ? canvas.getContext('2d') : null;
let particles = [];

function resizeCanvas() {
  if (!canvas) return;
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x    = Math.random() * canvas.width;
    this.y    = Math.random() * canvas.height;
    this.r    = Math.random() * 2.5 + 0.5;
    this.vx   = (Math.random() - 0.5) * 0.5;
    this.vy   = (Math.random() - 0.5) * 0.5;
    this.life = 0;
    this.maxLife = Math.random() * 0.7 + 0.3;
    this.color = Math.random() > 0.7 ? '201,169,60' : '255,255,255';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.life += 0.004;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height || this.life > this.maxLife) this.reset();
  }
  draw() {
    const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  if (!canvas) return;
  resizeCanvas();
  particles = Array.from({ length: 100 }, () => new Particle());
  drawParticles();
}

function drawParticles() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255,255,255,${0.07 * (1 - d / 110)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', resizeCanvas, { passive: true });
initParticles();

/* ===== CONTADORES ANIMADOS ===== */
let countersStarted = false;
function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2200;
  const start    = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOut(t) * target);
    if (t < 1) { requestAnimationFrame(step); }
    else {
      el.textContent = target;
      el.classList.add('popped');
      setTimeout(() => el.classList.remove('popped'), 400);
    }
  }
  requestAnimationFrame(step);
}

new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      document.querySelectorAll('.stat-number').forEach(animateCounter);
    }
  });
}, { threshold: 0.4 }).observe(document.querySelector('.hero-stats') || document.body);

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

function setupReveal(selector, dir = '', delay = 0) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    if (dir) el.classList.add(dir);
    el.style.transitionDelay = `${delay + (i % 4) * 0.13}s`;
    revealObserver.observe(el);
  });
}

setupReveal('.flip-card',      '',           0);
setupReveal('.price-card',     '',           0.1);
setupReveal('.team-card',      '',           0);
setupReveal('.dif-item',       'scale-in',   0);
setupReveal('.horario-item',   '',           0);
setupReveal('.social-link',    'from-left',  0);
setupReveal('.info-card',      'from-right', 0);
setupReveal('.descuento-card', 'scale-in',   0.1);

/* ===== 3D TILT EN TARJETAS ===== */
function addTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 12;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * -12;
      const inner = card.querySelector('.flip-inner');
      if (inner) { inner.style.transition = 'transform 0.1s ease'; inner.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg)`; }
      else { card.style.transition = 'transform 0.1s ease'; card.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-5px)`; }
    });
    card.addEventListener('mouseleave', () => {
      const inner = card.querySelector('.flip-inner');
      if (inner) { inner.style.transition = 'transform 0.65s cubic-bezier(0.23,1,0.32,1)'; inner.style.transform = ''; }
      else { card.style.transition = 'transform 0.5s ease'; card.style.transform = ''; }
    });
  });
}
addTilt('.team-card');
addTilt('.price-card');
addTilt('.flip-card');

/* ===== FLIP EN MÓVIL (tap) ===== */
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => {
    if (window.matchMedia('(hover: none)').matches) {
      card.classList.toggle('flipped');
    }
  });
});

/* ===== BOTONES MAGNÉTICOS ===== */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * 0.25;
    const y = (e.clientY - r.top  - r.height / 2) * 0.35;
    btn.style.transform = `translate(${x}px, ${y}px) translateY(-2px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transition = 'transform 0.4s ease, box-shadow 0.3s ease';
    btn.style.transform  = '';
  });
  btn.addEventListener('mouseenter', () => {
    btn.style.transition = 'transform 0.1s ease';
  });
});

/* ===== RIPPLE EN BOTONES ===== */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const r    = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2;
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* ===== PRICING TABS ===== */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const tab = document.getElementById('tab-' + btn.dataset.tab);
    tab.classList.add('active');
    tab.style.animation = 'none';
    void tab.offsetWidth;
    tab.style.animation = 'tabFadeIn 0.4s ease';
  });
});
document.head.insertAdjacentHTML('beforeend', `
  <style>@keyframes tabFadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}</style>
`);

/* ===== CONFETI EN FORMULARIO ===== */
function launchConfetti() {
  const colors = ['#16a85a','#0d7a40','#c9a93c','#ffffff','#2ecc71','#f1c40f'];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `
      left: ${Math.random() * 100}vw;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${Math.random() * 10 + 6}px;
      height: ${Math.random() * 10 + 6}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration: ${Math.random() * 2 + 2}s;
      animation-delay: ${Math.random() * 0.5}s;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

/* ===== FORMULARIO ===== */
const contactForm = document.getElementById('contactForm');
const toast       = document.getElementById('toast');

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = 'Enviando...';
  btn.disabled    = true;
  setTimeout(() => {
    btn.textContent       = '✓ ¡Enviado con éxito!';
    btn.style.background  = 'var(--green-500)';
    launchConfetti();
    contactForm.reset();
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4500);
    setTimeout(() => {
      btn.textContent      = 'Enviar solicitud';
      btn.style.background = '';
      btn.disabled         = false;
    }, 3500);
  }, 1200);
});

/* ===== ACTIVE NAV ===== */
const allSections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const y = window.scrollY + 100;
  allSections.forEach(s => {
    const link = document.querySelector(`.nav-link[href="#${s.id}"]`);
    if (link) link.style.color = (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) ? 'var(--green-700)' : '';
  });
}, { passive: true });

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' }); }
  });
});

/* ===== BACK TO TOP ===== */
document.getElementById('backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== PARALLAX SUAVE EN HERO (solo desktop) ===== */
if (window.matchMedia('(hover: hover)').matches) {
  window.addEventListener('scroll', () => {
    if (!canvas) return;
    const offset = window.scrollY * 0.3;
    canvas.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
}
