USE lumen_academia;
ALTER TABLE profesores ADD COLUMN materia VARCHAR(50) NOT NULL DEFAULT 'Sin asignar' AFTER email;
<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'admin') {
    header('Location: login.php');
    exit;
}

// Eliminar profesor si se solicita
if (isset($_GET['eliminar'])) {
    $id = (int)$_GET['eliminar'];
    $stmt = $pdo->prepare("DELETE FROM profesores WHERE id = ?");
    $stmt->execute([$id]);
    header('Location: admin-profesores.php?msg=eliminado');
    exit;
}

// Obtener todos los profesores
try {
    $stmt = $pdo->query("SELECT * FROM profesores ORDER BY apellido, nombre");
    $profesores = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    // Si falla, intentar sin la columna materia
    $stmt = $pdo->query("SELECT id, nombre, apellido, email, telefono FROM profesores ORDER BY apellido, nombre");
    $profesores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // Agregar materia como campo vacío
    foreach($profesores as &$profesor) {
        $profesor['materia'] = 'No asignada';
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Profesores - LUMEN</title>
    <link rel="stylesheet" href="admin-styles.css">
</head>
<body>
    <div class="header">
        <div class="logo">
            <img src="WhatsApp Image 2025-09-02 at 3.45.39 PM.jpeg" alt="Logo" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
            <div>
                <div class="logo-title">LUMEN</div>
                <div class="logo-subtitle">GESTIÓN DE PROFESORES</div>
            </div>
        </div>
        <div class="user-nav">
            <a href="admin-panel.php" class="btn-back">← Volver</a>
            <a href="logout.php" class="btn-logout">Salir</a>
        </div>
    </div>

    <div class="main-content">
        <div class="page-header">
            <h1>Gestión de Profesores</h1>
        
        </div>

        <?php if (isset($_GET['msg'])): ?>
            <div class="alert alert-success">
                <?php if ($_GET['msg'] === 'eliminado'): ?>
                    Profesor eliminado correctamente
                <?php elseif ($_GET['msg'] === 'creado'): ?>
                    Profesor creado correctamente
                <?php elseif ($_GET['msg'] === 'actualizado'): ?>
                    Profesor actualizado correctamente
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
                        <th>Materia</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($profesores as $profesor): ?>
                    <tr>
                        <td><?= $profesor['id'] ?></td>
                        <td><?= htmlspecialchars($profesor['nombre']) ?></td>
                        <td><?= htmlspecialchars($profesor['apellido']) ?></td>
                        <td><?= htmlspecialchars($profesor['email']) ?></td>
                        <td><?= htmlspecialchars($profesor['materia']) ?></td>
                        <td><?= htmlspecialchars($profesor['telefono']) ?></td>
                        <td class="actions">
                            <a href="admin-crear-profesor.php?id=<?= $profesor['id'] ?>" class="btn-edit">Editar</a>
                            <a href="admin-ver-profesor.php?id=<?= $profesor['id'] ?>" class="btn-view">Ver Perfil</a>
                            <a href="?eliminar=<?= $profesor['id'] ?>" class="btn-delete" onclick="return confirm('¿Estás seguro de eliminar este profesor?')">Eliminar</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

    <style>
    .table-container {
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin-top: 20px;
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
    .actions {
        display: flex;
        gap: 5px;
    }
    .btn-edit, .btn-view, .btn-delete {
        padding: 5px 10px;
        text-decoration: none;
        border-radius: 3px;
        font-size: 12px;
        font-weight: bold;
    }
    .btn-edit {
        background: #ffc107;
        color: #000;
    }
    .btn-view {
        background: #17a2b8;
        color: white;
    }
    .btn-delete {
        background: #dc3545;
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
    .alert {
        padding: 15px;
        margin: 20px 0;
        border-radius: 5px;
    }
    .alert-success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    </style>
</body>
</html>