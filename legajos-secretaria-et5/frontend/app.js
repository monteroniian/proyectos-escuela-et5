const API = 'http://localhost:3000/api';
let token = localStorage.getItem('token');
let tipo = localStorage.getItem('tipo');
let todosAlumnos = [];
let todosDocentes = [];

// ── INIT ──────────────────────────────────────────────
window.onload = () => {
  if (token && tipo) mostrarDashboard();
};

function mostrarDashboard() {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.classList.add('hidden');
  });
  const pagina = tipo === 'alumnos' ? 'page-alumnos' : 'page-docentes';
  const el = document.getElementById(pagina);
  el.classList.remove('hidden');
  el.classList.add('active');
  if (tipo === 'alumnos') cargarAlumnos();
  else cargarDocentes();
}

// ── AUTH ──────────────────────────────────────────────
function switchTab(tab) {
  document.getElementById('form-login').classList.toggle('hidden', tab !== 'login');
  document.getElementById('form-registro').classList.toggle('hidden', tab !== 'registro');
  document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', (i === 0) === (tab === 'login')));
  document.getElementById('auth-error').classList.add('hidden');
}

async function login(e) {
  e.preventDefault();
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: v('login-email'), password: v('login-pass') })
  });
  const data = await res.json();
  if (!res.ok) return showError(data.error);
  todosAlumnos = []; todosDocentes = [];
  document.getElementById('tbody-alumnos').innerHTML = '';
  document.getElementById('tbody-docentes').innerHTML = '';
  token = data.token; tipo = data.tipo;
  localStorage.setItem('token', token);
  localStorage.setItem('tipo', tipo);
  mostrarDashboard();
}

