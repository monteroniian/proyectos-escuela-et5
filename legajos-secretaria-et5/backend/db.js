const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'secretaria.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK(tipo IN ('alumnos','docentes'))
  );

  CREATE TABLE IF NOT EXISTS alumnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    dni TEXT,
    fecha_nacimiento TEXT,
    anio TEXT,
    division TEXT,
    -- documentacion faltante
    analitico_incompleto INTEGER DEFAULT 0,
    analitico_anios TEXT,
    partida_nacimiento INTEGER DEFAULT 0,
    dni_actualizado INTEGER DEFAULT 0,
    dictamen_equivalencias INTEGER DEFAULT 0,
    ficha_inscripcion INTEGER DEFAULT 0,
    cert_salud INTEGER DEFAULT 0,
    cert_primarios INTEGER DEFAULT 0,
    cuil_alumno TEXT,
    cuil_tutor TEXT,
    fotos INTEGER DEFAULT 0,
    boletin TEXT,
    -- datos adicionales
    tutor_nombre TEXT,
    tutor_dni TEXT,
    fecha_acta TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS imagenes_docente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    docente_id INTEGER NOT NULL,
    tipo TEXT NOT NULL,
    filename TEXT NOT NULL,
    FOREIGN KEY(docente_id) REFERENCES docentes(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS imagenes_alumno (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alumno_id INTEGER NOT NULL,
    tipo TEXT NOT NULL,
    filename TEXT NOT NULL,
    FOREIGN KEY(alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS docentes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    dni TEXT,
    cuil TEXT,
    cargo TEXT,
    materia TEXT,
    telefono TEXT,
    email TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

module.exports = db;

// Migraciones
try { db.prepare('ALTER TABLE alumnos ADD COLUMN fecha_nacimiento TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE docentes ADD COLUMN fecha_nacimiento TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE docentes ADD COLUMN nacionalidad TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE docentes ADD COLUMN direccion TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE docentes ADD COLUMN telefono_alt TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE docentes ADD COLUMN titulos TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE docentes ADD COLUMN fecha_ingreso TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE docentes ADD COLUMN turno TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE docentes ADD COLUMN situacion_revista TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE docentes ADD COLUMN reemplaza_a TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE docentes ADD COLUMN domicilio_distrito TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE docentes ADD COLUMN fecha_acta TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE docentes ADD COLUMN dias_acta TEXT').run(); } catch {}
try { db.prepare('ALTER TABLE docentes ADD COLUMN mes_acta TEXT').run(); } catch {}
