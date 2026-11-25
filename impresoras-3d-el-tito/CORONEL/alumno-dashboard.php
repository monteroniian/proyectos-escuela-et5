<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['user_type']) || ($_SESSION['user_type'] !== 'alumno' && $_SESSION['user_type'] !== 'admin')) {
    header('Location: login.php');
    exit;
}

// Obtener información del alumno
if ($_SESSION['user_type'] === 'admin' && isset($_GET['alumno_id'])) {
    $alumno_id = $_GET['alumno_id'];
} else {
    $alumno_id = $_SESSION['user_id'];
}

$stmt = $pdo->prepare("SELECT * FROM alumnos WHERE id = ?");
$stmt->execute([$alumno_id]);
$alumno = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$alumno) {
    header('Location: admin-panel.php');
    exit;
}

// Obtener calificaciones del alumno
$stmt = $pdo->prepare("SELECT * FROM calificaciones WHERE alumno_id = ? ORDER BY materia");
$stmt->execute([$alumno_id]);
$calificaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Calcular promedio general
$total_notas = 0;
$count_notas = 0;
foreach ($calificaciones as $cal) {
    if ($cal['calificacion_anual']) {
        $total_notas += $cal['calificacion_anual'];
        $count_notas++;
    }
}
$promedio_general = $count_notas > 0 ? round($total_notas / $count_notas, 1) : 0;
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Alumno - LUMEN</title>
    <link rel="stylesheet" href="main-dashboard-styles.css">
