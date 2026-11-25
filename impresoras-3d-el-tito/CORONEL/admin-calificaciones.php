<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'admin') {
    header('Location: login.php');
    exit;
}

// Procesar actualización de calificaciones
if ($_POST && isset($_POST['actualizar_calificaciones'])) {
    foreach ($_POST['calificaciones'] as $id => $datos) {
        $stmt = $pdo->prepare("UPDATE calificaciones SET cuatrimestre_1=?, cuatrimestre_2=?, calificacion_anual=?, calificacion_final=?, observaciones=? WHERE id=?");
        $stmt->execute([
            $datos['cuatrimestre_1'] ?: null,
            $datos['cuatrimestre_2'] ?: null,
            $datos['calificacion_anual'] ?: null,
            $datos['calificacion_final'] ?: null,
            $datos['observaciones'] ?: null,
            $id
        ]);
    }
    $mensaje = "Calificaciones actualizadas correctamente";
}

// Agregar nueva calificación
if ($_POST && isset($_POST['agregar_calificacion'])) {
    $stmt = $pdo->prepare("INSERT INTO calificaciones (alumno_id, materia) VALUES (?, ?)");
    $stmt->execute([$_POST['alumno_id'], $_POST['materia']]);
    $mensaje = "Materia agregada correctamente";
}

