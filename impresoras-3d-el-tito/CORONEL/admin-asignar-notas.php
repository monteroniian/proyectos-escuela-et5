<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'admin') {
    header('Location: login.php');
    exit;
}

// Obtener alumnos y profesores para los selectores
$stmt_alumnos = $pdo->query("SELECT id, nombre, apellido, curso FROM alumnos ORDER BY apellido, nombre");
$alumnos = $stmt_alumnos->fetchAll(PDO::FETCH_ASSOC);

$stmt_profesores = $pdo->query("SELECT id, nombre, apellido, materia FROM profesores ORDER BY apellido, nombre");
$profesores = $stmt_profesores->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Asignar Notas - LUMEN</title>
    <link rel="stylesheet" href="admin-styles.css">
</head>
<body>
    <div class="header">
        <div class="logo">
            <img src="WhatsApp Image 2025-09-02 at 3.45.39 PM.jpeg" alt="Logo" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
            <div>
                <div class="logo-title">LUMEN</div>
                <div class="logo-subtitle">ASIGNAR NOTAS</div>
            </div>
        </div>
        <div class="user-nav">
            <a href="admin-panel.php" class="btn-back">← Volver</a>
            <a href="logout.php" class="btn-logout">Salir</a>
        </div>
    </div>

    <div class="main-content">
        <div class="page-header">
            <h1>Asignar Notas</h1>
        </div>

        <div class="form-container">
            <form method="POST" class="admin-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="alumno_id">Alumno</label>
                        <select id="alumno_id" name="alumno_id" required>
                            <option value="">Seleccionar alumno</option>
                            <?php foreach ($alumnos as $alumno): ?>
                                <option value="<?= $alumno['id'] ?>">
                                    <?= htmlspecialchars($alumno['apellido'] . ', ' . $alumno['nombre'] . ' - ' . $alumno['curso']) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="profesor_id">Profesor/Materia</label>
                        <select id="profesor_id" name="profesor_id" required>
                            <option value="">Seleccionar profesor</option>
                            <?php foreach ($profesores as $profesor): ?>
                                <option value="<?= $profesor['id'] ?>">
                                    <?= htmlspecialchars($profesor['apellido'] . ', ' . $profesor['nombre'] . ' - ' . $profesor['materia']) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="nota">Nota (1-10)</label>
                        <input type="number" id="nota" name="nota" min="1" max="10" step="0.1" required>
                    </div>
                    <div class="form-group">
                        <label for="fecha">Fecha</label>
                        <input type="date" id="fecha" name="fecha" value="<?= date('Y-m-d') ?>" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="observaciones">Observaciones (opcional)</label>
                    <textarea id="observaciones" name="observaciones" rows="3"></textarea>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-success">Asignar Nota</button>
                    <a href="admin-panel.php" class="btn-secondary">Cancelar</a>
                </div>
            </form>
        </div>
    </div>

    <style>
    .form-container {
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin-top: 20px;
        max-width: 800px;
    }
    .admin-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
    .form-group {
        display: flex;
        flex-direction: column;
    }
    .form-group label {
        margin-bottom: 5px;
        font-weight: bold;
        color: #333;
    }
    .form-group input, .form-group select, .form-group textarea {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 14px;
    }
    .form-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }
    .btn-success, .btn-secondary {
        padding: 12px 25px;
        border: none;
        border-radius: 5px;
        font-weight: bold;
        text-decoration: none;
        cursor: pointer;
    }
    .btn-success {
        background: #28a745;
        color: white;
    }
    .btn-secondary {
        background: #6c757d;
        color: white;
    }
    .btn-back {
        background: #6c757d;
        color: white;
        padding: 8px 15px;
        text-decoration: none;
        border-radius: 5px;
        margin-right: 10px;
    }
    </style>
</body>
</html>