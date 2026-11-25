-- Insertar 5 alumnos adicionales para el panel de profesores

INSERT INTO alumnos (nombre, apellido, email, curso, fecha_nacimiento, password) VALUES
('Carlos', 'Mendoza', 'carlos.mendoza@email.com', '1-1', '2008-05-12', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Sofia', 'Rodriguez', 'sofia.rodriguez@email.com', '1-1', '2008-08-23', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Diego', 'Fernandez', 'diego.fernandez@email.com', '2-1', '2007-12-05', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Valentina', 'Torres', 'valentina.torres@email.com', '2-1', '2007-09-18', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Mateo', 'Silva', 'mateo.silva@email.com', '1-2', '2008-02-14', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insertar algunas materias para que los profesores tengan cursos asignados
INSERT INTO materias (nombre, curso, profesor_id, descripcion) VALUES
('Matemáticas', '1-1', 1, 'Matemáticas básicas para primer año'),
('Lengua', '1-1', 2, 'Lengua y literatura'),
('Historia', '2-1', 2, 'Historia argentina'),
('Ciencias', '1-2', 1, 'Ciencias naturales'),
('Inglés', '2-1', 1, 'Idioma inglés básico');