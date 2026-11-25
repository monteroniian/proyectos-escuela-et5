const modalData = {
  gym: {
    title: '🏋️ Gym',
    content: `
      <p>Nuestro gimnasio cuenta con más de <strong>500m²</strong> de equipamiento de última generación.</p>
      <p><strong>Incluye:</strong> zona de pesas libres, máquinas de musculación, área de cardio con cintas, bicicletas y elípticas, y zona de estiramientos.</p>
      <p>Contamos con instructores certificados disponibles en todo momento para guiarte en tu entrenamiento y ayudarte a alcanzar tus objetivos.</p>
      <p><strong>Ideal para:</strong> principiantes, intermedios y avanzados que buscan mejorar su físico y salud.</p>
    `
  },
  crossfit: {
    title: '🔥 CrossFit',
    content: `
      <p>Nuestro box de CrossFit está equipado con todo lo necesario para los WODs más exigentes.</p>
      <p><strong>Incluye:</strong> barras olímpicas, kettlebells, cajas de salto, cuerdas, remos y mucho más.</p>
      <p>Cada clase es dirigida por coaches certificados Level 1 y Level 2 que adaptan el entrenamiento a todos los niveles.</p>
      <p><strong>Ideal para:</strong> personas que buscan mejorar su condición física general, resistencia y trabajo en equipo.</p>
    `
  },
  kickboxing: {
    title: '🥊 Kickboxing',
    content: `
      <p>Nuestras clases de Kickboxing combinan técnicas de boxeo y artes marciales para un entrenamiento completo.</p>
      <p><strong>Incluye:</strong> trabajo de bolsa, técnica de golpes, patadas, combinaciones y sparring controlado.</p>
      <p>Clases para todos los niveles, desde principiantes hasta competidores. También ofrecemos clases de defensa personal.</p>
      <p><strong>Ideal para:</strong> quienes buscan mejorar su condición física, aprender defensa personal y liberar el estrés.</p>
    `
  }
};

function openModal(type) {
  const data = modalData[type];
  document.getElementById('modal-body').innerHTML = `<h3>${data.title}</h3>${data.content}`;
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

function showTab(tabId, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  btn.classList.add('active');
}

function submitForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '✔ Mensaje enviado';
  btn.style.background = '#2a9d5c';
  setTimeout(() => {
    btn.textContent = 'Enviar mensaje';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
}

function abrirImagen(e) {
  if (e.target.tagName !== 'IMG') return;
  document.getElementById('lightbox-img').src = e.target.src;
  document.getElementById('lightbox').classList.add('open');
}

function cerrarLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}


function toggleGaleria(btn) {
  const grid = document.getElementById('galeria-grid');
  const visible = grid.style.display !== 'none';
  grid.style.display = visible ? 'none' : 'grid';
  btn.textContent = visible ? 'Ver imágenes' : 'Ocultar imágenes';
}


document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); cerrarLightbox(); }
});


window.addEventListener('scroll', () => {
  document.querySelector('nav').style.boxShadow =
    window.scrollY > 50 ? '0 2px 20px rgba(230,57,70,.2)' : 'none';
});
