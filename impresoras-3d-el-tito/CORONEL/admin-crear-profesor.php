<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'admin') {
    header('Location: login.php');
    exit;
}

$profesor = null;
$editing = false;

// Si estamos editando
if (isset($_GET['id'])) {
    $editing = true;
    try {
        $stmt = $pdo->prepare("SELECT * FROM profesores WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $profesor = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        // Si falla, intentar sin materia
        $stmt = $pdo->prepare("SELECT id, nombre, apellido, email, telefono FROM profesores WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $profesor = $stmt->fetch(PDO::FETCH_ASSOC);
        if($profesor) $profesor['materia'] = '';
    }
    
    if (!$profesor) {
        header('Location: admin-profesores.php');
        exit;
    }
}

// Procesar formulario
if ($_POST) {
    $nombre = trim($_POST['nombre']);
    $apellido = trim($_POST['apellido']);
    $email = trim($_POST['email']);
    $materia = trim($_POST['materia']);
    $telefono = trim($_POST['telefono']);
    $password = $_POST['password'];
    
    try {
        if ($editing) {
            // Actualizar
            try {
                if (!empty($password)) {
                    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                    $stmt = $pdo->prepare("UPDATE profesores SET nombre=?, apellido=?, email=?, materia=?, telefono=?, password=? WHERE id=?");
                    $stmt->execute([$nombre, $apellido, $email, $materia, $telefono, $hashed_password, $_GET['id']]);
                } else {
                    $stmt = $pdo->prepare("UPDATE profesores SET nombre=?, apellido=?, email=?, materia=?, telefono=? WHERE id=?");
                    $stmt->execute([$nombre, $apellido, $email, $materia, $telefono, $_GET['id']]);
                }
            } catch(PDOException $e) {
                // Si falla, actualizar sin materia
                if (!empty($password)) {
                    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                    $stmt = $pdo->prepare("UPDATE profesores SET nombre=?, apellido=?, email=?, telefono=?, password=? WHERE id=?");
                    $stmt->execute([$nombre, $apellido, $email, $telefono, $hashed_password, $_GET['id']]);
                } else {
                    $stmt = $pdo->prepare("UPDATE profesores SET nombre=?, apellido=?, email=?, telefono=? WHERE id=?");
                    $stmt->execute([$nombre, $apellido, $email, $telefono, $_GET['id']]);
                }
            }
            header('Location: admin-profesores.php?msg=actualizado');
        } else {
            // Crear nuevo
            try {
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("INSERT INTO profesores (nombre, apellido, email, materia, telefono, password) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([$nombre, $apellido, $email, $materia, $telefono, $hashed_password]);
            } catch(PDOException $e) {
                // Si falla, crear sin materia
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("INSERT INTO profesores (nombre, apellido, email, telefono, password) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$nombre, $apellido, $email, $telefono, $hashed_password]);
            }
            header('Location: admin-profesores.php?msg=creado');
        }
        exit;
    } catch (PDOException $e) {
        $error = "Error: " . $e->getMessage();
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $editing ? 'Editar' : 'Crear' ?> Profesor - LUMEN</title>
    <link rel="stylesheet" href="admin-styles.css">
</head>
<body>
    <div class="header">
        <div class="logo">
            <img src="WhatsApp Image 2025-09-02 at 3.45.39 PM.jpeg" alt="Logo" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
            <div>
                <div class="logo-title">LUMEN</div>
                <div class="logo-subtitle"><?= $editing ? 'EDITAR' : 'CREAR' ?> PROFESOR</div>
            </div>
        </div>
        <div class="user-nav">
            <a href="admin-profesores.php" class="btn-back">← Volver</a>
            <a href="logout.php" class="btn-logout">Salir</a>
        </div>
    </div>

    <div class="main-content">
        <div class="page-header">
            <h1><?= $editing ? 'Editar' : 'Crear Nuevo' ?> Profesor</h1>
        </div>

        <?php if (isset($error)): ?>
            <div class="alert alert-danger"><?= $error ?></div>
        <?php endif; ?>

        <div class="form-container">
            <form method="POST" class="admin-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="nombre">Nombre</label>
                        <input type="text" id="nombre" name="nombre" value="<?= $profesor ? htmlspecialchars($profesor['nombre']) : '' ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="apellido">Apellido</label>
                        <input type="text" id="apellido" name="apellido" value="<?= $profesor ? htmlspecialchars($profesor['apellido']) : '' ?>" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" value="<?= $profesor ? htmlspecialchars($profesor['email']) : '' ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="telefono">Teléfono</label>
                        <input type="tel" id="telefono" name="telefono" value="<?= $profesor ? htmlspecialchars($profesor['telefono']) : '' ?>" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="materia">Materia</label>
                        <select id="materia" name="materia" required>
                            <option value="">Seleccionar materia</option>
                            <option value="Matemáticas" <?= ($profesor && $profesor['materia'] === 'Matemáticas') ? 'selected' : '' ?>>Matemáticas</option>
                            <option value="Historia" <?= ($profesor && $profesor['materia'] === 'Historia') ? 'selected' : '' ?>>Historia</option>
                            <option value="Inglés" <?= ($profesor && $profesor['materia'] === 'Inglés') ? 'selected' : '' ?>>Inglés</option>
                            <option value="Literatura" <?= ($profesor && $profesor['materia'] === 'Literatura') ? 'selected' : '' ?>>Literatura</option>
                            <option value="Ciencias" <?= ($profesor && $profesor['materia'] === 'Ciencias') ? 'selected' : '' ?>>Ciencias</option>
                            <option value="Educación Física" <?= ($profesor && $profesor['materia'] === 'Educación Física') ? 'selected' : '' ?>>Educación Física</option>
                            <option value="Geografía" <?= ($profesor && $profesor['materia'] === 'Geografía') ? 'selected' : '' ?>>Geografía</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="password">Contraseña <?= $editing ? '(dejar vacío para mantener actual)' : '' ?></label>
                        <input type="password" id="password" name="password" <?= !$editing ? 'required' : '' ?>>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-success"><?= $editing ? 'Actualizar' : 'Crear' ?> Profesor</button>
                    <a href="admin-profesores.php" class="btn-secondary">Cancelar</a>
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
    .form-group input, .form-group select {
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
        transition: all 0.3s;
    }
    .btn-success {
        background: #28a745;
        color: white;
    }
    .btn-secondary {
        background: #6c757d;
        color: white;
    }
    .alert-danger {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
        padding: 15px;
        border-radius: 5px;
        margin: 20px 0;
    }
    </style>
</body>
</html>