async function registro(e) {
  e.preventDefault();
  const res = await fetch(`${API}/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: v('reg-email'), password: v('reg-pass'), codigo: v('reg-codigo') })
  });
  const data = await res.json();
  if (!res.ok) return showError(data.error);
  showError('Registro exitoso. Ahora iniciá sesión.', false);
  switchTab('login');
}

function logout() {
  localStorage.clear();
  token = null; tipo = null;
  todosAlumnos = []; todosDocentes = [];
  document.getElementById('tbody-alumnos').innerHTML = '';
  document.getElementById('tbody-docentes').innerHTML = '';
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.classList.add('hidden');
  });
  const auth = document.getElementById('page-auth');
  auth.classList.remove('hidden');
  auth.classList.add('active');
}

function showError(msg, isError = true) {
  const el = document.getElementById('auth-error');
  el.textContent = msg;
  el.style.color = isError ? '#e53e3e' : '#2f855a';
  el.classList.remove('hidden');
}

// ── ALUMNOS ───────────────────────────────────────────
async function cargarAlumnos() {
  const res = await fetch(`${API}/alumnos`, { headers: authHeader() });
  todosAlumnos = await res.json();
  renderAlumnos(todosAlumnos);
}

function renderAlumnos(lista) {
  const tbody = document.getElementById('tbody-alumnos');
  tbody.innerHTML = lista.map(a => `
    <tr>
      <td>${a.apellido}</td>
      <td>${a.nombre}</td>
      <td>${a.dni || '-'}</td>
      <td>${a.fecha_nacimiento || '-'}</td>
      <td>${a.anio || '-'}</td>
      <td>${a.division || '-'}</td>
      <td>
        <button class="btn-icon" title="Ver legajo" onclick="verAlumno(${a.id})">&#128269;</button>
        <button class="btn-icon btn-delete" title="Eliminar" onclick="eliminarAlumno(${a.id})">&#128465;</button>
      </td>
    </tr>`).join('');
}

function filtrarAlumnos() {
  const q    = v('buscar-alumno').toLowerCase();
  const dni  = v('filtro-dni').toLowerCase();
  const fnac = v('filtro-fnac');
  const div  = v('filtro-division').toLowerCase();
  renderAlumnos(todosAlumnos.filter(a => {
    if (q   && !a.nombre.toLowerCase().includes(q) && !a.apellido.toLowerCase().includes(q)) return false;
    if (dni  && !(a.dni || '').toLowerCase().includes(dni)) return false;
    if (fnac && (a.fecha_nacimiento || '') !== fnac) return false;
    if (div  && !(a.division || '').toLowerCase().includes(div)) return false;
    return true;
  }));
}

function limpiarFiltros() {
  ['buscar-alumno','filtro-dni','filtro-fnac','filtro-division'].forEach(id => set(id, ''));
  renderAlumnos(todosAlumnos);
}

async function verAlumno(id) {
  const res = await fetch(`${API}/alumnos/${id}`, { headers: authHeader() });
  const a = await res.json();
  set('a-id', a.id);
  set('a-nombre', a.nombre);
  set('a-apellido', a.apellido);
  set('a-tutor-nombre', a.tutor_nombre);
  set('a-tutor-dni', a.tutor_dni);
  set('a-anio', a.anio);
  set('a-division', a.division);
  set('a-dni', a.dni);
  set('a-fnac', a.fecha_nacimiento);
  set('a-fecha', a.fecha_acta);
  chk('d-analitico', a.analitico_incompleto);
  set('d-analitico-anios', a.analitico_anios);
  chk('d-partida', a.partida_nacimiento);
  chk('d-dni', a.dni_actualizado);
  chk('d-dictamen', a.dictamen_equivalencias);
  chk('d-ficha', a.ficha_inscripcion);
  chk('d-salud', a.cert_salud);
  chk('d-primarios', a.cert_primarios);
  set('d-cuil-alumno', a.cuil_alumno);
  set('d-cuil-tutor', a.cuil_tutor);
  chk('d-fotos', a.fotos);
  set('d-boletin-texto', a.boletin);
  abrirModal('modal-alumno');
  // Al editar un alumno existente, saltar el paso OCR
  document.getElementById('paso-ocr').style.display = 'none';
  document.getElementById('paso-form').style.display = 'block';
  cargarImagenes(id);
  document.getElementById('seccion-imagenes').style.display = 'block';
}

function abrirModalAlumno() {
  limpiarFormAlumno();
  alumnoIdActual = null;
  imagenesActuales = [];
  document.getElementById('imgs-grid').innerHTML = '';
  document.getElementById('seccion-imagenes').style.display = 'none';
  // Mostrar paso OCR, ocultar formulario
  document.getElementById('paso-ocr').style.display = 'block';
  document.getElementById('paso-form').style.display = 'none';
  document.getElementById('ocr-previews').innerHTML = '';
  document.getElementById('ocr-estado').textContent = '';
  document.getElementById('ocr-file-input').value = '';
  document.getElementById('btn-ocr-procesar').disabled = true;
  ocrArchivos = [];
  abrirModal('modal-alumno');
}

let ocrArchivos = [];

function ocrDrop(e) {
  e.preventDefault();
  ocrDesdeArchivos(e.dataTransfer.files);
}

function ocrDesdeArchivos(files) {
  for (const f of files) {
    if (!f.type.startsWith('image/')) continue;
    ocrArchivos.push(f);
    const url = URL.createObjectURL(f);
    const div = document.createElement('div');
    div.style.cssText = 'position:relative;display:inline-block';
    div.innerHTML = `<img src="${url}" style="width:80px;height:80px;object-fit:cover;border-radius:6px;border:1px solid #90cdf4">`;
    document.getElementById('ocr-previews').appendChild(div);
  }
  document.getElementById('btn-ocr-procesar').disabled = ocrArchivos.length === 0;
}

async function procesarOcr() {
  const btn = document.getElementById('btn-ocr-procesar');
  const estado = document.getElementById('ocr-estado');
  btn.disabled = true;
  btn.textContent = '⏳ Procesando...';

  const camposExtraidos = {};
  let textoCompleto = '';
  for (let i = 0; i < ocrArchivos.length; i++) {
    estado.textContent = `Analizando imagen ${i + 1} de ${ocrArchivos.length}...`;
    const form = new FormData();
    form.append('imagen', ocrArchivos[i]);
    try {
      const res = await fetch(`${API}/ocr`, { method: 'POST', headers: authHeader(), body: form });
      const data = await res.json();
      if (res.ok) {
        Object.assign(camposExtraidos, data.campos);
        textoCompleto += data.texto + '\n';
      }
    } catch {}
  }

  // Mostrar texto crudo detectado para diagnóstico
  const div = document.getElementById('ocr-texto-crudo');
  if (div) {
    div.style.display = 'block';
    div.querySelector('pre').textContent = textoCompleto.trim() || '(no se detectó texto)';
  }

  // Completar formulario con lo encontrado
  if (camposExtraidos.nombre)           set('a-nombre', camposExtraidos.nombre);
  if (camposExtraidos.apellido)         set('a-apellido', camposExtraidos.apellido);
  if (camposExtraidos.dni)              set('a-dni', camposExtraidos.dni);
  if (camposExtraidos.fecha_nacimiento) set('a-fnac', camposExtraidos.fecha_nacimiento);
  if (camposExtraidos.cuil)             set('d-cuil-alumno', camposExtraidos.cuil);

  const completados = Object.keys(camposExtraidos).length;
  estado.textContent = completados > 0
    ? `✅ Se completaron ${completados} campo(s). Revisá los datos antes de guardar.`
    : '⚠️ No se pudieron extraer datos. Mirá el texto detectado abajo y completá a mano.';

  btn.textContent = '✨ Completar automáticamente';
  saltarOcr();
}

function saltarOcr() {
  document.getElementById('paso-ocr').style.display = 'none';
  document.getElementById('paso-form').style.display = 'block';
}

function limpiarFormAlumno() {
  ['a-id','a-nombre','a-apellido','a-tutor-nombre','a-tutor-dni','a-anio','a-division','a-dni','a-fnac','a-fecha',
   'd-analitico-anios','d-cuil-alumno','d-cuil-tutor','d-boletin-texto'].forEach(id => set(id, ''));
  ['d-analitico','d-partida','d-dni','d-dictamen','d-ficha','d-salud','d-primarios','d-cuil-check','d-fotos','d-boletin']
    .forEach(id => chk(id, false));
}

async function guardarAlumno() {
  if (!v('a-apellido') || !v('a-nombre')) return alert('Nombre y apellido son obligatorios');
  const payload = {
    nombre: v('a-nombre'), apellido: v('a-apellido'), dni: v('a-dni'),
    fecha_nacimiento: v('a-fnac'),
    anio: v('a-anio'), division: v('a-division'),
    tutor_nombre: v('a-tutor-nombre'), tutor_dni: v('a-tutor-dni'), fecha_acta: v('a-fecha'),
    analitico_incompleto: gchk('d-analitico'), analitico_anios: v('d-analitico-anios'),
    partida_nacimiento: gchk('d-partida'), dni_actualizado: gchk('d-dni'),
    dictamen_equivalencias: gchk('d-dictamen'), ficha_inscripcion: gchk('d-ficha'),
    cert_salud: gchk('d-salud'), cert_primarios: gchk('d-primarios'),
    cuil_alumno: v('d-cuil-alumno'), cuil_tutor: v('d-cuil-tutor'),
    fotos: gchk('d-fotos'), boletin: v('d-boletin-texto')
  };

  const id = v('a-id');
  const url = id ? `${API}/alumnos/${id}` : `${API}/alumnos`;
  const method = id ? 'PUT' : 'POST';
  const res = await fetch(url, { method, headers: { ...authHeader(), 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const data = await res.json();
  // Si es nuevo alumno, habilitar subida de imágenes sin cerrar el modal
  if (!id && data.id) {
    set('a-id', data.id);
    alumnoIdActual = data.id;
    imagenesActuales = [];
    renderImagenes();
    document.getElementById('seccion-imagenes').style.display = 'block';
    cargarAlumnos();
    return;
  }
  cerrarModal('modal-alumno');
  cargarAlumnos();
}

async function eliminarAlumno(id) {
  if (!confirm('¿Eliminar este alumno?')) return;
  await fetch(`${API}/alumnos/${id}`, { method: 'DELETE', headers: authHeader() });
  cargarAlumnos();
}

// ── DOCENTES ──────────────────────────────────────────
async function cargarDocentes() {
  const res = await fetch(`${API}/docentes`, { headers: authHeader() });
  todosDocentes = await res.json();
  renderDocentes(todosDocentes);
}

function renderDocentes(lista) {
  const tbody = document.getElementById('tbody-docentes');
  tbody.innerHTML = lista.map(d => `
    <tr>
      <td>${d.apellido}</td>
      <td>${d.nombre}</td>
      <td>${d.dni || '-'}</td>
      <td>${d.cargo || '-'}</td>
      <td>${d.materia || '-'}</td>
      <td>
        <button class="btn-icon" title="Ver legajo" onclick="verDocente(${d.id})">🔍</button>
        <button class="btn-icon btn-delete" title="Eliminar" onclick="eliminarDocente(${d.id})">🗑️</button>
      </td>
    </tr>`).join('');
}

function filtrarDocentes() {
  const q       = v('buscar-docente').toLowerCase();
  const dni     = v('filtro-doc-dni').toLowerCase();
  const cargo   = v('filtro-doc-cargo').toLowerCase();
  const materia = v('filtro-doc-materia').toLowerCase();
  renderDocentes(todosDocentes.filter(d => {
    if (q       && !d.nombre.toLowerCase().includes(q) && !d.apellido.toLowerCase().includes(q)) return false;
    if (dni     && !(d.dni    ||'').toLowerCase().includes(dni))     return false;
    if (cargo   && !(d.cargo  ||'').toLowerCase().includes(cargo))   return false;
    if (materia && !(d.materia||'').toLowerCase().includes(materia)) return false;
    return true;
  }));
}

function limpiarFiltrosDocentes() {
  ['buscar-docente','filtro-doc-dni','filtro-doc-cargo','filtro-doc-materia'].forEach(id => set(id, ''));
  renderDocentes(todosDocentes);
}

// ── OCR DOCENTE ─────────────────────────────────────────────
let ocrArchivosDoc = [];

function ocrDropDoc(e) {
  e.preventDefault();
  ocrDesdeArchivosDoc(e.dataTransfer.files);
}

function ocrDesdeArchivosDoc(files) {
  for (const f of files) {
    if (!f.type.startsWith('image/')) continue;
    ocrArchivosDoc.push(f);
    const url = URL.createObjectURL(f);
    const div = document.createElement('div');
    div.style.cssText = 'position:relative;display:inline-block';
    div.innerHTML = `<img src="${url}" style="width:80px;height:80px;object-fit:cover;border-radius:6px;border:1px solid #90cdf4">`;
    document.getElementById('ocr-previews-doc').appendChild(div);
  }
  document.getElementById('btn-ocr-procesar-doc').disabled = ocrArchivosDoc.length === 0;
}

async function procesarOcrDoc() {
  const btn = document.getElementById('btn-ocr-procesar-doc');
  const estado = document.getElementById('ocr-estado-doc');
  btn.disabled = true;
  btn.textContent = '⏳ Procesando...';
  const campos = {};
  let textoCompleto = '';
  for (let i = 0; i < ocrArchivosDoc.length; i++) {
    estado.textContent = `Analizando imagen ${i + 1} de ${ocrArchivosDoc.length}...`;
    const form = new FormData();
    form.append('imagen', ocrArchivosDoc[i]);
    try {
      const res = await fetch(`${API}/ocr`, { method: 'POST', headers: authHeader(), body: form });
      const data = await res.json();
      if (res.ok) { Object.assign(campos, data.campos); textoCompleto += data.texto + '\n'; }
    } catch {}
  }
  const div = document.getElementById('ocr-texto-crudo-doc');
  if (div) { div.style.display = 'block'; div.querySelector('pre').textContent = textoCompleto.trim() || '(no se detectó texto)'; }
  if (campos.nombre)           set('doc-nombre', campos.nombre);
  if (campos.apellido)         set('doc-apellido', campos.apellido);
  if (campos.dni)              set('doc-dni', campos.dni);
  if (campos.fecha_nacimiento) set('doc-fecha-nacimiento', campos.fecha_nacimiento);
  if (campos.cuil)             set('doc-cuil', campos.cuil);
  const completados = Object.keys(campos).length;
  estado.textContent = completados > 0
    ? `✅ Se completaron ${completados} campo(s). Revisá los datos antes de guardar.`
    : '⚠️ No se pudieron extraer datos. Completá a mano.';
  btn.textContent = '✨ Completar automáticamente';
  saltarOcrDoc();
}

function saltarOcrDoc() {
  document.getElementById('paso-ocr-doc').style.display = 'none';
  document.getElementById('paso-form-doc').style.display = 'block';
}

async function verDocente(id) {
  const res = await fetch(`${API}/docentes/${id}`, { headers: authHeader() });
  const d = await res.json();
  set('doc-id', d.id);
  set('doc-apellido', d.apellido);
  set('doc-nombre', d.nombre);
  set('doc-dni', d.dni);
  set('doc-cuil', d.cuil);
  set('doc-cargo', d.cargo);
  set('doc-materia', d.materia);
  set('doc-telefono', d.telefono);
  set('doc-email', d.email);
  set('doc-fecha-nacimiento', d.fecha_nacimiento);
  set('doc-nacionalidad', d.nacionalidad);
  set('doc-direccion', d.direccion);
  set('doc-telefono-alt', d.telefono_alt);
  set('doc-titulos', d.titulos);
  set('doc-fecha-ingreso', d.fecha_ingreso);
  set('doc-turno', d.turno);
  set('doc-situacion-revista', d.situacion_revista);
  set('doc-reemplaza-a', d.reemplaza_a);
  set('doc-domicilio-distrito', d.domicilio_distrito);
  set('doc-fecha-acta', d.fecha_acta);
  set('doc-dias-acta', d.dias_acta);
  set('doc-mes-acta', d.mes_acta);
  abrirModal('modal-docente');
  document.getElementById('paso-ocr-doc').style.display = 'none';
  document.getElementById('paso-form-doc').style.display = 'block';
  cargarImagenesDocente(id);
  document.getElementById('seccion-imagenes-docente').style.display = 'block';
}

function abrirModalDocente() {
  ['doc-id','doc-apellido','doc-nombre','doc-dni','doc-cuil','doc-cargo','doc-materia','doc-telefono','doc-email',
   'doc-fecha-nacimiento','doc-nacionalidad','doc-direccion','doc-telefono-alt','doc-titulos','doc-fecha-ingreso',
   'doc-turno','doc-situacion-revista','doc-reemplaza-a','doc-domicilio-distrito','doc-fecha-acta','doc-dias-acta',
   'doc-mes-acta','doc-director','doc-director2'].forEach(id => set(id, ''));
  docenteIdActual = null;
  imagenesDocente = [];
  document.getElementById('imgs-grid-docente').innerHTML = '';
  document.getElementById('seccion-imagenes-docente').style.display = 'none';
  document.getElementById('paso-ocr-doc').style.display = 'block';
  document.getElementById('paso-form-doc').style.display = 'none';
  document.getElementById('ocr-previews-doc').innerHTML = '';
  document.getElementById('ocr-estado-doc').textContent = '';
  document.getElementById('ocr-file-input-doc').value = '';
  document.getElementById('btn-ocr-procesar-doc').disabled = true;
  ocrArchivosDoc = [];
  abrirModal('modal-docente');
}

async function guardarDocente() {
  const payload = {
    nombre: v('doc-nombre'), apellido: v('doc-apellido'), dni: v('doc-dni'),
    cuil: v('doc-cuil'), cargo: v('doc-cargo'), materia: v('doc-materia'),
    telefono: v('doc-telefono'), email: v('doc-email'),
    fecha_nacimiento: v('doc-fecha-nacimiento'), nacionalidad: v('doc-nacionalidad'),
    direccion: v('doc-direccion'), telefono_alt: v('doc-telefono-alt'),
    titulos: v('doc-titulos'), fecha_ingreso: v('doc-fecha-ingreso'),
    turno: v('doc-turno'), situacion_revista: v('doc-situacion-revista'),
    reemplaza_a: v('doc-reemplaza-a'), domicilio_distrito: v('doc-domicilio-distrito'),
    fecha_acta: v('doc-fecha-acta'), dias_acta: v('doc-dias-acta'), mes_acta: v('doc-mes-acta')
  };
  if (!payload.nombre || !payload.apellido) return alert('Nombre y apellido son obligatorios');
  const id = v('doc-id');
  const url = id ? `${API}/docentes/${id}` : `${API}/docentes`;
  const method = id ? 'PUT' : 'POST';
  const res = await fetch(url, { method, headers: { ...authHeader(), 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const data = await res.json();
  if (!id && data.id) {
    set('doc-id', data.id);
    docenteIdActual = data.id;
    imagenesDocente = [];
    renderImagenesDocente();
    document.getElementById('seccion-imagenes-docente').style.display = 'block';
    cargarDocentes();
    return;
  }
  cerrarModal('modal-docente');
  cargarDocentes();
}

async function eliminarDocente(id) {
  if (!confirm('¿Eliminar este docente?')) return;
  await fetch(`${API}/docentes/${id}`, { method: 'DELETE', headers: authHeader() });
  cargarDocentes();
}

// ── IMPRIMIR ───────────────────────────────────────────
function imprimirLegajo() {
  const chkBox = (checked) => `<span style="display:inline-block;width:13px;height:13px;border:1px solid #333;margin-right:6px;vertical-align:middle;background:${checked ? '#333' : '#fff'}"></span>`;
  const val = (id) => document.getElementById(id)?.value || '';
  const chk = (id) => document.getElementById(id)?.checked || false;

  // Construir miniaturas de imágenes para imprimir
  const imgsPorTipo = {};
  TIPOS_IMG.forEach(t => {
    imgsPorTipo[t.key] = imagenesActuales
      .filter(i => i.tipo === t.key)
      .map(i => {
        const url = `http://localhost:3000/uploads/${i.filename}`;
        return i.filename.endsWith('.pdf')
          ? `<div style="font-size:1.5rem">&#128196; PDF adjunto</div>`
          : `<img src="${url}" style="max-width:120px;max-height:100px;object-fit:cover;border:1px solid #ccc;border-radius:4px;margin:2px">`;
      }).join('');
  });

  const seccionImagenes = imagenesActuales.length > 0 ? `
    <div style="margin-top:18px">
      <h4 style="text-align:center;text-decoration:underline;margin-bottom:10px">DOCUMENTOS ADJUNTOS</h4>
      <table style="width:100%;border-collapse:collapse;font-size:0.8rem">
        <tr>
          ${TIPOS_IMG.map(t => `<td style="border:1px solid #ccc;padding:6px;vertical-align:top;text-align:center">
            <div style="font-weight:600;margin-bottom:4px">${t.label}</div>
            ${imgsPorTipo[t.key] || '<span style="color:#aaa">-</span>'}
          </td>`).join('')}
        </tr>
      </table>
    </div>` : '';

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Legajo - ${val('a-apellido')} ${val('a-nombre')}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 11pt; color: #000; padding: 20mm 18mm; }
    .header { display: flex; align-items: center; gap: 14px; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
    .header img { width: 65px; height: 65px; object-fit: contain; }
    .titulo { text-align: center; font-size: 13pt; font-weight: bold; text-decoration: underline; margin: 10px 0 4px; }
    .texto { text-align: justify; margin-bottom: 10px; line-height: 1.6; }
    .subrayado { border-bottom: 1px solid #000; display: inline-block; min-width: 120px; padding: 0 3px; }
    .subrayado.corto { min-width: 50px; }
    .doc-titulo { text-align: center; text-decoration: underline; font-weight: bold; margin: 10px 0 6px; }
    .doc-item { display: flex; align-items: center; margin-bottom: 5px; }
    .nota { font-size: 9pt; text-align: justify; margin: 10px 0; line-height: 1.5; }
    .firmas { display: flex; justify-content: space-between; margin-top: 40px; }
    .firma-box { text-align: center; width: 40%; }
    .firma-linea { border-top: 1px solid #000; margin-bottom: 5px; }
    @media print {
      body { padding: 10mm 12mm; }
      @page { margin: 10mm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="http://localhost:3000/Logo%20de%20la%20escuela.webp" alt="Logo">
    <div>
      <strong>ESCUELA DE EDUCACIÓN SECUNDARIA TÉCNICA N° 5</strong><br>
      Calle 368 B esquina 316 Ranelagh – CP 1886<br>
      TE: 4258-4354 &nbsp; email: eestn5berazategui@gmail.com
    </div>
  </div>

  <div class="titulo">ACTA DE COMPROMISO</div>
  <p class="texto">Berazategui, <span class="subrayado corto">${val('a-fecha')}</span> de 20___</p>

  <p class="texto">
    El/la que suscribe <span class="subrayado">${val('a-tutor-nombre')}</span>
    DNI N° <span class="subrayado corto">${val('a-tutor-dni')}</span>
    padre/madre/tutor del alumno/a
    <span class="subrayado">${val('a-apellido')} ${val('a-nombre')}</span>
    inscripto en forma condicional en
    <span class="subrayado corto">${val('a-anio')}</span> año
    <span class="subrayado corto">${val('a-division')}</span> división,
    se compromete a entregar dentro del plazo de cuarenta y cinco (45) días (a partir de Marzo 2018)
    y de acuerdo a las normas vigentes para poder cumplimentar el legajo correspondiente para un normal
    desarrollo administrativo de la trayectoria escolar del educando, los siguientes documentos:
  </p>

  <p class="texto"><strong>DNI:</strong> <span class="subrayado">${val('a-dni')}</span></p>

  <div class="doc-titulo">DOCUMENTACIÓN FALTANTE:</div>

  <div class="doc-item">${chkBox(chk('d-analitico'))} Analítico incompleto de los siguientes años: <span class="subrayado" style="min-width:80px">${val('d-analitico-anios')}</span></div>
  <div class="doc-item">${chkBox(chk('d-partida'))} Fotocopia de Partida de Nacimiento</div>
  <div class="doc-item">${chkBox(chk('d-dni'))} Fotocopia de DNI actualizado</div>
  <div class="doc-item">${chkBox(chk('d-dictamen'))} Dictamen de equivalencias firmado.</div>
  <div class="doc-item">${chkBox(chk('d-ficha'))} Ficha / constancia de inscripción.</div>
  <div class="doc-item">${chkBox(chk('d-salud'))} Certificado de Salud para Educación Física.</div>
  <div class="doc-item">${chkBox(chk('d-primarios'))} Certificado de finalización de estudios Primarios.</div>
  <div class="doc-item">${chkBox(chk('d-cuil-check'))} CUIL del alumno <span class="subrayado">${val('d-cuil-alumno')}</span> &nbsp; CUIL Madre/Padre/Tutor <span class="subrayado">${val('d-cuil-tutor')}</span></div>
  <div class="doc-item">${chkBox(chk('d-fotos'))} Fotos</div>
  <div class="doc-item">${chkBox(chk('d-boletin'))} Boletín de <span class="subrayado">${val('d-boletin-texto')}</span></div>

  ${seccionImagenes}

  <p class="nota">
    Se notifica que, ante la falta de cualquier documentación antes mencionada:<br>
    -No se autorizará a rendir equivalencias y/o materias previas, si a la fecha de la misma no se consta del Certificado Analítico requerido.<br>
    -Si a la presentación del certificado Analítico se comprobara que no coincide con la constancia provisoria, podrá modificarse el dictamen dado en forma condicional al inscribirse.
  </p>
  <p style="text-align:right;font-size:10pt;margin-bottom:30px">Atte. La Dirección</p>

  <div class="firmas">
    <div class="firma-box"><div class="firma-linea"></div><p>FIRMA DEL PADRE/TUTOR</p></div>
    <div class="firma-box"><div class="firma-linea"></div><p>NOTIFICACIÓN DEL ALUMNO</p></div>
  </div>

  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  win.document.write(html);
  win.document.close();
}

// ── IMÁGENES ─────────────────────────────────────────────
const TIPOS_IMG = [
  { key: 'partida_nacimiento', label: 'Partida de Nacimiento' },
  { key: 'dni_actualizado',    label: 'DNI Actualizado' },
  { key: 'cert_salud',         label: 'Cert. Salud Ed. Física' },
  { key: 'cert_primarios',     label: 'Cert. Estudios Primarios' },
  { key: 'cuil_alumno',        label: 'CUIL Alumno' },
  { key: 'cuil_tutor',         label: 'CUIL Madre/Padre/Tutor' },
  { key: 'fotos',              label: 'Fotos del Alumno' },
];

let alumnoIdActual = null;
let imagenesActuales = [];

async function cargarImagenes(alumnoId) {
  alumnoIdActual = alumnoId;
  const res = await fetch(`${API}/alumnos/${alumnoId}/imagenes`, { headers: authHeader() });
  imagenesActuales = await res.json();
  renderImagenes();
}

function renderImagenes() {
  const grid = document.getElementById('imgs-grid');
  grid.innerHTML = TIPOS_IMG.map(t => {
    const imgs = imagenesActuales.filter(i => i.tipo === t.key);
    const miniaturas = imgs.map(i => {
      const url = `http://localhost:3000/uploads/${i.filename}`;
      const esPdf = i.filename.endsWith('.pdf');
      return `
        <div style="position:relative;display:inline-block;width:100%">
          ${esPdf
            ? `<div class="pdf-icon" onclick="window.open('${url}','_blank')" title="Abrir PDF">📄</div>`
            : `<img src="${url}" onclick="abrirVisor('${url}')" title="Ver imagen">`
          }
          <button onclick="eliminarImagen(${i.id})" style="position:absolute;top:2px;right:2px;background:rgba(255,255,255,0.85);border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:0.75rem;color:#e53e3e;display:flex;align-items:center;justify-content:center">✕</button>
          ${!esPdf ? `<button data-ocr="${i.filename}" onclick="escanearImagen('${i.filename}')" style="margin-top:4px;width:100%;font-size:0.72rem;padding:2px 4px;background:#ebf8ff;border:1px solid #90cdf4;border-radius:4px;cursor:pointer;color:#2b6cb0">🔍 Escanear</button>` : ''}
        </div>`;
    }).join('');

    return `
      <div class="img-card">
        <div class="img-card-header">${t.label}</div>
        <div class="img-card-body">
          ${miniaturas || '<span style="font-size:0.78rem;color:#aaa">Sin archivos</span>'}
          <label class="img-upload-btn">
            ➕ Subir archivo
            <input type="file" accept="image/*,application/pdf" onchange="subirImagen(this,'${t.key}')">
          </label>
        </div>
      </div>`;
  }).join('');
}

async function subirImagen(input, tipo) {
  if (!input.files[0] || !alumnoIdActual) return;
  const form = new FormData();
  form.append('archivo', input.files[0]);
  form.append('tipo', tipo);
  const res = await fetch(`${API}/alumnos/${alumnoIdActual}/imagenes`, {
    method: 'POST',
    headers: authHeader(),
    body: form
  });
  if (res.ok) {
    const nueva = await res.json();
    imagenesActuales.push(nueva);
    renderImagenes();
  } else {
    alert('Error al subir el archivo');
  }
  input.value = '';
}

async function escanearImagen(filename) {
  const btn = document.querySelector(`[data-ocr="${filename}"]`);
  if (btn) { btn.textContent = '⏳'; btn.disabled = true; }

  try {
    const blob = await (await fetch(`http://localhost:3000/uploads/${filename}`)).blob();
    const form = new FormData();
    form.append('imagen', blob, filename);
    const res = await fetch(`${API}/ocr`, { method: 'POST', headers: authHeader(), body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    const c = data.campos;
    let completados = 0;
    if (c.nombre    && !v('a-nombre'))    { set('a-nombre', c.nombre);       completados++; }
    if (c.apellido  && !v('a-apellido'))  { set('a-apellido', c.apellido);   completados++; }
    if (c.dni       && !v('a-dni'))       { set('a-dni', c.dni);             completados++; }
    if (c.fecha_nacimiento && !v('a-fnac')) { set('a-fnac', c.fecha_nacimiento); completados++; }
    if (c.cuil      && !v('d-cuil-alumno')) { set('d-cuil-alumno', c.cuil);  completados++; }

    alert(completados > 0
      ? `✅ Se completaron ${completados} campo(s) automáticamente.\n\nTexto detectado:\n${data.texto.slice(0, 300)}`
      : `⚠️ No se pudieron extraer datos automáticamente.\n\nTexto detectado:\n${data.texto.slice(0, 300) || '(ninguno)'}`);
  } catch (e) {
    alert('Error al escanear: ' + e.message);
  }

  if (btn) { btn.textContent = '🔍 Escanear'; btn.disabled = false; }
}

async function eliminarImagen(id) {
  if (!confirm('¿Eliminar este archivo?')) return;
  await fetch(`${API}/imagenes/${id}`, { method: 'DELETE', headers: authHeader() });
  imagenesActuales = imagenesActuales.filter(i => i.id !== id);
  renderImagenes();
}

function abrirVisor(url) {
  document.getElementById('visor-img-src').src = url;
  document.getElementById('visor-img').classList.add('open');
}

// ── IMÁGENES DOCENTE ─────────────────────────────────────
let docenteIdActual = null;
let imagenesDocente = [];

async function cargarImagenesDocente(docenteId) {
  docenteIdActual = docenteId;
  const res = await fetch(`${API}/docentes/${docenteId}/imagenes`, { headers: authHeader() });
  imagenesDocente = await res.json();
  renderImagenesDocente();
}

function renderImagenesDocente() {
  const grid = document.getElementById('imgs-grid-docente');
  const imgs = imagenesDocente;
  const miniaturas = imgs.map(i => {
    const url = `http://localhost:3000/uploads/${i.filename}`;
    const esPdf = i.filename.endsWith('.pdf');
    return `
      <div style="position:relative;display:inline-block;width:100%">
        ${esPdf
          ? `<div class="pdf-icon" onclick="window.open('${url}','_blank')" title="Abrir PDF">📄</div>`
          : `<img src="${url}" onclick="abrirVisor('${url}')" title="Ver imagen">`
        }
        <button onclick="eliminarImagenDocente(${i.id})" style="position:absolute;top:2px;right:2px;background:rgba(255,255,255,0.85);border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:0.75rem;color:#e53e3e;display:flex;align-items:center;justify-content:center">✕</button>
      </div>`;
  }).join('');

  grid.innerHTML = `
    <div class="img-card">
      <div class="img-card-header">Documentos del Docente</div>
      <div class="img-card-body">
        ${miniaturas || '<span style="font-size:0.78rem;color:#aaa">Sin archivos</span>'}
        <label class="img-upload-btn">
          ➕ Subir archivo
          <input type="file" accept="image/*,application/pdf" onchange="subirImagenDocente(this)">
        </label>
      </div>
    </div>`;
}

async function subirImagenDocente(input) {
  if (!input.files[0] || !docenteIdActual) return;
  const form = new FormData();
  form.append('archivo', input.files[0]);
  form.append('tipo', 'documento');
  const res = await fetch(`${API}/docentes/${docenteIdActual}/imagenes`, {
    method: 'POST',
    headers: authHeader(),
    body: form
  });
  if (res.ok) {
    const nueva = await res.json();
    imagenesDocente.push(nueva);
    renderImagenesDocente();
  } else {
    alert('Error al subir el archivo');
  }
  input.value = '';
}

async function eliminarImagenDocente(id) {
  if (!confirm('¿Eliminar este archivo?')) return;
  await fetch(`${API}/imagenes-docente/${id}`, { method: 'DELETE', headers: authHeader() });
  imagenesDocente = imagenesDocente.filter(i => i.id !== id);
  renderImagenesDocente();
}

// ── UTILS ─────────────────────────────────────────────
function v(id) { return document.getElementById(id)?.value || ''; }
function set(id, val) { const el = document.getElementById(id); if (el) el.value = val || ''; }
function chk(id, val) { const el = document.getElementById(id); if (el) el.checked = !!val; }
function gchk(id) { return document.getElementById(id)?.checked ? 1 : 0; }
function authHeader() { return { Authorization: `Bearer ${token}` }; }
function abrirModal(id) { document.getElementById(id).classList.add('open'); }
function cerrarModal(id) { document.getElementById(id).classList.remove('open'); }
