// ========================================================
//  Monteroni 3D — JavaScript Landing Page
// ========================================================

// ── MINI VIDEO TIKTOK (card en sección social) ───────────
const miniScenes = ['ms1','ms2','ms3','ms4'];
let miniPlaying  = false;
let miniElapsed  = 0;
let miniInterval = null;
const miniDuration = 20; // segundos simulados

function playMiniVideo() {
  const btn = document.getElementById('miniPlayBtn');
  if (!btn) return;

  if (miniPlaying) {
    clearInterval(miniInterval);
    miniPlaying = false;
    btn.innerHTML = '<i class="fa-solid fa-play"></i>';
    return;
  }

  if (miniElapsed >= miniDuration) resetMiniVideo();

  miniPlaying = true;
  btn.innerHTML = '<i class="fa-solid fa-pause"></i>';

  miniInterval = setInterval(() => {
    miniElapsed += 0.1;
    const pct  = (miniElapsed / miniDuration) * 100;
    const fill = document.getElementById('miniFill');
    if (fill) fill.style.width = Math.min(pct, 100) + '%';

    // Cambiar escena cada 5 seg
    const idx = Math.min(Math.floor(miniElapsed / 5), miniScenes.length - 1);
    miniScenes.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('ts-active', i === idx);
    });

    if (miniElapsed >= miniDuration) {
      clearInterval(miniInterval);
      miniPlaying = false;
      btn.innerHTML = '<i class="fa-solid fa-rotate-right"></i>';
    }
  }, 100);
}

function resetMiniVideo() {
  miniElapsed = 0;
  const fill = document.getElementById('miniFill');
  if (fill) fill.style.width = '0%';
  miniScenes.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('ts-active', i === 0);
  });
}

// ── LIKE EN POSTS ─────────────────────────────────────────
const likedPosts = {};
function likePost(id) {
  const countEl = document.getElementById('lc-' + id);
  if (!countEl) return;

  if (likedPosts[id]) {
    likedPosts[id] = false;
    // Decrementar
    const n = parseInt(countEl.textContent.replace(/\./g, '').replace(',','')) - 1;
    countEl.textContent = formatLikeNum(n);
  } else {
    likedPosts[id] = true;
    const n = parseInt(countEl.textContent.replace(/\./g, '').replace(',','')) + 1;
    countEl.textContent = formatLikeNum(n);
    // Animación
    const btn = document.getElementById('like-' + id);
    if (btn) {
      btn.style.transform = 'scale(1.3)';
      setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);
    }
  }
}

function formatLikeNum(n) {
  return n.toLocaleString('es-AR');
}

// ── ENCUESTA EN HISTORIA ──────────────────────────────────
let pollVoted = false;
function voteMiniPoll(option) {
  if (pollVoted) return;
  pollVoted = true;

  const va = document.getElementById('spva');
  const vb = document.getElementById('spvb');
  if (!va || !vb) return;

  if (option === 'a') {
    va.textContent = '72%'; vb.textContent = '28%';
    document.querySelector('.spv2-a').style.background = '#D1FAE5';
    document.querySelector('.spv2-a').style.color = '#065F46';
  } else {
    va.textContent = '64%'; vb.textContent = '36%';
    document.querySelector('.spv2-b').style.background = '#EDE9FE';
    document.querySelector('.spv2-b').style.color = '#5B21B6';
  }
}

// ── ANIMACIÓN DE BARRAS DE COMPARACIÓN ───────────────────
function animateBars() {
  const bars = document.querySelectorAll('.bar-fill');
  bars.forEach(bar => {
    const targetWidth = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = targetWidth; }, 200);
  });
}

// ── INTERSECTION OBSERVER (animaciones al scroll) ─────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animar barras si es la sección de comparación
      if (entry.target.classList.contains('comparison-card')) {
        animateBars();
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.product-card, .review-card, .step-card, .comparison-card, .wf-item')
  .forEach(el => observer.observe(el));

// ── SMOOTH SCROLL ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── NAVBAR SCROLL SHADOW ──────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) {
    if (window.scrollY > 20) nav.style.boxShadow = '0 4px 20px rgba(0,0,0,.1)';
    else                      nav.style.boxShadow = '';
  }
});
