<?php
require_once 'config.php';

if ($_POST) {
    $email = $_POST['email'];
    $role = $_POST['role'];
    
    // Verificar si el email existe según el rol
    if ($role === 'profesor') {
        $sql = "SELECT id, nombre, apellido FROM profesores WHERE email = ?";
    } else {
        $sql = "SELECT id, nombre, apellido FROM alumnos WHERE email = ?";
    }
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        $success = "Se ha enviado un enlace de recuperación a tu correo electrónico.";
        // Aquí normalmente enviarías un email real
    } else {
        $error = "No se encontró una cuenta con ese correo electrónico.";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LUMEN - Recuperar Contraseña</title>
    <link rel="stylesheet" href="iniciosesion.css">
</head>
<body>
    <header class="main-header">
        <a href="home.php" style="display: flex; align-items: center; gap: 0.8rem; text-decoration: none; color: inherit;">
            <img src="WhatsApp Image 2025-09-02 at 3.45.39 PM.jpeg" alt="Logo LUMEN" class="logo" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
            <h1 class="header-title">LUMEN</h1>
        </a>
    </header>

    <div class="container">
        <div class="left">
            <h1>Recuperar Contraseña</h1>
            <p>Ingresa tu correo electrónico y selecciona tu tipo de cuenta para recibir instrucciones de recuperación.</p>
        </div>

        <div class="right">
            <h2>Restablecer Acceso</h2>
            <p class="subtext">Te enviaremos un enlace para crear una nueva contraseña</p>

            <?php if (isset($error)): ?>
                <div class="error" style="color: red; margin: 10px 0; padding: 10px; background: rgba(255,0,0,0.1); border-radius: 5px;"><?= $error ?></div>
            <?php endif; ?>

            <?php if (isset($success)): ?>
                <div class="success" style="color: green; margin: 10px 0; padding: 10px; background: rgba(0,255,0,0.1); border-radius: 5px;"><?= $success ?></div>
            <?php endif; ?>

            <form method="POST">
                <div class="tabs" style="margin-bottom: 20px;">
                    <input type="radio" name="role" value="profesor" id="profesor" required style="margin-right: 5px;">
                    <label for="profesor" class="tab" style="margin-right: 10px; cursor: pointer;">Profesor</label>
                    <input type="radio" name="role" value="alumno" id="alumno" required style="margin-right: 5px;">
                    <label for="alumno" class="tab" style="cursor: pointer;">Alumno</label>
                </div>

                <div class="form-group">
                    <input type="email" name="email" placeholder="Correo electrónico" required>
                </div>
                
                <button type="submit" class="login-btn">Enviar Enlace</button>
            </form>

            <div style="margin-top: 15px; text-align: center;">
                <a href="login.php" style="color: #2f6dff;">← Volver al inicio de sesión</a>
            </div>
        </div>
    </div>

    <footer>© 2025 LUMEN</footer>
</body>
</html>