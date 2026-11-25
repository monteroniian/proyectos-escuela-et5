<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'admin') {
    header('Location: login.php');
    exit;
}

if (!isset($_GET['id'])) {
    header('Location: admin-alumnos.php');
    exit;
}

$id = (int)$_GET['id'];

// Obtener datos del alumno
$stmt = $pdo->prepare("SELECT * FROM alumnos WHERE id = ?");
$stmt->execute([$id]);
$alumno = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$alumno) {
    header('Location: admin-alumnos.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Boletín del Alumno - LUMEN</title>
    <link rel="stylesheet" href="admin-styles.css">
</head>
<body>
    <div class="header">
        <div class="logo">
            <img src="WhatsApp Image 2025-09-02 at 3.45.39 PM.jpeg" alt="Logo" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
            <div>
                <div class="logo-title">LUMEN</div>
                <div class="logo-subtitle">BOLETÍN DEL ALUMNO</div>
            </div>
        </div>
        <div class="user-nav">
            <a href="admin-alumnos.php" class="btn-back">← Volver</a>
            <a href="logout.php" class="btn-logout">Salir</a>
        </div>
    </div>

    <div class="main-content">
        <div class="page-header">
            <h1>Boletín de <?= htmlspecialchars($alumno['nombre'] . ' ' . $alumno['apellido']) ?></h1>
        </div>

        <div class="boletin-container">
            <div class="alumno-info">
                <h3>Información del Alumno</h3>
                <p><strong>Curso:</strong> <?= htmlspecialchars($alumno['curso']) ?></p>
                <p><strong>Email:</strong> <?= htmlspecialchars($alumno['email']) ?></p>
                <p><strong>Fecha de Nacimiento:</strong> <?= date('d/m/Y', strtotime($alumno['fecha_nacimiento'])) ?></p>
            </div>

            <div class="calificaciones">
                <h3>Calificaciones</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Materia</th>
                            <th>Nota</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="3" style="text-align: center; color: #666;">No hay calificaciones registradas</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <style>
    .boletin-container {
        background: white;
        border-radius: 10px;
        padding: 30px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin-top: 20px;
    }
    .alumno-info {
        margin-bottom: 30px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
    }
    .alumno-info h3 {
        margin-top: 0;
        color: #333;
    }
    .calificaciones h3 {
        color: #333;
        margin-bottom: 20px;
    }
    .data-table {
        width: 100%;
        border-collapse: collapse;
    }
    .data-table th, .data-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #eee;
    }
    .data-table th {
        background: #f8f9fa;
        font-weight: bold;
        color: #333;
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