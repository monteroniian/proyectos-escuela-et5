// Lightbox al hacer clic en una tarjeta
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    document.getElementById('lightboxImg').src = img.src;
    document.getElementById('lightbox').classList.add('active');
  });
});

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
}

// Enviar mensaje por WhatsApp con los datos del formulario
function enviarWhatsApp() {
  const nombre = document.getElementById('nombre').value.trim();
  const asunto = document.getElementById('asunto').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  if (!nombre || !asunto || !mensaje) {
    alert('Por favor completá todos los campos antes de enviar.');
    return;
  }

  const texto = `Hola! Soy *${nombre}*.\n*Asunto:* ${asunto}\n\n${mensaje}`;
  const url = `https://wa.me/541158959978?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}
