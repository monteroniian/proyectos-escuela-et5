<?php
require_once 'config.php';

if ($_POST) {
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $email = $_POST['correo'];
    $curso = $_POST['curso'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    
    // Verificar si el email ya existe
    $sql = "SELECT id FROM alumnos WHERE email = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        $error = "El correo ya está registrado";
    } else {
        $sql = "INSERT INTO alumnos (nombre, apellido, email, curso, password, fecha_nacimiento) VALUES (?, ?, ?, ?, ?, CURDATE())";
        $stmt = $pdo->prepare($sql);
        
        if ($stmt->execute([$nombre, $apellido, $email, $curso, $password])) {
            header('Location: login.php?registered=1');
            exit;
        } else {
            $error = "Error al crear la cuenta";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LUMEN - Crear cuenta de alumnos</title>
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
            <span class="badge">Nuevo</span>
            <h1>Crear cuenta de alumnos</h1>
            <p class="subtitle">
                Regístrate para acceder a tus calificaciones, asistencias y comunicaciones.
                Usa tu correo institucional para una verificación más rápida.
            </p>

            <?php if (isset($error)): ?>
                <div class="error" style="color: red; margin: 10px 0; padding: 10px; background: rgba(255,0,0,0.1); border-radius: 5px;"><?= $error ?></div>
            <?php endif; ?>

            <form method="POST" class="form-box">
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
                    <input type="email" name="correo" placeholder="nombre.apellido@colegio.edu" required>
                </div>

                <div class="form-group">
                    <label>Curso / División</label>
                    <select name="curso" required>
                        <option value="">Seleccionar curso</option>
                        <option value="1-1">1-1</option>
                        <option value="1-2">1-2</option>
                        <option value="1-3">1-3</option>
                        <option value="2-1">2-1</option>
                        <option value="2-2">2-2</option>
                        <option value="2-3">2-3</option>
                        <option value="3-1">3-1</option>
                        <option value="3-2">3-2</option>
                        <option value="3-3">3-3</option>
                        <option value="4-1">4-1</option>
                        <option value="4-2">4-2</option>
                        <option value="4-3">4-3</option>
                        <option value="5-1">5-1</option>
                        <option value="5-2">5-2</option>
                        <option value="5-3">5-3</option>
                        <option value="6-1">6-1</option>
                        <option value="6-2">6-2</option>
                        <option value="6-3">6-3</option>
                    </select>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Contraseña</label>
                        <input type="password" name="password" required>
                    </div>
                    <div class="form-group">
                        <label>Confirmar contraseña</label>
                        <input type="password" name="confirm_password" required>
                    </div>
                </div>

                <p class="terms">Al registrarte aceptas los términos y la política de privacidad.</p>

                <button type="submit" class="btn-create">Crear cuenta</button>
            </form>
        </section>

        <aside class="info-section">
            <h2>Beneficios del portal</h2>
            <ul>
                <li>Consulta de calificaciones en tiempo real.</li>
                <li>Descarga de boletín oficial.</li>
                <li>Comunicación directa con el establecimiento.</li>
            </ul>
            <div class="login-link">
                ¿Ya tienes cuenta? <a href="login.php">Inicia sesión aquí</a>
            </div>
        </aside>
    </main>

    <footer>© 2025 LUMEN</footer>
</body>
</html>