const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createWorker } = require('tesseract.js');
const sharp = require('sharp');
const db = require('./db');

const app = express();
const SECRET = 'secretaria_jwt_secret_2024';
const UPLOADS_DIR = path.join(__dirname, 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf')
      cb(null, true);
    else cb(new Error('Solo imágenes o PDF'));
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static('../frontend'));
app.use(express.static('..'));

// Middleware auth
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Sin token' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}

// ── AUTH ──────────────────────────────────────────────
app.post('/api/registro', async (req, res) => {
  const { email, password, codigo } = req.body;
  if (!email || !password || !codigo) return res.status(400).json({ error: 'Faltan campos' });

  const tipo = codigo === 'Docentes' ? 'docentes' : codigo === 'Alumnos' ? 'alumnos' : null;
  if (!tipo) return res.status(400).json({ error: 'Código incorrecto' });

  try {
    const hash = await bcrypt.hash(password, 10);
    db.prepare('INSERT INTO usuarios (email, password, tipo) VALUES (?, ?, ?)').run(email, hash, tipo);
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: 'El email ya está registrado' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Credenciales incorrectas' });

  const token = jwt.sign({ id: user.id, email: user.email, tipo: user.tipo }, SECRET, { expiresIn: '8h' });
  res.json({ token, tipo: user.tipo });
});

// ── ALUMNOS ───────────────────────────────────────────
app.get('/api/alumnos', auth, (req, res) => {
  if (req.user.tipo !== 'alumnos') return res.status(403).json({ error: 'Sin permiso' });
  res.json(db.prepare('SELECT id, nombre, apellido, dni, fecha_nacimiento, anio, division FROM alumnos ORDER BY apellido').all());
});

app.get('/api/alumnos/:id', auth, (req, res) => {
  if (req.user.tipo !== 'alumnos') return res.status(403).json({ error: 'Sin permiso' });
  const alumno = db.prepare('SELECT * FROM alumnos WHERE id = ?').get(req.params.id);
  if (!alumno) return res.status(404).json({ error: 'No encontrado' });
  res.json(alumno);
});

app.post('/api/alumnos', auth, (req, res) => {
  if (req.user.tipo !== 'alumnos') return res.status(403).json({ error: 'Sin permiso' });
  const d = req.body;
  const r = db.prepare(`INSERT INTO alumnos (nombre,apellido,dni,fecha_nacimiento,anio,division,analitico_incompleto,analitico_anios,
    partida_nacimiento,dni_actualizado,dictamen_equivalencias,ficha_inscripcion,cert_salud,cert_primarios,
    cuil_alumno,cuil_tutor,fotos,boletin,tutor_nombre,tutor_dni,fecha_acta)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
    d.nombre, d.apellido, d.dni, d.fecha_nacimiento || '', d.anio, d.division,
    d.analitico_incompleto ? 1 : 0, d.analitico_anios || '',
    d.partida_nacimiento ? 1 : 0, d.dni_actualizado ? 1 : 0,
    d.dictamen_equivalencias ? 1 : 0, d.ficha_inscripcion ? 1 : 0,
    d.cert_salud ? 1 : 0, d.cert_primarios ? 1 : 0,
    d.cuil_alumno || '', d.cuil_tutor || '',
    d.fotos ? 1 : 0, d.boletin || '',
    d.tutor_nombre || '', d.tutor_dni || '', d.fecha_acta || ''
  );
  res.json({ id: r.lastInsertRowid });
});

app.put('/api/alumnos/:id', auth, (req, res) => {
  if (req.user.tipo !== 'alumnos') return res.status(403).json({ error: 'Sin permiso' });
  const d = req.body;
  db.prepare(`UPDATE alumnos SET nombre=?,apellido=?,dni=?,fecha_nacimiento=?,anio=?,division=?,analitico_incompleto=?,analitico_anios=?,
    partida_nacimiento=?,dni_actualizado=?,dictamen_equivalencias=?,ficha_inscripcion=?,cert_salud=?,cert_primarios=?,
    cuil_alumno=?,cuil_tutor=?,fotos=?,boletin=?,tutor_nombre=?,tutor_dni=?,fecha_acta=? WHERE id=?`).run(
    d.nombre, d.apellido, d.dni, d.fecha_nacimiento || '', d.anio, d.division,
    d.analitico_incompleto ? 1 : 0, d.analitico_anios || '',
    d.partida_nacimiento ? 1 : 0, d.dni_actualizado ? 1 : 0,
    d.dictamen_equivalencias ? 1 : 0, d.ficha_inscripcion ? 1 : 0,
    d.cert_salud ? 1 : 0, d.cert_primarios ? 1 : 0,
    d.cuil_alumno || '', d.cuil_tutor || '',
    d.fotos ? 1 : 0, d.boletin || '',
    d.tutor_nombre || '', d.tutor_dni || '', d.fecha_acta || '',
    req.params.id
  );
  res.json({ ok: true });
});

app.delete('/api/alumnos/:id', auth, (req, res) => {
  if (req.user.tipo !== 'alumnos') return res.status(403).json({ error: 'Sin permiso' });
  // Eliminar imágenes físicas del alumno
  const imgs = db.prepare('SELECT filename FROM imagenes_alumno WHERE alumno_id = ?').all(req.params.id);
  imgs.forEach(i => { try { fs.unlinkSync(path.join(UPLOADS_DIR, i.filename)); } catch {} });
  db.prepare('DELETE FROM alumnos WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ── IMÁGENES ALUMNO ───────────────────────────────────
const TIPOS_IMAGEN = ['partida_nacimiento','dni_actualizado','cert_salud','cert_primarios','cuil_alumno','cuil_tutor','fotos'];

app.get('/api/alumnos/:id/imagenes', auth, (req, res) => {
  if (req.user.tipo !== 'alumnos') return res.status(403).json({ error: 'Sin permiso' });
  res.json(db.prepare('SELECT * FROM imagenes_alumno WHERE alumno_id = ?').all(req.params.id));
});

app.post('/api/alumnos/:id/imagenes', auth, upload.single('archivo'), (req, res) => {
  if (req.user.tipo !== 'alumnos') return res.status(403).json({ error: 'Sin permiso' });
  const { tipo } = req.body;
  if (!TIPOS_IMAGEN.includes(tipo)) return res.status(400).json({ error: 'Tipo inválido' });
  if (!req.file) return res.status(400).json({ error: 'Sin archivo' });
  const r = db.prepare('INSERT INTO imagenes_alumno (alumno_id, tipo, filename) VALUES (?, ?, ?)')
    .run(req.params.id, tipo, req.file.filename);
  res.json({ id: r.lastInsertRowid, filename: req.file.filename, tipo });
});

app.delete('/api/imagenes/:id', auth, (req, res) => {
  if (req.user.tipo !== 'alumnos') return res.status(403).json({ error: 'Sin permiso' });
  const img = db.prepare('SELECT * FROM imagenes_alumno WHERE id = ?').get(req.params.id);
  if (!img) return res.status(404).json({ error: 'No encontrada' });
  try { fs.unlinkSync(path.join(UPLOADS_DIR, img.filename)); } catch {}
  db.prepare('DELETE FROM imagenes_alumno WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ── DOCENTES ──────────────────────────────────────────
app.get('/api/docentes', auth, (req, res) => {
  if (req.user.tipo !== 'docentes') return res.status(403).json({ error: 'Sin permiso' });
  res.json(db.prepare('SELECT * FROM docentes ORDER BY apellido').all());
});

app.get('/api/docentes/:id', auth, (req, res) => {
  if (req.user.tipo !== 'docentes') return res.status(403).json({ error: 'Sin permiso' });
  const d = db.prepare('SELECT * FROM docentes WHERE id = ?').get(req.params.id);
  if (!d) return res.status(404).json({ error: 'No encontrado' });
  res.json(d);
});

app.post('/api/docentes', auth, (req, res) => {
  if (req.user.tipo !== 'docentes') return res.status(403).json({ error: 'Sin permiso' });
  const d = req.body;
  const r = db.prepare(`INSERT INTO docentes (nombre,apellido,dni,cuil,cargo,materia,telefono,email,
    fecha_nacimiento,nacionalidad,direccion,telefono_alt,titulos,fecha_ingreso,
    turno,situacion_revista,reemplaza_a,domicilio_distrito,fecha_acta,dias_acta,mes_acta)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(d.nombre, d.apellido, d.dni||'', d.cuil||'', d.cargo||'', d.materia||'', d.telefono||'', d.email||'',
      d.fecha_nacimiento||'', d.nacionalidad||'', d.direccion||'', d.telefono_alt||'', d.titulos||'', d.fecha_ingreso||'',
      d.turno||'', d.situacion_revista||'', d.reemplaza_a||'', d.domicilio_distrito||'', d.fecha_acta||'', d.dias_acta||'', d.mes_acta||'');
  res.json({ id: r.lastInsertRowid });
});

app.put('/api/docentes/:id', auth, (req, res) => {
  if (req.user.tipo !== 'docentes') return res.status(403).json({ error: 'Sin permiso' });
  const d = req.body;
  db.prepare(`UPDATE docentes SET nombre=?,apellido=?,dni=?,cuil=?,cargo=?,materia=?,telefono=?,email=?,
    fecha_nacimiento=?,nacionalidad=?,direccion=?,telefono_alt=?,titulos=?,fecha_ingreso=?,
    turno=?,situacion_revista=?,reemplaza_a=?,domicilio_distrito=?,fecha_acta=?,dias_acta=?,mes_acta=? WHERE id=?`)
    .run(d.nombre, d.apellido, d.dni||'', d.cuil||'', d.cargo||'', d.materia||'', d.telefono||'', d.email||'',
      d.fecha_nacimiento||'', d.nacionalidad||'', d.direccion||'', d.telefono_alt||'', d.titulos||'', d.fecha_ingreso||'',
      d.turno||'', d.situacion_revista||'', d.reemplaza_a||'', d.domicilio_distrito||'', d.fecha_acta||'', d.dias_acta||'', d.mes_acta||'',
      req.params.id);
  res.json({ ok: true });
});

app.delete('/api/docentes/:id', auth, (req, res) => {
  if (req.user.tipo !== 'docentes') return res.status(403).json({ error: 'Sin permiso' });
  const imgs = db.prepare('SELECT filename FROM imagenes_docente WHERE docente_id = ?').all(req.params.id);
  imgs.forEach(i => { try { fs.unlinkSync(path.join(UPLOADS_DIR, i.filename)); } catch {} });
  db.prepare('DELETE FROM docentes WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ── IMÁGENES DOCENTE ──────────────────────────────────
app.get('/api/docentes/:id/imagenes', auth, (req, res) => {
  if (req.user.tipo !== 'docentes') return res.status(403).json({ error: 'Sin permiso' });
  res.json(db.prepare('SELECT * FROM imagenes_docente WHERE docente_id = ?').all(req.params.id));
});

app.post('/api/docentes/:id/imagenes', auth, upload.single('archivo'), (req, res) => {
  if (req.user.tipo !== 'docentes') return res.status(403).json({ error: 'Sin permiso' });
  const { tipo } = req.body;
  if (!req.file) return res.status(400).json({ error: 'Sin archivo' });
  const r = db.prepare('INSERT INTO imagenes_docente (docente_id, tipo, filename) VALUES (?, ?, ?)')
    .run(req.params.id, tipo, req.file.filename);
  res.json({ id: r.lastInsertRowid, filename: req.file.filename, tipo });
});

app.delete('/api/imagenes-docente/:id', auth, (req, res) => {
  if (req.user.tipo !== 'docentes') return res.status(403).json({ error: 'Sin permiso' });
  const img = db.prepare('SELECT * FROM imagenes_docente WHERE id = ?').get(req.params.id);
  if (!img) return res.status(404).json({ error: 'No encontrada' });
  try { fs.unlinkSync(path.join(UPLOADS_DIR, img.filename)); } catch {}
  db.prepare('DELETE FROM imagenes_docente WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ── OCR ──────────────────────────────────────────────
app.post('/api/ocr', auth, upload.single('imagen'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Sin imagen' });
  const filePath = path.join(UPLOADS_DIR, req.file.filename);
  const procPath = filePath + '_proc.png';
  try {
    // Preprocesar: escala de grises + contraste alto + binarizar
    await sharp(filePath)
      .resize({ width: 1800, withoutEnlargement: true })
      .grayscale()
      .normalise()
      .linear(1.8, -60)
      .threshold(140)
      .png()
      .toFile(procPath);

    const worker = await createWorker('spa');
    const { data: { text } } = await worker.recognize(procPath);
    await worker.terminate();
    fs.unlinkSync(filePath);
    fs.unlinkSync(procPath);
    res.json({ texto: text, campos: extraerCampos(text) });
  } catch (e) {
    try { fs.unlinkSync(filePath); } catch {}
    try { fs.unlinkSync(procPath); } catch {}
    res.status(500).json({ error: 'Error al procesar imagen: ' + e.message });
  }
});

function extraerCampos(texto) {
  const lineas = texto.split('\n').map(l => l.trim()).filter(Boolean);
  const t = lineas.join(' ');
  const campos = {};

  console.log('=== TEXTO OCR ===');
  console.log(texto);
  console.log('=== FIN TEXTO OCR ===');

  // ── MRZ (líneas con <<): extraer apellido y nombre de la última línea tipo GONZALEZ<RODRIGUEZ<<MARIANA<FL
  const mrzLinea = lineas.find(l => /[A-Z]{2,}<[A-Z<]{5,}/.test(l));
  if (mrzLinea) {
    const limpio = mrzLinea.replace(/[^A-Z<]/g, '');
    const partes = limpio.split('<<').filter(Boolean);
    if (partes[0]) campos.apellido = partes[0].replace(/</g, ' ').trim();
    if (partes[1]) campos.nombre   = partes[1].replace(/</g, ' ').trim();
  }

  // ── Fallback apellido/nombre: líneas en mayúsculas puras cerca de "DOCUMENTO NACIONAL"
  if (!campos.apellido || !campos.nombre) {
    const soloMayus = lineas.filter(l => /^[A-ZÁÉÍÓÚÑ\s]{4,}$/.test(l));
    if (soloMayus.length >= 1 && !campos.apellido) campos.apellido = soloMayus[0];
    if (soloMayus.length >= 2 && !campos.nombre)   campos.nombre   = soloMayus[1];
  }

  // ── Fecha de nacimiento: buscar cerca de la palabra "nacimiento" o cualquier DD/MM/AAAA
  for (let i = 0; i < lineas.length; i++) {
    if (/nacimiento|fecha/i.test(lineas[i])) {
      for (let j = i; j <= Math.min(i+2, lineas.length-1); j++) {
        const m = lineas[j].match(/(\d{1,2})[.\/\-](\d{1,2})[.\/\-](\d{4})/);
        if (m) { campos.fecha_nacimiento = `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`; break; }
      }
      if (campos.fecha_nacimiento) break;
    }
  }
  if (!campos.fecha_nacimiento) {
    const m = t.match(/(\d{1,2})[.\/\-](\d{1,2})[.\/\-](\d{4})/);
    if (m) campos.fecha_nacimiento = `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;
  }

  // ── DNI: preferir el que está cerca de "DNI" o tiene puntos (12.345.678)
  for (let i = 0; i < lineas.length; i++) {
    if (/\bdni\b|n[uú]mero/i.test(lineas[i])) {
      for (let j = i; j <= Math.min(i+2, lineas.length-1); j++) {
        const m = lineas[j].match(/(\d{1,2}\.\d{3}\.\d{3}|\d{7,8})/);
        if (m) { campos.dni = m[1].replace(/\./g, ''); break; }
      }
      if (campos.dni) break;
    }
  }
  if (!campos.dni) {
    const m = t.match(/(\d{1,2}\.\d{3}\.\d{3})/);
    if (m) campos.dni = m[1].replace(/\./g, '');
  }
  if (!campos.dni) {
    const m = t.match(/\b(\d{7,8})\b/);
    if (m) campos.dni = m[1];
  }

  // ── CUIL: XX-XXXXXXXX-X
  const cuil = t.match(/(\d{2}[-\s]?\d{7,8}[-\s]?\d)/);
  if (cuil) campos.cuil = cuil[1].replace(/\s/g, '');

  return campos;
}

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
