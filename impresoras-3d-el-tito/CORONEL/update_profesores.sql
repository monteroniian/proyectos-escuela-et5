-- Actualizar tabla de profesores para eliminar campo materia
ALTER TABLE profesores DROP COLUMN materia;

-- Actualizar profesores existentes
UPDATE profesores SET nombre = 'Carlos', apellido = 'Rodriguez' WHERE id = 1;
UPDATE profesores SET nombre = 'Elena', apellido = 'Martinez' WHERE id = 2;