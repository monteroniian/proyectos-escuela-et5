import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue, push, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCxPqdht3-28dIQuGBtSkHnAb6Vj8fUFvA",
  authDomain: "club-de-natacion-smi.firebaseapp.com",
  databaseURL: "https://club-de-natacion-smi-default-rtdb.firebaseio.com",
  projectId: "club-de-natacion-smi",
  storageBucket: "club-de-natacion-smi.firebasestorage.app",
  messagingSenderId: "708566930948",
  appId: "1:708566930948:web:ffebe0deaa05d41a740751",
  measurementId: "G-KGQ7TRGXDJ"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// --- 1. CARGA DE COMPONENTES ---
// Detecta qué página es y carga el header correcto
const pagina = window.location.pathname.split('/').pop() || 'index.html';
const headerMap = {
  'index.html':        { id: 'header1-placeholder',           file: 'components/header1.html' },
  '':                  { id: 'header1-placeholder',           file: 'components/header1.html' },
  'ranking.html':      { id: 'header-ranking-placeholder',    file: 'components/header3.html' },
  'entrenamiento.html':{ id: 'header-entrenamiento-placeholder', file: 'components/header4.html' },
};

async function cargarComponentes() {
  // Header según página
  const h = headerMap[pagina];
  if (h) {
    const el = document.getElementById(h.id);
    if (el) {
      try {
        const res = await fetch(h.file);
        el.innerHTML = await res.text();
      } catch (err) { console.error('Error cargando header', err); }
    }
  }

  // Modales y footer (comunes a todas las páginas)
  for (const comp of [
    { id: 'modals-placeholder',  file: 'components/modals.html' },
    { id: 'footer-placeholder',  file: 'components/footer.html' },
  ]) {
    const el = document.getElementById(comp.id);
    if (el) {
      try {
        const res = await fetch(comp.file);
        el.innerHTML = await res.text();
      } catch (err) { console.error(`Error cargando ${comp.file}`, err); }
    }
  }

  inicializarAnimaciones();
}

// --- 2. GESTIÓN DE MODALES ---
window.openLogin = () => {
  document.getElementById('registerOverlay')?.classList.remove('active');
  document.getElementById('loginOverlay')?.classList.add('active');
};

window.openRegister = () => {
  document.getElementById('loginOverlay')?.classList.remove('active');
  document.getElementById('registerOverlay')?.classList.add('active');
};

window.closeModal = (id) => {
  document.getElementById(id)?.classList.remove('active');
};

window.selectType = (el) => {
  el.closest('.user-type-list').querySelectorAll('.user-type-item').forEach(i => i.classList.remove('selected'));
  el.classList.add('selected');
};

window.setLoginTab = (btn, rol) => {
  document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('loginRol').value = rol;
};

// --- 3. AUTENTICACIÓN ---
window.handleLogin = async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;
  const errEl = document.getElementById('loginError');
  errEl.style.display = 'none';

  try {
    await signInWithEmailAndPassword(auth, email, pass);
    window.closeModal('loginOverlay');
  } catch (err) {
    errEl.textContent = traducirError(err.code);
    errEl.style.display = 'block';
  }
};

window.handleRegister = async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('regNombre').value.trim();
  const email  = document.getElementById('regEmail').value.trim();
  const pass   = document.getElementById('regPass').value;
  const pass2  = document.getElementById('regPass2').value;
  const errEl  = document.getElementById('regError');
  errEl.style.display = 'none';

  if (pass !== pass2) {
    errEl.textContent = 'Las contraseñas no coinciden.';
    errEl.style.display = 'block';
    return;
  }

  try {
    // 1. Crear usuario en Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: nombre });

    // 2. Guardar perfil en Realtime DB (no bloquea el registro si falla)
    try {
      await set(ref(db, `usuarios/${cred.user.uid}`), {
        nombre,
        email,
        fecha: new Date().toISOString()
      });
    } catch (dbErr) {
      console.warn('No se pudo guardar en DB (verificar reglas Firebase):', dbErr.code);
    }

    window.closeModal('registerOverlay');
  } catch (authErr) {
    console.error('Error registro:', authErr.code, authErr.message);
    errEl.textContent = `[${authErr.code}] ${traducirError(authErr.code)}`;
    errEl.style.display = 'block';
  }
};

function traducirError(code) {
  const errores = {
    'auth/email-already-in-use': 'El correo ya está registrado.',
    'auth/wrong-password':       'Contraseña incorrecta.',
    'auth/user-not-found':       'No existe una cuenta con ese correo.',
    'auth/invalid-email':        'El correo no es válido.',
    'auth/weak-password':        'La contraseña debe tener al menos 6 caracteres.',
    'auth/too-many-requests':    'Demasiados intentos. Intentá más tarde.',
    'auth/invalid-credential':   'Correo o contraseña incorrectos.',
  };
  return errores[code] || 'Error al procesar la solicitud.';
}

