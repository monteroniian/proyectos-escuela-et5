<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'admin') {
    header('Location: login.php');
    exit;
}

// Obtener estadísticas
$stmt = $pdo->query("SELECT COUNT(*) as total FROM alumnos");
$total_alumnos = $stmt->fetch()['total'];

$stmt = $pdo->query("SELECT COUNT(*) as total FROM profesores");
$total_profesores = $stmt->fetch()['total'];
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Administrador - LUMEN</title>
    <link rel="stylesheet" href="admin-styles.css">
</head>
<body>
    <div class="header">
        <div class="logo">
            <a href="home.php" style="display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit;">
                <img src="WhatsApp Image 2025-09-02 at 3.45.39 PM.jpeg" alt="Logo" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
                <div>
                    <div class="logo-title">LUMEN</div>
                    <div class="logo-subtitle">PANEL ADMINISTRADOR</div>
                </div>
            </a>
        </div>
        <div class="user-nav">
            <span>Bienvenido, <?= $_SESSION['user_name'] ?></span>
            <a href="logout.php" class="btn-logout">Salir</a>
        </div>
    </div>

    <div class="main-content">
        <div class="page-header">
            <h1>Panel de Administración</h1>
            <p>Gestión completa de alumnos y profesores</p>
            <a href="admin-navegacion.php" class="btn-nav" style="background: #17a2b8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; display: inline-block;">🧭 Navegación Completa</a>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon student-icon">👥</div>
                <div class="stat-info">
                    <h3>Alumnos</h3>
                    <div class="stat-number"><?= $total_alumnos ?></div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon teacher-icon">🎓</div>
                <div class="stat-info">
                    <h3>Profesores</h3>
                    <div class="stat-number"><?= $total_profesores ?></div>
                </div>
            </div>
        </div>

        <div class="admin-sections">
            <div class="section-card">
                <h2>Gestión de Alumnos</h2>
                <div class="section-actions">
                    <a href="admin-alumnos.php" class="btn-primary">Ver Alumnos</a>
                    <a href="admin-crear-alumno.php" class="btn-success">+ Nuevo Alumno</a>
                </div>
            </div>

            <div class="section-card">
                <h2>Gestión de Profesores</h2>
                <div class="section-actions">
                    <a href="admin-profesores.php" class="btn-primary">Ver Profesores</a>
                    <a href="admin-crear-profesor.php" class="btn-success">+ Nuevo Profesor</a>
                </div>
            </div>

            <div class="section-card">
                <h2>Gestión de Calificaciones</h2>
                <div class="section-actions">
                    <a href="admin-calificaciones.php" class="btn-primary">Ver Calificaciones</a>
                    <a href="admin-asignar-notas.php" class="btn-success">Asignar Notas</a>
                </div>
            </div>
        </div>

        <!-- Lista rápida de Alumnos -->
        <div class="quick-lists">
            <div class="list-section">
                <h3>Alumnos Recientes</h3>
                <div class="quick-table">
                    <?php
                    $stmt = $pdo->query("SELECT id, nombre, apellido, curso FROM alumnos ORDER BY id DESC LIMIT 5");
                    $alumnos_recientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    ?>
                    <table>
                        <thead>
                            <tr><th>Nombre</th><th>Curso</th><th>Acciones</th></tr>
                        </thead>
                        <tbody>
                            <?php foreach ($alumnos_recientes as $alumno): ?>
                            <tr>
                                <td><?= htmlspecialchars($alumno['nombre'] . ' ' . $alumno['apellido']) ?></td>
                                <td><?= htmlspecialchars($alumno['curso']) ?></td>
                                <td>
                                    <a href="admin-crear-alumno.php?id=<?= $alumno['id'] ?>" class="btn-mini">Editar</a>
                                    <a href="admin-ver-boletin.php?id=<?= $alumno['id'] ?>" class="btn-mini">Ver</a>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                    <a href="admin-alumnos.php" class="view-all">Ver todos los alumnos →</a>
                </div>
            </div>

            <div class="list-section">
                <h3>Profesores Activos</h3>
                <div class="quick-table">
                    <?php
                    try {
                        $stmt = $pdo->query("SELECT id, nombre, apellido FROM profesores ORDER BY apellido LIMIT 5");
                        $profesores_activos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    } catch(PDOException $e) {
                        $profesores_activos = [];
                    }
                    ?>
                    <table>
                        <thead>
                            <tr><th>Nombre</th><th>Acciones</th></tr>
                        </thead>
                        <tbody>
                            <?php foreach ($profesores_activos as $profesor): ?>
                            <tr>
                                <td><?= htmlspecialchars($profesor['nombre'] . ' ' . $profesor['apellido']) ?></td>
                                <td>
                                    <a href="admin-crear-profesor.php?id=<?= $profesor['id'] ?>" class="btn-mini">Editar</a>
                                    <a href="admin-ver-profesor.php?id=<?= $profesor['id'] ?>" class="btn-mini">Ver</a>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                    <a href="admin-profesores.php" class="view-all">Ver todos los profesores →</a>
                </div>
            </div>
        </div>
    </div>

    <style>
    body {
        font-family: 'Poppins', sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        margin: 0;
    }
    .header {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .main-content {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        margin: 20px;
        padding: 30px;
    }
    .page-header h1 {
        color: white;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    .page-header p {
        color: rgba(255,255,255,0.9);
    }
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }
    .stat-card {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 40px rgba(0,0,0,0.2);
    }
    .admin-sections {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 30px;
    }
    .section-card {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        padding: 25px;
        border-radius: 15px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }
    .section-card:hover {
        transform: translateY(-3px);
    }
    .section-card h2 {
        margin-bottom: 15px;
        color: #333;
        font-weight: 600;
    }
    .section-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }
    .btn-primary, .btn-success {
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 25px;
        font-weight: 600;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
        font-size: 14px;
    }
    .btn-primary {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
    }
    .btn-success {
        background: linear-gradient(45deg, #56ab2f, #a8e6cf);
        color: white;
    }
    .btn-primary:hover, .btn-success:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    }
    .btn-logout {
        background: linear-gradient(45deg, #ff6b6b, #ee5a24);
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 20px;
        margin-left: 15px;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    .btn-logout:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    .btn-nav {
        background: linear-gradient(45deg, #17a2b8, #138496) !important;
        transition: all 0.3s ease !important;
    }
    .btn-nav:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2) !important;
    }
    .quick-lists {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        margin-top: 40px;
    }
    .list-section {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }
    .list-section h3 {
        margin-bottom: 20px;
        color: #333;
        border-bottom: 3px solid #667eea;
        padding-bottom: 10px;
        font-weight: 600;
    }
    .quick-table table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
    }
    .quick-table th, .quick-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid rgba(0,0,0,0.1);
    }
    .quick-table th {
        background: rgba(102, 126, 234, 0.1);
        font-weight: 600;
        color: #333;
        font-size: 14px;
    }
    .quick-table td {
        font-size: 14px;
    }
    .btn-mini {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        padding: 6px 12px;
        text-decoration: none;
        border-radius: 15px;
        font-size: 12px;
        margin-right: 5px;
        display: inline-block;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    .btn-mini:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    }
    .view-all {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
        font-size: 14px;
        transition: color 0.3s ease;
    }
    .view-all:hover {
        color: #764ba2;
        text-decoration: underline;
    }
    @media (max-width: 768px) {
        .quick-lists {
            grid-template-columns: 1fr;
        }
        .main-content {
            margin: 10px;
            padding: 20px;
        }
        .section-actions {
            flex-direction: column;
        }
    }
    </style>
</body>
</html>