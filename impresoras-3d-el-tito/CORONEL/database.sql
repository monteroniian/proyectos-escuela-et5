-- Crear base de datos (solo una de las dos, para evitar confusión)
CREATE DATABASE IF NOT EXISTS lumen_academia;
USE lumen_academia;

-- ========================================
-- Tabla de alumnos
-- ========================================
CREATE TABLE IF NOT EXISTS alumnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    curso VARCHAR(10) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Tabla de profesores
-- ========================================
CREATE TABLE IF NOT EXISTS profesores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    materia VARCHAR(50) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Tabla de administradores
-- ========================================
CREATE TABLE IF NOT EXISTS administradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Tabla de códigos de administrador
-- ========================================
CREATE TABLE IF NOT EXISTS admin_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Tabla de calificaciones
-- ========================================
CREATE TABLE IF NOT EXISTS calificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumno_id INT NOT NULL,
    materia VARCHAR(50) NOT NULL,
    cuatrimestre_1 DECIMAL(3,1) DEFAULT NULL,
    cuatrimestre_2 DECIMAL(3,1) DEFAULT NULL,
    calificacion_anual DECIMAL(3,1) DEFAULT NULL,
    calificacion_final DECIMAL(3,1) DEFAULT NULL,
    observaciones TEXT DEFAULT NULL,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE
);

-- ========================================
-- Datos de ejemplo
-- ========================================

-- Alumnos
INSERT INTO alumnos (nombre, apellido, email, curso, fecha_nacimiento, password) VALUES
('Ana', 'García', 'ana.garcia@email.com', '1° A', '2008-03-15', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Luis', 'Pérez', 'luis.perez@email.com', '1° A', '2008-07-22', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('María', 'López', 'maria.lopez@email.com', '2° B', '2007-11-08', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Profesores
INSERT INTO profesores (nombre, apellido, email, materia, telefono, password) VALUES
('Carlos', 'Rodríguez', 'carlos.rodriguez@lumen.edu', 'Matemáticas', '555-0101', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Elena', 'Martínez', 'elena.martinez@lumen.edu', 'Historia', '555-0102', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Administrador y código
INSERT INTO admin_codes (codigo) VALUES ('2007');
INSERT INTO administradores (nombre, apellido, email, password)
VALUES ('Admin', 'Sistema', 'admin@lumen.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insertar materias para profesores
INSERT INTO materias (nombre, curso, profesor_id, descripcion) VALUES
('Matemáticas', '1-1', 1, 'Matemáticas básicas para primer año'),
('Lengua', '1-1', 2, 'Lengua y literatura'),
('Historia', '2-1', 2, 'Historia argentina'),
('Ciencias', '1-2', 1, 'Ciencias naturales'),
('Inglés', '2-1', 1, 'Idioma inglés básico');

-- Calificaciones
INSERT INTO calificaciones (alumno_id, materia, cuatrimestre_1, cuatrimestre_2, calificacion_anual) VALUES
(1, 'Matemáticas', 8.5, 9.0, 8.8),
(1, 'Historia', 7.0, 8.5, 7.8),
(1, 'Inglés', 9.0, 8.0, 8.5),
(2, 'Matemáticas', 6.5, 7.0, 6.8),
(2, 'Historia', 8.0, 7.5, 7.8),
(3, 'Matemáticas', 9.5, 9.0, 9.3),
(3, 'Historia', 8.5, 9.0, 8.8),
(4, 'Matemáticas', 7.5, 8.0, 7.8),
(5, 'Matemáticas', 9.0, 8.5, 8.8),
(6, 'Historia', 8.0, 7.0, 7.5),
(7, 'Historia', 9.5, 9.0, 9.3),
(8, 'Ciencias', 8.5, 8.0, 8.3);