</head>
<body>
    <div class="sidebar">
        <div class="logo">
            <a href="home.php" style="display: flex; align-items: center; gap: 15px; text-decoration: none; color: inherit;">
                <img src="WhatsApp Image 2025-09-02 at 3.45.39 PM.jpeg" alt="Logo" class="logo-image" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
                <div>
                    <div class="logo-title">LUMEN</div>
                    <div class="logo-subtitle">Academia Educativa</div>
                </div>
            </a>
        </div>
        
        <nav class="nav-menu">
            <a href="#" class="nav-item active">
                <span class="nav-icon">📊</span>
                Dashboard
            </a>
            <a href="#" class="nav-item" onclick="showBoletin()">
                <span class="nav-icon">📋</span>
                Mi Boletín
            </a>
            <a href="#" class="nav-item">
                <span class="nav-icon">📚</span>
                Mis Cursos
            </a>
            <a href="#" class="nav-item">
                <span class="nav-icon">📝</span>
                Calificaciones
            </a>
            <a href="#" class="nav-item">
                <span class="nav-icon">⚙️</span>
                Configuración
            </a>
        </nav>
    </div>

    <div class="main-content">
        <div class="header">
            <div class="search-bar">
                <input type="text" placeholder="Buscar materias, calificaciones...">
            </div>
            <div class="header-actions">
                <span>Bienvenido, <?= htmlspecialchars($alumno['nombre']) ?></span>
                <div class="user-avatar"><?= strtoupper(substr($alumno['nombre'], 0, 1)) ?></div>
                <?php if ($_SESSION['user_type'] === 'admin'): ?>
                    <a href="admin-panel.php" class="btn-back" style="margin-right: 10px; padding: 5px 10px; background: #6c757d; color: white; text-decoration: none; border-radius: 5px;">← Admin</a>
                <?php endif; ?>
                <a href="logout.php" class="btn-logout">Salir</a>
            </div>
        </div>

        <div class="content" id="dashboard-content">
            <div class="welcome-section">
                <h1>Bienvenido, <?= htmlspecialchars($alumno['nombre']) ?></h1>
                <p>Aquí puedes ver tu progreso académico y acceder a tu boletín de calificaciones.</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">Materias</span>
                        <span class="stat-icon">📚</span>
                    </div>
                    <div class="stat-number"><?= count($calificaciones) ?></div>
                    <div class="stat-change neutral">Cursando</div>
                </div>
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">Promedio General</span>
                        <span class="stat-icon">📊</span>
                    </div>
                    <div class="stat-number"><?= $promedio_general ?></div>
                    <div class="stat-change <?= $promedio_general >= 7 ? 'positive' : 'negative' ?>">
                        <?= $promedio_general >= 7 ? 'Aprobado' : 'Necesita mejorar' ?>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-title">Curso</span>
                        <span class="stat-icon">🎓</span>
                    </div>
                    <div class="stat-number"><?= htmlspecialchars($alumno['curso']) ?></div>
                    <div class="stat-change neutral">Actual</div>
                </div>
            </div>

            <div class="content-grid">
                <div class="recent-students">
                    <h2>Mis Calificaciones</h2>
                    <div class="students-table">
                        <div class="table-header">
                            <span>Materia</span>
                            <span>Cuatrimestre 1</span>
                            <span>Cuatrimestre 2</span>
                            <span>Promedio</span>
                        </div>
                        <?php foreach ($calificaciones as $cal): ?>
                        <div class="student-row">
                            <div class="student-info">
                                <span><?= htmlspecialchars($cal['materia']) ?></span>
                            </div>
                            <span><?= $cal['cuatrimestre_1'] ?: '-' ?></span>
                            <span><?= $cal['cuatrimestre_2'] ?: '-' ?></span>
                            <span class="status <?= $cal['calificacion_anual'] >= 7 ? 'excellent' : ($cal['calificacion_anual'] >= 6 ? 'good' : 'attention') ?>">
                                <?= $cal['calificacion_anual'] ?: '-' ?>
                            </span>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="upcoming-classes">
                    <h2>Acciones Rápidas</h2>
                    <div class="class-list">
                        <div class="class-item">
                            <div class="class-info">
                                <h3>Ver Boletín Completo</h3>
                                <p>Accede a tu boletín oficial</p>
                            </div>
                            <button class="details-btn" onclick="showBoletin()">Ver Boletín</button>
                        </div>
                        <div class="class-item">
                            <div class="class-info">
                                <h3>Descargar Certificado</h3>
                                <p>Obtén tu certificado de notas</p>
                            </div>
                            <button class="details-btn">Descargar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contenido del Boletín (oculto inicialmente) -->
        <div class="content" id="boletin-content" style="display: none;">
            <div class="boletin-header">
                <h1>Mi Boletín de Calificaciones</h1>
                <div class="boletin-actions">
                    <button class="btn-secondary" onclick="showDashboard()">← Volver al Dashboard</button>
                    <button class="btn-primary" onclick="window.print()">Imprimir Boletín</button>
                </div>
            </div>

            <div class="boletin-container">
                <div class="student-info-card">
                    <h2>Información del Estudiante</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <label>ESTUDIANTE</label>
                            <span><?= htmlspecialchars($alumno['nombre'] . ' ' . $alumno['apellido']) ?></span>
                        </div>
                        <div class="info-item">
                            <label>EMAIL</label>
                            <span><?= htmlspecialchars($alumno['email']) ?></span>
                        </div>
                        <div class="info-item">
                            <label>CURSO</label>
                            <span><?= htmlspecialchars($alumno['curso']) ?></span>
                        </div>
                        <div class="info-item">
                            <label>CICLO LECTIVO</label>
                            <span>2025</span>
                        </div>
                    </div>
                </div>

                <div class="grades-card">
                    <h2>Calificaciones</h2>
                    <table class="grades-table">
                        <thead>
                            <tr>
                                <th>Materia</th>
                                <th>Cuatrimestre 1</th>
                                <th>Cuatrimestre 2</th>
                                <th>Promedio Anual</th>
                                <th>Calificación Final</th>
                                <th>Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($calificaciones as $cal): ?>
                            <tr>
                                <td><?= htmlspecialchars($cal['materia']) ?></td>
                                <td><?= $cal['cuatrimestre_1'] ?: '-' ?></td>
                                <td><?= $cal['cuatrimestre_2'] ?: '-' ?></td>
                                <td class="<?= $cal['calificacion_anual'] >= 7 ? 'aprobado' : 'desaprobado' ?>">
                                    <?= $cal['calificacion_anual'] ?: '-' ?>
                                </td>
                                <td><?= $cal['calificacion_final'] ?: '-' ?></td>
                                <td><?= htmlspecialchars($cal['observaciones']) ?: '-' ?></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>© 2025 Lumen - Academia Educativa</p>
        </div>
    </div>

    <style>
    .content {
        padding: 32px;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        margin: 20px;
    }
    .welcome-section h1 {
        color: white;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    .welcome-section p {
        color: rgba(255,255,255,0.9);
    }
    .boletin-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }
    .boletin-header h1 {
        color: white;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    .boletin-actions {
        display: flex;
        gap: 10px;
    }
    .boletin-container {
        display: grid;
        gap: 30px;
    }
    .student-info-card, .grades-card {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        padding: 25px;
        border-radius: 15px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }
    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin-top: 15px;
    }
    .info-item {
        display: flex;
        flex-direction: column;
    }
    .info-item label {
        font-size: 12px;
        color: #666;
        font-weight: 600;
        margin-bottom: 5px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .info-item span {
        font-size: 14px;
        color: #333;
        font-weight: 500;
    }
    .grades-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
    }
    .grades-table th, .grades-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid rgba(0,0,0,0.1);
    }
    .grades-table th {
        background: rgba(102, 126, 234, 0.1);
        font-weight: 600;
        color: #333;
    }
    .aprobado {
        color: #28a745;
        font-weight: 600;
    }
    .desaprobado {
        color: #dc3545;
        font-weight: 600;
    }
    .btn-secondary, .btn-primary {
        padding: 12px 24px;
        border: none;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.3s ease;
        font-family: 'Poppins', sans-serif;
    }
    .btn-secondary {
        background: linear-gradient(45deg, #6c757d, #5a6268);
        color: white;
    }
    .btn-primary {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
    }
    .btn-secondary:hover, .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    }
    .btn-logout {
        background: linear-gradient(45deg, #ff6b6b, #ee5a24);
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 20px;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    .btn-logout:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    .details-btn {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        padding: 8px 16px;
        border: none;
        border-radius: 15px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .details-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    }
    </style>

    <script>
    function showBoletin() {
        document.getElementById('dashboard-content').style.display = 'none';
        document.getElementById('boletin-content').style.display = 'block';
        
        // Actualizar navegación
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.nav-item')[1].classList.add('active');
    }

    function showDashboard() {
        document.getElementById('boletin-content').style.display = 'none';
        document.getElementById('dashboard-content').style.display = 'block';
        
        // Actualizar navegación
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.nav-item')[0].classList.add('active');
    }

    // Navegación del menú lateral
    document.querySelectorAll('.nav-item').forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (index === 1) { // Mi Boletín
                showBoletin();
            } else if (index === 0) { // Dashboard
                showDashboard();
            }
        });
    });
    </script>
</body>
</html>