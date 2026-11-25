<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'admin') {
    header('Location: login.php');
    exit;
}

$alumno = null;
$editing = false;

// Si estamos editando
if (isset($_GET['id'])) {
    $editing = true;
    $stmt = $pdo->prepare("SELECT * FROM alumnos WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    $alumno = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$alumno) {
        header('Location: admin-alumnos.php');
        exit;
    }
}

// Procesar formulario
if ($_POST) {
    $nombre = trim($_POST['nombre']);
    $apellido = trim($_POST['apellido']);
    $email = trim($_POST['email']);
    $curso = trim($_POST['curso']);
    $fecha_nacimiento = $_POST['fecha_nacimiento'];
    $password = $_POST['password'];
    
    try {
        if ($editing) {
            // Actualizar
            if (!empty($password)) {
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("UPDATE alumnos SET nombre=?, apellido=?, email=?, curso=?, fecha_nacimiento=?, password=? WHERE id=?");
                $stmt->execute([$nombre, $apellido, $email, $curso, $fecha_nacimiento, $hashed_password, $_GET['id']]);
            } else {
                $stmt = $pdo->prepare("UPDATE alumnos SET nombre=?, apellido=?, email=?, curso=?, fecha_nacimiento=? WHERE id=?");
                $stmt->execute([$nombre, $apellido, $email, $curso, $fecha_nacimiento, $_GET['id']]);
            }
            header('Location: admin-alumnos.php?msg=actualizado');
        } else {
            // Crear nuevo
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO alumnos (nombre, apellido, email, curso, fecha_nacimiento, password) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$nombre, $apellido, $email, $curso, $fecha_nacimiento, $hashed_password]);
            header('Location: admin-alumnos.php?msg=creado');
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
    <title><?= $editing ? 'Editar' : 'Crear' ?> Alumno - LUMEN</title>
    <link rel="stylesheet" href="admin-styles.css">
</head>
<body>
    <div class="header">
        <div class="logo">
            <img src="WhatsApp Image 2025-09-02 at 3.45.39 PM.jpeg" alt="Logo" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
            <div>
                <div class="logo-title">LUMEN</div>
                <div class="logo-subtitle"><?= $editing ? 'EDITAR' : 'CREAR' ?> ALUMNO</div>
            </div>
        </div>
        <div class="user-nav">
            <a href="admin-alumnos.php" class="btn-back">← Volver</a>
            <a href="logout.php" class="btn-logout">Salir</a>
        </div>
    </div>

    <div class="main-content">
        <div class="page-header">
            <h1><?= $editing ? 'Editar' : 'Crear Nuevo' ?> Alumno</h1>
        </div>

        <?php if (isset($error)): ?>
            <div class="alert alert-danger"><?= $error ?></div>
        <?php endif; ?>

        <div class="form-container">
            <form method="POST" class="admin-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="nombre">Nombre</label>
                        <input type="text" id="nombre" name="nombre" value="<?= $alumno ? htmlspecialchars($alumno['nombre']) : '' ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="apellido">Apellido</label>
                        <input type="text" id="apellido" name="apellido" value="<?= $alumno ? htmlspecialchars($alumno['apellido']) : '' ?>" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" value="<?= $alumno ? htmlspecialchars($alumno['email']) : '' ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="curso">Curso</label>
                        <select id="curso" name="curso" required>
                            <option value="">Seleccionar curso</option>
                            <option value="1° A" <?= ($alumno && $alumno['curso'] === '1° A') ? 'selected' : '' ?>>1° A</option>
                            <option value="1° B" <?= ($alumno && $alumno['curso'] === '1° B') ? 'selected' : '' ?>>1° B</option>
                            <option value="2° A" <?= ($alumno && $alumno['curso'] === '2° A') ? 'selected' : '' ?>>2° A</option>
                            <option value="2° B" <?= ($alumno && $alumno['curso'] === '2° B') ? 'selected' : '' ?>>2° B</option>
                            <option value="3° A" <?= ($alumno && $alumno['curso'] === '3° A') ? 'selected' : '' ?>>3° A</option>
                            <option value="3° B" <?= ($alumno && $alumno['curso'] === '3° B') ? 'selected' : '' ?>>3° B</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="fecha_nacimiento">Fecha de Nacimiento</label>
                        <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" value="<?= $alumno ? $alumno['fecha_nacimiento'] : '' ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Contraseña <?= $editing ? '(dejar vacío para mantener actual)' : '' ?></label>
                        <input type="password" id="password" name="password" <?= !$editing ? 'required' : '' ?>>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-success"><?= $editing ? 'Actualizar' : 'Crear' ?> Alumno</button>
                    <a href="admin-alumnos.php" class="btn-secondary">Cancelar</a>
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