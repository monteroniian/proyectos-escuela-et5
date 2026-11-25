<?php
require_once 'config.php';

if ($_POST) {
    $codigo_admin = $_POST['codigo_admin'];
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $email = $_POST['email'];

    $telefono = $_POST['telefono'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    
    // Verificar código de administrador
    $sql = "SELECT id FROM admin_codes WHERE codigo = ? AND activo = 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$codigo_admin]);
    
    if (!$stmt->fetch()) {
        $error = "Código de administrador inválido";
    } else {
        // Verificar si el email ya existe
        $sql = "SELECT id FROM profesores WHERE email = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$email]);
        
        if ($stmt->fetch()) {
            $error = "El correo ya está registrado";
        } else {
            $sql = "INSERT INTO profesores (nombre, apellido, email, telefono, password) VALUES (?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            
            if ($stmt->execute([$nombre, $apellido, $email, $telefono, $password])) {
                header('Location: login.php?registered=1');
                exit;
            } else {
                $error = "Error al crear la cuenta";
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LUMEN - Registro de Profesores</title>
    <link rel="stylesheet" href="crearcuenta.css">
</head>
<body>
    <header class="navbar">
        <div class="logo">
            <img src="WhatsApp Image 2025-09-02 at 3.45.39 PM.jpeg" alt="Logo Lumen" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
            <span>LUMEN</span>
        </div>
        <div class="nav-buttons">
            <a href="login.php" class="btn-outline">Inicio sesión</a>
        </div>
    </header>

    <main class="main-container">
        <section class="form-section">
            <span class="badge">Profesores</span>
            <h1>Registro de Profesores</h1>
            <p class="subtitle">
                Solo administradores con código válido pueden registrar profesores.
            </p>

            <?php if (isset($error)): ?>
                <div class="error" style="color: red; margin: 10px 0; padding: 10px; background: rgba(255,0,0,0.1); border-radius: 5px;"><?= $error ?></div>
            <?php endif; ?>

            <form method="POST" class="form-box">
                <div class="form-group">
                    <label>Código de Administrador *</label>
                    <input type="text" name="codigo_admin" placeholder="Ingrese código de admin" required>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Nombre</label>
                        <input type="text" name="nombre" placeholder="Juan" required>
                    </div>
                    <div class="form-group">
                        <label>Apellido</label>
                        <input type="text" name="apellido" placeholder="Pérez" required>
                    </div>
                </div>

                <div class="form-group">
                    <label>Correo institucional</label>
                    <input type="email" name="email" placeholder="profesor@lumen.edu" required>
                </div>

                <div class="form-group">
                    <label>Teléfono</label>
                    <input type="tel" name="telefono" placeholder="555-0123" required>
                </div>

                <div class="form-group">
                    <label>Contraseña</label>
                    <input type="password" name="password" required>
                </div>

                <button type="submit" class="btn-create">Registrar Profesor</button>
            </form>
        </section>

        <aside class="info-section">
            <h2>Registro de Profesores</h2>
            <ul>
                <li>Solo administradores pueden registrar profesores.</li>
                <li>Se requiere código de administrador válido.</li>
                <li>El profesor podrá acceder inmediatamente.</li>
            </ul>
            <div class="login-link">
                <a href="registro.php">Registro de alumnos</a>
            </div>
        </aside>
    </main>

    <footer>© 2025 LUMEN</footer>
</body>
</html>