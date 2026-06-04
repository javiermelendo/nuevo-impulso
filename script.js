/* ===================================================
   NUEVO IMPULSO ANDALUCÍA — JavaScript
=================================================== */

// ---------- NAVBAR ----------
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
});

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

// ---------- ACTIVE NAV LINK ON SCROLL ----------
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.style.color = (scrollY >= top && scrollY < top + height)
        ? 'var(--terracotta)' : '';
    }
  });
});

// ---------- ANIMATED COUNTERS ----------
const counters = document.querySelectorAll('.stat-number');
let countersStarted = false;

function startCounters() {
  counters.forEach(counter => {
    const target  = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 1600;
    const step     = target / (duration / 16);
    let current    = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { counter.textContent = target; clearInterval(timer); }
      else counter.textContent = Math.floor(current);
    }, 16);
  });
}

const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      startCounters();
    }
  });
}, { threshold: 0.3 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) heroObserver.observe(statsEl);

// ---------- PRICING TABS ----------
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.getAttribute('data-tab');

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById('tab-' + tabId).classList.add('active');
  });
});

// ---------- SCROLL REVEAL ----------
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

const revealTargets = [
  '.mvv-card', '.dif-item', '.activity-card', '.price-card',
  '.team-card', '.timeline-item', '.ods-card', '.social-link'
];
document.querySelectorAll(revealTargets.join(', ')).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.5s ease ${(i % 4) * 0.1}s, transform 0.5s ease ${(i % 4) * 0.1}s`;
  revealObserver.observe(el);
});

document.head.insertAdjacentHTML('beforeend', `
  <style>.revealed { opacity: 1 !important; transform: translateY(0) !important; }</style>
`);

// ---------- CONTACT FORM ----------
const contactForm = document.getElementById('contactForm');
const toast       = document.getElementById('toast');

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = '¡Enviado correctamente!';
    btn.style.background = 'var(--green)';
    contactForm.reset();

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);

    setTimeout(() => {
      btn.textContent = 'Enviar solicitud';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }, 1200);
});

// ---------- BACK TO TOP ----------
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---------- SMOOTH SCROLL FOR ALL ANCHORS ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});