// --- 4. ESTADO DE SESIÓN ---
onAuthStateChanged(auth, (user) => {
  // Actualiza botones de la navbar
  const btns = document.querySelectorAll('.btn-login');
  btns.forEach(btn => {
    if (user) {
      btn.textContent = `👤 ${user.displayName?.split(' ')[0] || 'Perfil'}`;
      btn.onclick = () => confirm('¿Cerrar sesión?') && signOut(auth);
    } else {
      btn.textContent = 'Iniciar Sesión';
      btn.onclick = () => window.openLogin();
    }
  });

  // Lógica específica de la página de entrenamiento
  if (pagina === 'entrenamiento.html') {
    const banner = document.getElementById('loginBanner');
    const welcomeEl = document.getElementById('welcomeUser');

    if (user) {
      if (banner) banner.style.display = 'none';
      if (welcomeEl) welcomeEl.textContent = `Hola, ${user.displayName?.split(' ')[0] || 'nadador'} 👋 Estos son tus récords personales`;
      cargarRecords(user.uid);
    } else {
      if (banner) banner.style.display = 'flex';
      if (welcomeEl) welcomeEl.textContent = 'Iniciá sesión para ver tus récords personales';
      ['Crol', 'Espalda', 'Mariposa'].forEach(e => {
        const el = document.getElementById(`records-${e}`);
        if (el) el.innerHTML = '<div class="record-empty">Iniciá sesión para ver tus récords</div>';
      });
    }
  }
});

// --- 5. RECORDS PERSONALES (solo en entrenamiento.html) ---
function cargarRecords(uid) {
  ['Crol', 'Espalda', 'Mariposa'].forEach(estilo => {
    const recordsRef = ref(db, `usuarios/${uid}/records/${estilo}`);
    onValue(recordsRef, (snapshot) => {
      const el = document.getElementById(`records-${estilo}`);
      if (!el) return;

      const data = snapshot.val();
      if (!data) {
        el.innerHTML = '<div class="record-empty">Sin registros aún — ¡empezá a entrenar!</div>';
        return;
      }

      // Convertir a array, ordenar por tiempo (menor = mejor)
      const records = Object.values(data)
        .sort((a, b) => a.segundos - b.segundos)
        .slice(0, 5); // top 5 personal

      el.innerHTML = records.map((r, i) => `
        <div class="competitor">
          <div class="medal ${i === 0 ? 'gold' : i === 1 ? 'silver' : 'bronze'}">${i + 1}</div>
          <div class="comp-info">
            <div class="name">${formatTiempo(r.segundos)}</div>
            <div class="pos">${new Date(r.fecha).toLocaleDateString('es-AR')}</div>
          </div>
          ${i === 0 ? '<div class="comp-time">🏅 Mejor</div>' : ''}
        </div>
      `).join('');
    });
  });
}

function formatTiempo(segundos) {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = segundos % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// --- 6. ENTRENAMIENTO Y CRONÓMETRO ---
let trainInterval = null;
let trainSeconds  = 0;

window.openTraining = (estilo) => {
  if (!auth.currentUser) return window.openLogin();
  trainSeconds = 0;
  clearInterval(trainInterval);
  document.getElementById('trainEstiloLabel').textContent = `Estilo: ${estilo}`;
  document.getElementById('trainTimerDisplay').textContent = '00:00:00';
  document.getElementById('trainCounter').style.display = 'none';
  const btn = document.getElementById('btnStartTraining');
  btn.disabled = false;
  btn.textContent = '▶ START';
  btn.dataset.estilo = estilo;
  document.getElementById('trainOverlay').classList.add('active');
};

window.startTraining = () => {
  const btn     = document.getElementById('btnStartTraining');
  const phase   = document.getElementById('trainPhaseLabel');
  const display = document.getElementById('trainTimerDisplay');

  btn.disabled = true;
  btn.textContent = 'Preparando...';
  document.getElementById('trainCounter').style.display = 'block';

  let countdown = 5;
  phase.textContent = '⚠️ Preparate';
  display.textContent = countdown;

  trainInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      display.textContent = countdown;
    } else if (countdown === 0) {
      display.textContent = '¡YA!';
      phase.textContent = '🏁 ¡Arranca!';
    } else {
      trainSeconds = Math.abs(countdown) - 1;
      const h = String(Math.floor(trainSeconds / 3600)).padStart(2, '0');
      const m = String(Math.floor((trainSeconds % 3600) / 60)).padStart(2, '0');
      const s = String(trainSeconds % 60).padStart(2, '0');
      display.textContent = `${h}:${m}:${s}`;
      phase.textContent = '🏊 Entrenando';
      btn.textContent = 'Entrenando...';
    }
  }, 1000);
};

window.cancelTraining = () => {
  if (trainSeconds > 0) guardarRecord();
  clearInterval(trainInterval);
  window.closeModal('trainOverlay');
};

async function guardarRecord() {
  const user = auth.currentUser;
  if (!user || pagina !== 'entrenamiento.html') return;

  const estilo = document.getElementById('btnStartTraining').dataset.estilo;
  if (!estilo || trainSeconds < 5) return; // ignorar tiempos menores a 5s

  try {
    await push(ref(db, `usuarios/${user.uid}/records/${estilo}`), {
      segundos: trainSeconds,
      fecha: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error guardando record', err);
  }
}

// --- 7. ANIMACIONES ---
function inicializarAnimaciones() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = (entry.target.dataset.delay || 0) + 'ms';
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        let current = 0;
        const timer = setInterval(() => {
          current += Math.ceil(target / 50);
          if (current >= target) { el.textContent = target; clearInterval(timer); }
          else el.textContent = current;
        }, 30);
        statObserver.unobserve(el);
      }
    });
  });
  document.querySelectorAll('.stat-val[data-target]').forEach(s => statObserver.observe(s));
}

// Cierre de modales al clickear fuera
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('overlay')) e.target.classList.remove('active');
});

// Navbar sticky scroll
window.addEventListener('scroll', () => {
  document.querySelector('nav')?.classList.toggle('scrolled', window.scrollY > 40);
});

// Inicio
cargarComponentes();
