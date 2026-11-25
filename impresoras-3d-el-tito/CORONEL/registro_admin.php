<?php
require_once 'config.php';

if ($_POST) {
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $email = $_POST['email'];
    $codigo_admin = $_POST['password'];
    
    // Validar código de administrador
    if ($codigo_admin !== '2007') {
        $error = "Código de administrador incorrecto";
    } else {
        $password = password_hash($codigo_admin, PASSWORD_DEFAULT);
        
        // Verificar si el email ya existe
        $sql = "SELECT id FROM administradores WHERE email = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$email]);
        
        if ($stmt->fetch()) {
            $error = "El correo ya está registrado";
        } else {
            $sql = "INSERT INTO administradores (nombre, apellido, email, password) VALUES (?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            
            if ($stmt->execute([$nombre, $apellido, $email, $password])) {
                header('Location: login.php?registered=admin');
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
    <title>LUMEN - Crear cuenta Administrador</title>
    <link rel="stylesheet" href="crearcuenta.css">
</head>
<body>
    <header class="navbar">
        <div class="logo">
            <a href="home.php" style="display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit;">
                <img src="WhatsApp Image 2025-09-02 at 3.45.39 PM.jpeg" alt="Logo Lumen" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
                <span>LUMEN</span>
            </a>
        </div>
        <div class="nav-buttons">
            <a href="login.php" class="btn-outline">Inicio sesión</a>
        </div>
    </header>

    <main class="main-container">
        <section class="form-section">
            <span class="badge">Admin</span>
            <h1>Crear cuenta Administrador</h1>
            <p class="subtitle">
                Registro exclusivo para administradores del sistema. 
                Requiere un código especial de administrador para el acceso.
            </p>

            <?php if (isset($error)): ?>
                <div class="error"><?= $error ?></div>
            <?php endif; ?>

            <form method="POST" class="form-box">
                <div class="form-row">
                    <div class="form-group">
                        <label>Nombre</label>
                        <input type="text" name="nombre" placeholder="Nombre" required>
                    </div>
                    <div class="form-group">
                        <label>Apellido</label>
                        <input type="text" name="apellido" placeholder="Apellido" required>
                    </div>
                </div>

                <div class="form-group">
                    <label>Email Administrativo</label>
                    <input type="email" name="email" placeholder="admin@lumen.edu" required>
                </div>

                <div class="form-group">
                    <label>Código de Administrador</label>
                    <input type="password" name="password" placeholder="Código secreto de admin" required>
                </div>

                <p class="terms">El código de administrador es proporcionado por el director del sistema.</p>

                <button type="submit" class="btn-create">Crear cuenta Admin</button>
            </form>
        </section>

        <aside class="info-section">
            <h2>Privilegios de Administrador</h2>
            <ul>
                <li>Gestión completa de alumnos</li>
                <li>Administración de profesores</li>
                <li>Control de calificaciones</li>
                <li>Acceso a reportes del sistema</li>
            </ul>
            <div class="login-link">
                ¿Ya tienes cuenta? <a href="login.php">Inicia sesión aquí</a>
            </div>
        </aside>
    </main>

    <footer>© 2025 LUMEN</footer>
</body>
</html>