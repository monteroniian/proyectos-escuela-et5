<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'profesor') {
    header('Location: login.php');
    exit;
}

$profesor_id = $_SESSION['user_id'];
$alumno_id = $_GET['alumno'] ?? 0;
$curso = $_GET['curso'] ?? '';

// Obtener información del alumno
$stmt = $pdo->prepare("SELECT * FROM alumnos WHERE id = ?");
$stmt->execute([$alumno_id]);
$alumno = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$alumno) {
    header('Location: profesor-alumnos.php');
    exit;
}

// Obtener materias del profesor para este curso
$stmt = $pdo->prepare("SELECT nombre FROM materias WHERE profesor_id = ? AND curso = ?");
$stmt->execute([$profesor_id, $curso]);
$materias = $stmt->fetchAll(PDO::FETCH_COLUMN);

// Procesar formulario
if ($_POST) {
    $materia = $_POST['materia'];
    $cuatrimestre_1 = $_POST['cuatrimestre_1'] ?: null;
    $cuatrimestre_2 = $_POST['cuatrimestre_2'] ?: null;
    
    // Calcular nota final (promedio)
    $nota_final = null;
    if ($cuatrimestre_1 && $cuatrimestre_2) {
        $nota_final = round(($cuatrimestre_1 + $cuatrimestre_2) / 2, 1);
    }
    
    // Verificar si ya existe la calificación
    $stmt = $pdo->prepare("SELECT id FROM calificaciones WHERE alumno_id = ? AND materia = ?");
    $stmt->execute([$alumno_id, $materia]);
    $existe = $stmt->fetch();
    
    if ($existe) {
        // Actualizar
        $sql = "UPDATE calificaciones SET cuatrimestre_1 = ?, cuatrimestre_2 = ?, calificacion_anual = ? WHERE alumno_id = ? AND materia = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$cuatrimestre_1, $cuatrimestre_2, $nota_final, $alumno_id, $materia]);
    } else {
        // Insertar
        $sql = "INSERT INTO calificaciones (alumno_id, materia, cuatrimestre_1, cuatrimestre_2, calificacion_anual) VALUES (?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$alumno_id, $materia, $cuatrimestre_1, $cuatrimestre_2, $nota_final]);
    }
    
    $success = "Calificación guardada correctamente";
}

