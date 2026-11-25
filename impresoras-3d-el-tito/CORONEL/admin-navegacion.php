<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'admin') {
    header('Location: login.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Navegación Admin - LUMEN</title>
    <link rel="stylesheet" href="admin-styles.css">
</head>
<body>
    <div class="header">
        <div class="logo">
            <img src="WhatsApp Image 2025-09-02 at 3.45.39 PM.jpeg" alt="Logo" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
            <div>
                <div class="logo-title">LUMEN</div>
                <div class="logo-subtitle">NAVEGACIÓN ADMIN</div>
            </div>
        </div>
        <div class="user-nav">
            <a href="admin-panel.php" class="btn-back">← Panel Principal</a>
            <a href="logout.php" class="btn-logout">Salir</a>
        </div>
    </div>

    <div class="main-content">
        <div class="page-header">
            <h1>Acceso Completo de Administrador</h1>
            <p>Navega a cualquier sección del sistema</p>
        </div>

        <div class="nav-grid">
            <div class="nav-section">
                <h3>👥 Gestión de Alumnos</h3>
                <div class="nav-links">
                    <a href="admin-alumnos.php" class="nav-link">📋 Lista de Alumnos</a>
                    <a href="admin-crear-alumno.php" class="nav-link">➕ Crear Alumno</a>
                    <a href="#" class="nav-link" onclick="mostrarAlumnos()"🏠 Ver Dashboard Alumno</a>
                </div>
            </div>

            <div class="nav-section">
                <h3>🎓 Gestión de Profesores</h3>
                <div class="nav-links">
                    <a href="admin-profesores.php" class="nav-link">📋 Lista de Profesores</a>
                    <a href="admin-crear-profesor.php" class="nav-link">➕ Crear Profesor</a>
                    <a href="#" class="nav-link" onclick="mostrarProfesores()"🏠 Ver Dashboard Profesor</a>
                </div>
            </div>

            <div class="nav-section">
                <h3>📊 Calificaciones</h3>
                <div class="nav-links">
                    <a href="admin-calificaciones.php" class="nav-link">📈 Gestionar Calificaciones</a>
                    <a href="admin-asignar-notas.php" class="nav-link">📝 Asignar Notas</a>
                </div>
            </div>

            <div class="nav-section">
                <h3>⚙️ Sistema</h3>
                <div class="nav-links">
                    <a href="admin-panel.php" class="nav-link">🏠 Panel Principal</a>
                    <a href="login.php" class="nav-link">🔐 Página de Login</a>
                    <a href="config.php" class="nav-link" onclick="alert('Archivo de configuración - Solo lectura'); return false;">⚙️ Configuración</a>
                </div>
            </div>
        </div>

        <div class="quick-actions">
            <h3>Acciones Rápidas</h3>
            <div class="action-buttons">
                <a href="admin-crear-alumno.php" class="action-btn success">Crear Alumno</a>
                <a href="admin-crear-profesor.php" class="action-btn success">Crear Profesor</a>
                <a href="admin-asignar-notas.php" class="action-btn primary">Asignar Notas</a>
                <a href="admin-calificaciones.php" class="action-btn warning">Ver Calificaciones</a>
            </div>
        </div>
    </div>

    <style>
    .nav-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 25px;
        margin-top: 30px;
    }
    .nav-section {
        background: white;
        border-radius: 10px;
        padding: 25px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .nav-section h3 {
        margin-bottom: 20px;
        color: #333;
        border-bottom: 2px solid #007bff;
        padding-bottom: 10px;
    }
    .nav-links {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .nav-link {
        padding: 12px 15px;
        background: #f8f9fa;
        color: #333;
        text-decoration: none;
        border-radius: 8px;
        border-left: 4px solid #007bff;
        transition: all 0.3s;
    }
    .nav-link:hover {
        background: #e9ecef;
        transform: translateX(5px);
    }
    .quick-actions {
        background: white;
        border-radius: 10px;
        padding: 25px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin-top: 30px;
    }
    .quick-actions h3 {
        margin-bottom: 20px;
        color: #333;
    }
    .action-buttons {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    }
    .action-btn {
        padding: 12px 20px;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        transition: all 0.3s;
    }
    .action-btn.success {
        background: #28a745;
        color: white;
    }
    .action-btn.primary {
        background: #007bff;
        color: white;
    }
    .action-btn.warning {
        background: #ffc107;
        color: #000;
    }
    .action-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
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

    <script>
    function mostrarAlumnos() {
        fetch('admin-alumnos.php')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const alumnos = doc.querySelectorAll('.data-table tbody tr');
                
                let opciones = 'Selecciona un alumno para ver su dashboard:\n\n';
                alumnos.forEach((row, index) => {
                    const id = row.cells[0].textContent;
                    const nombre = row.cells[1].textContent + ' ' + row.cells[2].textContent;
                    const curso = row.cells[4].textContent;
                    opciones += `${index + 1}. ${nombre} - ${curso} (ID: ${id})\n`;
                });
                
                const seleccion = prompt(opciones + '\nIngresa el ID del alumno:');
                if (seleccion) {
                    window.open(`alumno-dashboard.php?alumno_id=${seleccion}`, '_blank');
                }
            })
            .catch(() => {
                const id = prompt('Ingresa el ID del alumno para ver su dashboard:');
                if (id) {
                    window.open(`alumno-dashboard.php?alumno_id=${id}`, '_blank');
                }
            });
    }
    
    function mostrarProfesores() {
        fetch('admin-profesores.php')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const profesores = doc.querySelectorAll('.data-table tbody tr');
                
                let opciones = 'Selecciona un profesor para ver su dashboard:\n\n';
                profesores.forEach((row, index) => {
                    const id = row.cells[0].textContent;
                    const nombre = row.cells[1].textContent + ' ' + row.cells[2].textContent;
                    const materia = row.cells[4].textContent;
                    opciones += `${index + 1}. ${nombre} - ${materia} (ID: ${id})\n`;
                });
                
                const seleccion = prompt(opciones + '\nIngresa el ID del profesor:');
                if (seleccion) {
                    window.open(`panel-profesores.php?profesor_id=${seleccion}`, '_blank');
                }
            })
            .catch(() => {
                const id = prompt('Ingresa el ID del profesor para ver su dashboard:');
                if (id) {
                    window.open(`panel-profesores.php?profesor_id=${id}`, '_blank');
                }
            });
    }
    </script>
</body>
</html>