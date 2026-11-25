<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'admin') {
    header('Location: login.php');
    exit;
}

// Eliminar alumno si se solicita
if (isset($_GET['eliminar'])) {
    $id = (int)$_GET['eliminar'];
    $stmt = $pdo->prepare("DELETE FROM alumnos WHERE id = ?");
    $stmt->execute([$id]);
    header('Location: admin-alumnos.php?msg=eliminado');
    exit;
}

// Obtener todos los alumnos
$stmt = $pdo->query("SELECT * FROM alumnos ORDER BY apellido, nombre");
$alumnos = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Alumnos - LUMEN</title>
    <link rel="stylesheet" href="admin-styles.css">
</head>
<body>
    <div class="header">
        <div class="logo">
            <a href="home.php" style="display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit;">
                <img src="WhatsApp Image 2025-09-02 at 3.45.39 PM.jpeg" alt="Logo" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
                <div>
                    <div class="logo-title">LUMEN</div>
                    <div class="logo-subtitle">GESTIÓN DE ALUMNOS</div>
                </div>
            </a>
        </div>
        <div class="user-nav">
            <a href="admin-panel.php" class="btn-back">← Volver</a>
            <a href="logout.php" class="btn-logout">Salir</a>
        </div>
    </div>

    <div class="main-content">
        <div class="page-header">
            <h1>Gestión de Alumnos</h1>
            <a href="admin-crear-alumno.php" class="btn-success">+ Nuevo Alumno</a>
        </div>

        <?php if (isset($_GET['msg'])): ?>
            <div class="alert alert-success">
                <?php if ($_GET['msg'] === 'eliminado'): ?>
                    Alumno eliminado correctamente
                <?php elseif ($_GET['msg'] === 'creado'): ?>
                    Alumno creado correctamente
                <?php elseif ($_GET['msg'] === 'actualizado'): ?>
                    Alumno actualizado correctamente
                <?php endif; ?>
            </div>
        <?php endif; ?>

        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Curso</th>
                        <th>Fecha Nacimiento</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($alumnos as $alumno): ?>
                    <tr>
                        <td><?= $alumno['id'] ?></td>
                        <td><?= htmlspecialchars($alumno['nombre']) ?></td>
                        <td><?= htmlspecialchars($alumno['apellido']) ?></td>
                        <td><?= htmlspecialchars($alumno['email']) ?></td>
                        <td><?= htmlspecialchars($alumno['curso']) ?></td>
                        <td><?= date('d/m/Y', strtotime($alumno['fecha_nacimiento'])) ?></td>
                        <td class="actions">
                            <a href="admin-crear-alumno.php?id=<?= $alumno['id'] ?>" class="btn-edit">Editar</a>
                            <a href="admin-ver-boletin.php?id=<?= $alumno['id'] ?>" class="btn-view">Boletín</a>
                            <a href="?eliminar=<?= $alumno['id'] ?>" class="btn-delete" onclick="return confirm('¿Estás seguro de eliminar este alumno?')">Eliminar</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

    <style>
    body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
    }
    .main-content {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        margin: 20px;
        padding: 30px;
    }
    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }
    .page-header h1 {
        color: white;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        font-weight: 600;
    }
    .table-container {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        margin-top: 20px;
    }
    .data-table {
        width: 100%;
        border-collapse: collapse;
    }
    .data-table th, .data-table td {
        padding: 15px 12px;
        text-align: left;
        border-bottom: 1px solid rgba(0,0,0,0.1);
    }
    .data-table th {
        background: rgba(102, 126, 234, 0.1);
        font-weight: 600;
        color: #333;
    }
    .actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }
    .btn-edit, .btn-view, .btn-delete {
        padding: 8px 12px;
        text-decoration: none;
        border-radius: 15px;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    .btn-edit {
        background: linear-gradient(45deg, #ffc107, #ffb300);
        color: #000;
    }
    .btn-view {
        background: linear-gradient(45deg, #17a2b8, #138496);
        color: white;
    }
    .btn-delete {
        background: linear-gradient(45deg, #dc3545, #c82333);
        color: white;
    }
    .btn-edit:hover, .btn-view:hover, .btn-delete:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    .btn-back {
        background: linear-gradient(45deg, #6c757d, #5a6268);
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 20px;
        margin-right: 15px;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    .btn-back:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    .btn-success {
        background: linear-gradient(45deg, #28a745, #20c997);
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 25px;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    .btn-success:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    }
    .alert {
        padding: 15px 20px;
        margin: 20px 0;
        border-radius: 15px;
        backdrop-filter: blur(10px);
    }
    .alert-success {
        background: rgba(212, 237, 218, 0.9);
        color: #155724;
        border: 1px solid rgba(195, 230, 203, 0.5);
    }
    @media (max-width: 768px) {
        .main-content {
            margin: 10px;
            padding: 20px;
        }
        .page-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
        }
        .actions {
            justify-content: center;
        }
    }
    </style>
</body>
</html>