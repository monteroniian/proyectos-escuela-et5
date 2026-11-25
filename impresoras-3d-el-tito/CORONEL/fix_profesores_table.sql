-- Script para corregir la tabla profesores
USE lumen_academia;

-- Agregar columna materia si no existe
ALTER TABLE profesores 
ADD COLUMN IF NOT EXISTS materia VARCHAR(50) NOT NULL DEFAULT 'Sin asignar' 
AFTER email;

-- Actualizar profesores existentes con materias
UPDATE profesores SET materia = 'Matemáticas' WHERE id = 1;
UPDATE profesores SET materia = 'Historia' WHERE id = 2;
UPDATE profesores SET materia = 'Inglés' WHERE id = 3;
UPDATE profesores SET materia = 'Literatura' WHERE id = 4;
UPDATE profesores SET materia = 'Ciencias' WHERE id = 5;
UPDATE profesores SET materia = 'Educación Física' WHERE id = 6;

-- Verificar estructura
DESCRIBE profesores;