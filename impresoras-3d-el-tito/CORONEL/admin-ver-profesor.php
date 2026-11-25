<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'admin') {
    header('Location: login.php');
    exit;
}

if (!isset($_GET['id'])) {
    header('Location: admin-profesores.php');
    exit;
}

$id = (int)$_GET['id'];

// Obtener datos del profesor
$stmt = $pdo->prepare("SELECT * FROM profesores WHERE id = ?");
$stmt->execute([$id]);
$profesor = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$profesor) {
    header('Location: admin-profesores.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfil del Profesor - LUMEN</title>
    <link rel="stylesheet" href="admin-styles.css">
</head>
<body>
    <div class="header">
        <div class="logo">
            <img src="WhatsApp Image 2025-09-02 at 3.45.39 PM.jpeg" alt="Logo" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
            <div>
                <div class="logo-title">LUMEN</div>
                <div class="logo-subtitle">PERFIL DEL PROFESOR</div>
            </div>
        </div>
        <div class="user-nav">
            <a href="admin-profesores.php" class="btn-back">← Volver</a>
            <a href="logout.php" class="btn-logout">Salir</a>
        </div>
    </div>

    <div class="main-content">
        <div class="page-header">
            <h1>Perfil del Profesor</h1>
        </div>

        <div class="profile-container">
            <div class="profile-card">
                <h2><?= htmlspecialchars($profesor['nombre'] . ' ' . $profesor['apellido']) ?></h2>
                
                <div class="profile-info">
                    <div class="info-row">
                        <label>ID:</label>
                        <span><?= $profesor['id'] ?></span>
                    </div>
                    
                    <div class="info-row">
                        <label>Nombre:</label>
                        <span><?= htmlspecialchars($profesor['nombre']) ?></span>
                    </div>
                    
                    <div class="info-row">
                        <label>Apellido:</label>
                        <span><?= htmlspecialchars($profesor['apellido']) ?></span>
                    </div>
                    
                    <div class="info-row">
                        <label>Email:</label>
                        <span><?= htmlspecialchars($profesor['email']) ?></span>
                    </div>
                    
                    <div class="info-row">
                        <label>Materia:</label>
                        <span><?= htmlspecialchars($profesor['materia']) ?></span>
                    </div>
                    
                    <div class="info-row">
                        <label>Teléfono:</label>
                        <span><?= htmlspecialchars($profesor['telefono']) ?></span>
                    </div>
                </div>
                
                <div class="profile-actions">
                    <a href="admin-crear-profesor.php?id=<?= $profesor['id'] ?>" class="btn-edit">Editar Profesor</a>
                </div>
            </div>
        </div>
    </div>

    <style>
    .profile-container {
        max-width: 600px;
        margin: 20px auto;
    }
    
    .profile-card {
        background: white;
        border-radius: 10px;
        padding: 30px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .profile-card h2 {
        text-align: center;
        color: #333;
        margin-bottom: 30px;
        font-size: 24px;
    }
    
    .profile-info {
        margin-bottom: 30px;
    }
    
    .info-row {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid #eee;
    }
    
    .info-row:last-child {
        border-bottom: none;
    }
    
    .info-row label {
        font-weight: bold;
        color: #555;
        min-width: 120px;
    }
    
    .info-row span {
        color: #333;
        text-align: right;
    }
    
    .profile-actions {
        text-align: center;
    }
    
    .btn-edit {
        background: #ffc107;
        color: #000;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        display: inline-block;
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