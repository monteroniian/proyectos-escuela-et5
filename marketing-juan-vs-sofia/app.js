// ==========================================================================
// JUAN VS SOFÍA - JAVASCRIPT CONTROLLER
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  animateCounters();
});

// Cambiar modos de visualización (Versus, Juan, Sofía, Examen/Académico)
function setViewMode(mode) {
  const container = document.getElementById('split-container');
  const banner = document.getElementById('scoreboard-banner');
  const academicView = document.getElementById('academic-view');

  const btnSplit = document.getElementById('btn-split');
  const btnJuan = document.getElementById('btn-juan');
  const btnSofia = document.getElementById('btn-sofia');
  const btnAcademic = document.getElementById('btn-academic');

  // Reset clases de botones
  [btnSplit, btnJuan, btnSofia, btnAcademic].forEach(btn => {
    btn.classList.remove('active', 'active-juan', 'active-sofia');
  });

  // Reset estados
  container.classList.remove('view-only-juan', 'view-only-sofia');
  banner.classList.remove('view-only-juan', 'view-only-sofia');
  
  container.style.display = 'grid';
  banner.style.display = 'grid';
  academicView.classList.remove('visible');

  if (mode === 'split') {
    btnSplit.classList.add('active');
  } else if (mode === 'juan') {
    btnJuan.classList.add('active-juan');
    container.classList.add('view-only-juan');
    banner.classList.add('view-only-juan');
  } else if (mode === 'sofia') {
    btnSofia.classList.add('active-sofia');
    container.classList.add('view-only-sofia');
    banner.classList.add('view-only-sofia');
  } else if (mode === 'academic') {
    btnAcademic.classList.add('active');
    container.style.display = 'none';
    banner.style.display = 'none';
    academicView.classList.add('visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Animación simple de contadores
function animateCounters() {
  const values = document.querySelectorAll('.stat-value');
  values.forEach(val => {
    val.style.opacity = '0';
    val.style.transform = 'translateY(6px)';
    val.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => {
      val.style.opacity = '1';
      val.style.transform = 'translateY(0)';
    }, 150);
  });
}
