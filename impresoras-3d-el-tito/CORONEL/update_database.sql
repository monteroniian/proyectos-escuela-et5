-- Actualización de base de datos para materias por profesor

-- Crear tabla de materias
CREATE TABLE IF NOT EXISTS materias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    curso VARCHAR(10) NOT NULL,
    profesor_id INT NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profesor_id) REFERENCES profesores(id) ON DELETE CASCADE
);

-- Agregar campo curso a profesores
ALTER TABLE profesores ADD COLUMN curso_asignado VARCHAR(10) DEFAULT NULL;

-- Actualizar cursos existentes a nuevo formato
UPDATE alumnos SET curso = '1-1' WHERE curso = '1° A';
UPDATE alumnos SET curso = '1-2' WHERE curso = '1° B';
UPDATE alumnos SET curso = '2-1' WHERE curso = '2° A';
UPDATE alumnos SET curso = '2-2' WHERE curso = '2° B';

-- Insertar materias de ejemplo
INSERT INTO materias (nombre, curso, profesor_id, descripcion) VALUES
('Matemáticas Básicas', '1-1', 1, 'Fundamentos de matemáticas para primer año'),
('Historia Argentina', '1-1', 2, 'Historia nacional desde la independencia');