// Obtener alumnos y sus calificaciones
$stmt = $pdo->query("
    SELECT a.id, a.nombre, a.apellido, a.curso,
           c.id as cal_id, c.materia, c.cuatrimestre_1, c.cuatrimestre_2, 
           c.calificacion_anual, c.calificacion_final, c.observaciones
    FROM alumnos a
    LEFT JOIN calificaciones c ON a.id = c.alumno_id
    ORDER BY a.apellido, a.nombre, c.materia
");
$datos = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Organizar datos por alumno
$alumnos = [];
foreach ($datos as $row) {
    $alumno_id = $row['id'];
    if (!isset($alumnos[$alumno_id])) {
        $alumnos[$alumno_id] = [
            'info' => [
                'id' => $row['id'],
                'nombre' => $row['nombre'],
                'apellido' => $row['apellido'],
                'curso' => $row['curso']
            ],
            'calificaciones' => []
        ];
    }
    
    if ($row['cal_id']) {
        $alumnos[$alumno_id]['calificaciones'][] = [
            'id' => $row['cal_id'],
            'materia' => $row['materia'],
            'cuatrimestre_1' => $row['cuatrimestre_1'],
            'cuatrimestre_2' => $row['cuatrimestre_2'],
            'calificacion_anual' => $row['calificacion_anual'],
            'calificacion_final' => $row['calificacion_final'],
            'observaciones' => $row['observaciones']
        ];
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Calificaciones - LUMEN</title>
    <link rel="stylesheet" href="admin-styles.css">
</head>
<body>
    <div class="header">
        <div class="logo">
            <img src="WhatsApp Image 2025-09-02 at 3.45.39 PM.jpeg" alt="Logo" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
            <div>
                <div class="logo-title">LUMEN</div>
                <div class="logo-subtitle">GESTIÓN DE CALIFICACIONES</div>
            </div>
        </div>
        <div class="user-nav">
            <a href="admin-panel.php" class="btn-back">← Volver</a>
            <a href="logout.php" class="btn-logout">Salir</a>
        </div>
    </div>

    <div class="main-content">
        <div class="page-header">
            <h1>Gestión de Calificaciones</h1>
        </div>

        <?php if (isset($mensaje)): ?>
            <div class="alert alert-success"><?= $mensaje ?></div>
        <?php endif; ?>

        <form method="POST" class="calificaciones-form">
            <?php foreach ($alumnos as $alumno): ?>
            <div class="alumno-section">
                <h3><?= htmlspecialchars($alumno['info']['apellido'] . ', ' . $alumno['info']['nombre']) ?> - <?= htmlspecialchars($alumno['info']['curso']) ?></h3>
                
                <div class="materias-grid">
                    <?php foreach ($alumno['calificaciones'] as $cal): ?>
                    <div class="materia-card">
                        <h4><?= htmlspecialchars($cal['materia']) ?></h4>
                        <div class="notas-grid">
                            <div class="nota-input">
                                <label>Cuatrimestre 1</label>
                                <input type="number" step="0.1" min="1" max="10" 
                                       name="calificaciones[<?= $cal['id'] ?>][cuatrimestre_1]" 
                                       value="<?= $cal['cuatrimestre_1'] ?>">
                            </div>
                            <div class="nota-input">
                                <label>Cuatrimestre 2</label>
                                <input type="number" step="0.1" min="1" max="10" 
                                       name="calificaciones[<?= $cal['id'] ?>][cuatrimestre_2]" 
                                       value="<?= $cal['cuatrimestre_2'] ?>">
                            </div>
                            <div class="nota-input">
                                <label>Promedio Anual</label>
                                <input type="number" step="0.1" min="1" max="10" 
                                       name="calificaciones[<?= $cal['id'] ?>][calificacion_anual]" 
                                       value="<?= $cal['calificacion_anual'] ?>">
                            </div>
                            <div class="nota-input">
                                <label>Calificación Final</label>
                                <input type="number" step="0.1" min="1" max="10" 
                                       name="calificaciones[<?= $cal['id'] ?>][calificacion_final]" 
                                       value="<?= $cal['calificacion_final'] ?>">
                            </div>
                        </div>
                        <div class="observaciones-input">
                            <label>Observaciones</label>
                            <textarea name="calificaciones[<?= $cal['id'] ?>][observaciones]" 
                                      rows="2"><?= htmlspecialchars($cal['observaciones']) ?></textarea>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>

                <!-- Formulario para agregar nueva materia -->
                <div class="agregar-materia">
                    <h5>Agregar Nueva Materia</h5>
                    <div class="agregar-form">
                        <input type="hidden" name="alumno_id" value="<?= $alumno['info']['id'] ?>">
                        <input type="text" name="materia" placeholder="Nombre de la materia" required>
                        <button type="submit" name="agregar_calificacion" class="btn-add">+ Agregar</button>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>

            <div class="form-actions">
                <button type="submit" name="actualizar_calificaciones" class="btn-success">Guardar Todas las Calificaciones</button>
            </div>
        </form>
    </div>

    <style>
    .calificaciones-form {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }
    .alumno-section {
        background: white;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .alumno-section h3 {
        margin-bottom: 20px;
        color: #333;
        border-bottom: 2px solid #007bff;
        padding-bottom: 10px;
    }
    .materias-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
    }
    .materia-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        background: #f8f9fa;
    }
    .materia-card h4 {
        margin-bottom: 15px;
        color: #495057;
    }
    .notas-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 15px;
    }
    .nota-input {
        display: flex;
        flex-direction: column;
    }
    .nota-input label {
        font-size: 12px;
        color: #666;
        margin-bottom: 5px;
        font-weight: bold;
    }
    .nota-input input {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
    }
    .observaciones-input {
        display: flex;
        flex-direction: column;
    }
    .observaciones-input label {
        font-size: 12px;
        color: #666;
        margin-bottom: 5px;
        font-weight: bold;
    }
    .observaciones-input textarea {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
        resize: vertical;
    }
    .agregar-materia {
        border-top: 1px solid #ddd;
        padding-top: 15px;
        margin-top: 15px;
    }
    .agregar-materia h5 {
        margin-bottom: 10px;
        color: #666;
    }
    .agregar-form {
        display: flex;
        gap: 10px;
        align-items: end;
    }
    .agregar-form input {
        flex: 1;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    .btn-add {
        background: #28a745;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }
    .form-actions {
        text-align: center;
        padding: 20px;
    }
    .btn-success {
        background: #28a745;
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 5px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
    }
    </style>
</body>
</html>