// Obtener calificaciones existentes
$stmt = $pdo->prepare("SELECT * FROM calificaciones WHERE alumno_id = ? AND materia IN (" . str_repeat('?,', count($materias) - 1) . "?)");
$stmt->execute(array_merge([$alumno_id], $materias));
$calificaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Organizar calificaciones por materia
$califs_por_materia = [];
foreach ($calificaciones as $cal) {
    $califs_por_materia[$cal['materia']] = $cal;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calificar Alumno - LUMEN</title>
    <link rel="stylesheet" href="panel-profesores-styles.css">
</head>
<body>
    <div class="container">
        <div class="sidebar">
            <div class="logo">
                <a href="home.php" style="display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit;">
                    <img src="WhatsApp Image 2025-09-02 at 3.45.39 PM.jpeg" alt="Logo" style="width: 32px; height: 32px; border-radius: 8px; object-fit: cover;">
                    <span>LUMEN</span>
                </a>
            </div>
            
            <nav class="nav-menu">
                <a href="panel-profesores.php" class="nav-item">
                    <span class="nav-icon">📊</span>
                    Resumen
                </a>
                <a href="profesor-materias.php" class="nav-item">
                    <span class="nav-icon">📚</span>
                    Mis Materias
                </a>
                <a href="profesor-alumnos.php" class="nav-item active">
                    <span class="nav-icon">👥</span>
                    Mis Alumnos
                </a>
            </nav>
        </div>

        <div class="main-content">
            <div class="header">
                <div class="header-left">
                    <h1>Calificar: <?= htmlspecialchars($alumno['nombre'] . ' ' . $alumno['apellido']) ?></h1>
                </div>
                <div class="header-right">
                    <a href="profesor-alumnos.php?curso=<?= $curso ?>" class="btn-back">← Volver</a>
                    <a href="logout.php" class="btn-logout">Salir</a>
                </div>
            </div>

            <div class="content">
                <?php if (isset($success)): ?>
                    <div class="alert success"><?= $success ?></div>
                <?php endif; ?>

                <div class="calificaciones-section">
                    <div class="alumno-info-card">
                        <h2>Información del Alumno</h2>
                        <p><strong>Nombre:</strong> <?= htmlspecialchars($alumno['nombre'] . ' ' . $alumno['apellido']) ?></p>
                        <p><strong>Curso:</strong> <?= htmlspecialchars($alumno['curso']) ?></p>
                        <p><strong>Email:</strong> <?= htmlspecialchars($alumno['email']) ?></p>
                    </div>

                    <div class="form-calificar">
                        <h2>Registrar Calificación</h2>
                        <form method="POST">
                            <div class="form-group">
                                <label>Materia</label>
                                <select name="materia" id="materia" required>
                                    <option value="">Seleccionar materia</option>
                                    <?php foreach ($materias as $materia): ?>
                                    <option value="<?= htmlspecialchars($materia) ?>"><?= htmlspecialchars($materia) ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label>1er Cuatrimestre</label>
                                    <input type="number" name="cuatrimestre_1" min="1" max="10" step="0.1" placeholder="1.0 - 10.0">
                                </div>
                                <div class="form-group">
                                    <label>2do Cuatrimestre</label>
                                    <input type="number" name="cuatrimestre_2" min="1" max="10" step="0.1" placeholder="1.0 - 10.0">
                                </div>
                            </div>
                            
                            <button type="submit" class="btn-primary">Guardar Calificación</button>
                        </form>
                    </div>

                    <div class="calificaciones-existentes">
                        <h2>Calificaciones Registradas</h2>
                        <?php if (empty($calificaciones)): ?>
                            <p>No hay calificaciones registradas aún.</p>
                        <?php else: ?>
                            <div class="tabla-calificaciones">
                                <div class="tabla-header">
                                    <span>Materia</span>
                                    <span>1er Cuatr.</span>
                                    <span>2do Cuatr.</span>
                                    <span>Promedio</span>
                                </div>
                                <?php foreach ($calificaciones as $cal): ?>
                                <div class="tabla-row">
                                    <span><?= htmlspecialchars($cal['materia']) ?></span>
                                    <span><?= $cal['cuatrimestre_1'] ?: '-' ?></span>
                                    <span><?= $cal['cuatrimestre_2'] ?: '-' ?></span>
                                    <span class="<?= $cal['calificacion_anual'] >= 7 ? 'aprobado' : 'desaprobado' ?>">
                                        <?= $cal['calificacion_anual'] ?: '-' ?>
                                    </span>
                                </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <style>
    .calificaciones-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
    }
    .alumno-info-card, .form-calificar, .calificaciones-existentes {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        padding: 25px;
        border-radius: 15px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    .calificaciones-existentes {
        grid-column: 1 / -1;
    }
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
    .form-group {
        margin-bottom: 20px;
    }
    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #333;
    }
    .form-group input, .form-group select {
        width: 100%;
        padding: 12px;
        border: 2px solid #e1e5e9;
        border-radius: 10px;
        font-family: 'Poppins', sans-serif;
    }
    .btn-primary {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    }
    .btn-back, .btn-logout {
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 20px;
        font-weight: 500;
        margin-left: 10px;
    }
    .btn-back {
        background: #6c757d;
        color: white;
    }
    .btn-logout {
        background: #dc3545;
        color: white;
    }
    .tabla-calificaciones {
        display: grid;
        gap: 10px;
    }
    .tabla-header, .tabla-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        gap: 15px;
        padding: 12px;
        align-items: center;
    }
    .tabla-header {
        background: rgba(102, 126, 234, 0.1);
        font-weight: 600;
        border-radius: 8px;
    }
    .tabla-row {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .aprobado {
        color: #28a745;
        font-weight: 600;
    }
    .desaprobado {
        color: #dc3545;
        font-weight: 600;
    }
    .alert {
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 20px;
        grid-column: 1 / -1;
    }
    .alert.success {
        background: rgba(40, 167, 69, 0.1);
        color: #28a745;
        border: 1px solid rgba(40, 167, 69, 0.3);
    }
    @media (max-width: 768px) {
        .calificaciones-section {
            grid-template-columns: 1fr;
        }
        .form-row {
            grid-template-columns: 1fr;
        }
    }
    </style>

    <script>
    // Cargar calificaciones existentes al seleccionar materia
    document.getElementById('materia').addEventListener('change', function() {
        const materia = this.value;
        const calificaciones = <?= json_encode($califs_por_materia) ?>;
        
        if (calificaciones[materia]) {
            document.querySelector('input[name="cuatrimestre_1"]').value = calificaciones[materia].cuatrimestre_1 || '';
            document.querySelector('input[name="cuatrimestre_2"]').value = calificaciones[materia].cuatrimestre_2 || '';
        } else {
            document.querySelector('input[name="cuatrimestre_1"]').value = '';
            document.querySelector('input[name="cuatrimestre_2"]').value = '';
        }
    });
    </script>
</body>
</html>