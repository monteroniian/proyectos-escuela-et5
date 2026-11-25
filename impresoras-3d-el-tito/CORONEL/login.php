<?php
session_start();
require_once 'config.php';

if ($_POST) {
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $role = $_POST['role'];
    
    try {
        if ($role === 'admin') {
            $sql = "SELECT * FROM administradores WHERE email = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_type'] = 'admin';
                $_SESSION['user_name'] = $user['nombre'] . ' ' . $user['apellido'];
                header('Location: admin-panel.php');
                exit;
            }
        } elseif ($role === 'profesor') {
            $sql = "SELECT * FROM profesores WHERE email = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_type'] = 'profesor';
                $_SESSION['user_name'] = $user['nombre'] . ' ' . $user['apellido'];
                header('Location: panel-profesores.php');
                exit;
            }
        } else {
            $sql = "SELECT * FROM alumnos WHERE email = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_type'] = 'alumno';
                $_SESSION['user_name'] = $user['nombre'] . ' ' . $user['apellido'];
                header('Location: alumno-dashboard.php');
                exit;
            }
        }
        
        $error = "Email o contraseña incorrectos";
    } catch (Exception $e) {
        $error = "Error del sistema. Intente nuevamente.";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LUMEN - Iniciar Sesión</title>
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
            <h1>Inicia sesión</h1>
            <p>Accede como <strong>admin</strong>, <strong>profesor</strong> o <strong>alumno</strong>.</p>
            <div class="roles">
                <div class="role-card">
                    <h4>Admin</h4>
                    <p>Gestiona profesores y alumnos</p>
                </div>
                <div class="role-card">
                    <h4>Profesor</h4>
                    <p>Publica material y calificaciones</p>
                </div>
                <div class="role-card">
                    <h4>Alumno</h4>
                    <p>Entrega tareas y revisa progreso</p>
                </div>
            </div>
        </div>

        <div class="right">
            <h2>Bienvenido</h2>
            <p class="subtext">Selecciona tu rol para iniciar sesión</p>

            <?php if (isset($error)): ?>
                <div class="error" style="color: red; margin: 10px 0;"><?= $error ?></div>
            <?php endif; ?>

            <form method="POST">
                <div class="tabs" style="margin-bottom: 20px;">
                    <input type="radio" name="role" value="admin" id="admin" required style="margin-right: 5px;">
                    <label for="admin" class="tab" style="margin-right: 10px; cursor: pointer;">Admin</label>
                    <input type="radio" name="role" value="profesor" id="profesor" required style="margin-right: 5px;">
                    <label for="profesor" class="tab" style="margin-right: 10px; cursor: pointer;">Profesor</label>
                    <input type="radio" name="role" value="alumno" id="alumno" required style="margin-right: 5px;">
                    <label for="alumno" class="tab" style="cursor: pointer;">Alumno</label>
                </div>

                <div class="form-group">
                    <input type="email" name="email" placeholder="Correo electrónico" required>
                </div>
                <div class="form-group">
                    <input type="password" name="password" id="passwordField" placeholder="Contraseña" required>
                </div>
                <div style="text-align: right; margin-bottom: 10px;">
                    <a href="recuperar_password.php" id="forgotLink" style="color: #2f6dff; font-size: 12px; text-decoration: none;">¿Olvidaste tu contraseña?</a>
                </div>
                <button type="submit" class="login-btn">Entrar</button>
            </form>
            
            <div style="margin-top: 15px; font-size: 12px; color: #666;">
                <strong>Credenciales de prueba:</strong><br>
                Admin: admin@lumen.edu / password<br>
                Profesor: carlos.rodriguez@lumen.edu / password<br>
                Alumno: ana.garcia@email.com / password
            </div>

            <div style="margin-top: 15px; text-align: center;">
                <a href="registro.php" style="color: #2f6dff; display: block; margin-bottom: 5px;">Registro de Alumnos</a>
                <a href="registro_profesor.php" style="color: #2f6dff; font-size: 12px; display: block; margin-bottom: 5px;">Registro de Profesores</a>
                <a href="registro_admin.php" style="color: #ff6b6b; font-size: 12px;">Crear Admin</a>
            </div>
        </div>
    </div>

    <footer>© 2025 LUMEN</footer>

    <script>
    // Cambiar placeholder según el rol seleccionado
    const roleInputs = document.querySelectorAll('input[name="role"]');
    const passwordField = document.getElementById('passwordField');
    const forgotLink = document.getElementById('forgotLink');
    
    roleInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value === 'admin') {
                passwordField.placeholder = 'Código de Administrador';
                forgotLink.style.display = 'none';
            } else {
                passwordField.placeholder = 'Contraseña';
                forgotLink.style.display = 'inline';
            }
        });
    });
    </script>
</body>
</html>