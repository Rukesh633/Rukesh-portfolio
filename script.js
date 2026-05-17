// ── THEME SYSTEM ──
(function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

// ── LOADER — max ~1.1s ──
window.addEventListener('load', () => {
  const firstVisit = !sessionStorage.getItem('visited');
  const delay = firstVisit ? 1100 : 400;
  sessionStorage.setItem('visited', '1');
  setTimeout(() => document.getElementById('loader').classList.add('gone'), delay);
});

// ── CURSOR ──
const cur = document.getElementById('cur');
const curR = document.getElementById('cur-r');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
});
(function animR() {
  rx += (mx - rx) * .12; ry += (my - ry) * .12;
  curR.style.left = rx + 'px'; curR.style.top = ry + 'px';
  requestAnimationFrame(animR);
})();
document.querySelectorAll('a, button, .proj-card, .sc-card, .tech-item, .exp-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('c-big'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('c-big'));
});

// ── THEME TOGGLE ──
// const themeToggle = document.getElementById('themeToggle');
// themeToggle.addEventListener('click', () => {
//   const current = document.documentElement.getAttribute('data-theme');
//   const next = current === 'dark' ? 'light' : 'dark';
//   document.documentElement.setAttribute('data-theme', next);
//   localStorage.setItem('theme', next);
// });

// ── NAV SCROLL ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, {passive: true});

// ── MULTI-LAYER PARALLAX (Mouse) ──
const heroBg    = document.getElementById('heroBg');
const heroPhoto = document.getElementById('heroPhoto');
const heroText  = document.getElementById('heroText');
const heroRing  = document.getElementById('heroRing');

let targetX = 0, targetY = 0;
let currentBgX = 0, currentBgY = 0;
let currentPhX = 0, currentPhY = 0;
let currentTxX = 0, currentTxY = 0;
let currentRiX = 0, currentRiY = 0;

const hero = document.getElementById('hero');
hero.addEventListener('mousemove', e => {
  if (window.innerWidth <= 900) return;
  const rect = hero.getBoundingClientRect();
  targetX = (e.clientX - rect.left - rect.width / 2) / rect.width;
  targetY = (e.clientY - rect.top - rect.height / 2) / rect.height;
});
hero.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });

(function parallaxLoop() {
  if (window.innerWidth > 900) {
    const ease = 0.055;
    currentBgX += (targetX * 16 - currentBgX) * ease;
    currentBgY += (targetY * 10 - currentBgY) * ease;
    currentPhX += (targetX * -24 - currentPhX) * ease;
    currentPhY += (targetY * -16 - currentPhY) * ease;
    currentTxX += (targetX * 8  - currentTxX) * ease;
    currentTxY += (targetY * 5  - currentTxY) * ease;
    currentRiX += (targetX * -18 - currentRiX) * ease;
    currentRiY += (targetY * -12 - currentRiY) * ease;

    heroBg.style.transform    = `translate(${currentBgX}px, ${currentBgY}px)`;
    heroPhoto.style.transform = `translate(${currentPhX}px, ${currentPhY}px)`;
    heroText.style.transform  = `translate(${currentTxX}px, ${currentTxY}px)`;
    heroRing.style.transform  = `translate(${currentRiX}px, ${currentRiY}px)`;
  }
  requestAnimationFrame(parallaxLoop);
})();

// ── SCROLL PARALLAX (vertical) — desktop only ──
window.addEventListener('scroll', () => {
  if (window.innerWidth <= 900) return;
  const scrolled = window.scrollY;
  const heroEl = document.getElementById('hero');
  if (scrolled < heroEl.offsetHeight) {
    heroPhoto.style.marginTop = scrolled * 0.28 + 'px';
    heroBg.style.transform = `translateY(${scrolled * 0.12}px)`;
  }
}, {passive: true});

// ── REVEAL ON SCROLL ──
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── SKILL BARS ──
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting)
      e.target.querySelectorAll('.sb-fill').forEach(b => b.classList.add('on'));
  });
}, { threshold: .2 });
document.querySelectorAll('.bars-section').forEach(el => barObs.observe(el));

// ── PROJECT CARD RADIAL GLOW ──
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%';
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%';
    card.style.setProperty('--mx', x);
    card.style.setProperty('--my', y);
  });
});

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ── MAGNETIC BUTTONS ──
document.querySelectorAll('.btn-gold, .btn-ghost, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.18;
    const y = (e.clientY - r.top - r.height / 2) * 0.25;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

// ── HAMBURGER MENU ──
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  const links = menu.querySelectorAll('a');

  function toggle() {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  }

  btn.addEventListener('click', toggle);
  links.forEach(l => l.addEventListener('click', () => {
    btn.classList.remove('open');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }));
})();