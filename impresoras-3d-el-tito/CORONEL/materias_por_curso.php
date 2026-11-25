<?php
// Función para obtener materias según el curso
function getMateriasPorCurso($curso) {
    $año = substr($curso, 0, 1); // Primer número (1-6)
    $division = substr($curso, 2, 1); // Segundo número (1-3)
    
    $materias_base = [
        'Lengua y Literatura',
        'Matemáticas',
        'Historia',
        'Geografía',
        'Ciencias Naturales',
        'Educación Física',
        'Inglés'
    ];
    
    // Materias específicas según la división (segundo número)
    $materias_especificas = [];
    switch($division) {
        case '1': // Maestro Mayor de Obra
            $materias_especificas = [
                'Construcciones',
                'Dibujo Técnico',
                'Materiales de Construcción',
                'Estructuras',
                'Instalaciones'
            ];
            break;
        case '2': // Programación
            $materias_especificas = [
                'Programación I',
                'Algoritmos',
                'Base de Datos',
                'Desarrollo Web',
                'Sistemas Operativos'
            ];
            break;
        case '3': // Informática
            $materias_especificas = [
                'Informática Aplicada',
                'Redes y Comunicaciones',
                'Hardware',
                'Software de Aplicación',
                'Seguridad Informática'
            ];
            break;
    }
    
    // Agregar materias avanzadas según el año
    if ($año >= 4) {
        switch($division) {
            case '1':
                $materias_especificas[] = 'Proyecto de Obra';
                $materias_especificas[] = 'Costos y Presupuestos';
                break;
            case '2':
                $materias_especificas[] = 'Programación Avanzada';
                $materias_especificas[] = 'Desarrollo de Aplicaciones';
                break;
            case '3':
                $materias_especificas[] = 'Administración de Sistemas';
                $materias_especificas[] = 'Soporte Técnico';
                break;
        }
    }
    
    return array_merge($materias_base, $materias_especificas);
}
?>