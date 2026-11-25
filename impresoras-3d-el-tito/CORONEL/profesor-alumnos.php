<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'profesor') {
    header('Location: login.php');
    exit;
}

$profesor_id = $_SESSION['user_id'];

// Obtener materias del profesor
$stmt = $pdo->prepare("SELECT DISTINCT curso FROM materias WHERE profesor_id = ?");
$stmt->execute([$profesor_id]);
$cursos = $stmt->fetchAll(PDO::FETCH_COLUMN);

// Obtener curso seleccionado
$curso_seleccionado = $_GET['curso'] ?? '';

// Obtener alumnos del curso seleccionado
$alumnos = [];
if ($curso_seleccionado) {
    $stmt = $pdo->prepare("SELECT * FROM alumnos WHERE curso = ? ORDER BY apellido, nombre");
    $stmt->execute([$curso_seleccionado]);
    $alumnos = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Obtener materias del profesor para el curso
$materias_profesor = [];
if ($curso_seleccionado) {
    $stmt = $pdo->prepare("SELECT nombre FROM materias WHERE profesor_id = ? AND curso = ?");
    $stmt->execute([$profesor_id, $curso_seleccionado]);
    $materias_profesor = $stmt->fetchAll(PDO::FETCH_COLUMN);
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mis Alumnos - LUMEN</title>
    <link rel="stylesheet" href="panel-profesores-styles.css">
</head>
<body>
    <div class="container">
        <div class="sidebar">
            <div class="logo">
                <a href="home.php" style="display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit;">
                    <img src="WhatsApp Image 2025-09-02 at 3.45.39 PM.jpeg" alt="Logo" style="width: 32px; height: 32px; border-radius: 8px; object-fit: cover;">
                    <span>LUMEN</span>
                </a>
            </div>
            
            <nav class="nav-menu">
                <a href="panel-profesores.php" class="nav-item">
                    <span class="nav-icon">📊</span>
                    Resumen
                </a>
                <a href="profesor-materias.php" class="nav-item">
                    <span class="nav-icon">📚</span>
                    Mis Materias
                </a>
                <a href="profesor-alumnos.php" class="nav-item active">
                    <span class="nav-icon">👥</span>
                    Mis Alumnos
                </a>
            </nav>
        </div>

        <div class="main-content">
            <div class="header">
                <div class="header-left">
                    <h1>Administrar Alumnos</h1>
                </div>
                <div class="header-right">
                    <a href="logout.php" class="btn-logout" style="padding: 5px 10px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px;">Salir</a>
                </div>
            </div>

            <div class="content">
                <!-- Estadísticas rápidas -->
                <div class="stats-mini">
                    <div class="stat-mini">
                        <span class="stat-icon">📚</span>
                        <div>
                            <div class="stat-number"><?= count($cursos) ?></div>
                            <div class="stat-label">Mis Cursos</div>
                        </div>
                    </div>
                    <div class="stat-mini">
                        <span class="stat-icon">👥</span>
                        <div>
                            <?php 
                            $total_alumnos = 0;
                            foreach ($cursos as $curso) {
                                $stmt = $pdo->prepare("SELECT COUNT(*) FROM alumnos WHERE curso = ?");
                                $stmt->execute([$curso]);
                                $total_alumnos += $stmt->fetchColumn();
                            }
                            ?>
                            <div class="stat-number"><?= $total_alumnos ?></div>
                            <div class="stat-label">Total Alumnos</div>
                        </div>
                    </div>
                    <?php if ($curso_seleccionado): ?>
                    <div class="stat-mini active">
                        <span class="stat-icon">🎯</span>
                        <div>
                            <div class="stat-number"><?= count($alumnos) ?></div>
                            <div class="stat-label">Curso <?= htmlspecialchars($curso_seleccionado) ?></div>
                        </div>
                    </div>
                    <?php endif; ?>
                </div>

                <div class="curso-selector">
                    <h2>📚 Seleccionar Curso</h2>
                    <div class="cursos-grid">
                        <?php foreach ($cursos as $curso): ?>
                        <?php 
                        $stmt = $pdo->prepare("SELECT COUNT(*) FROM alumnos WHERE curso = ?");
                        $stmt->execute([$curso]);
                        $cant_alumnos = $stmt->fetchColumn();
                        ?>
                        <a href="?curso=<?= $curso ?>" class="curso-card <?= $curso === $curso_seleccionado ? 'active' : '' ?>">
                            <div class="curso-header">
                                <h3>Curso <?= htmlspecialchars($curso) ?></h3>
                                <span class="curso-badge"><?= $cant_alumnos ?> alumnos</span>
                            </div>
                            <div class="curso-description">
                                <p>Ver y gestionar alumnos</p>
                            </div>
                        </a>
                        <?php endforeach; ?>
                    </div>
                </div>

                <?php if ($curso_seleccionado && !empty($alumnos)): ?>
                <div class="alumnos-section">
                    <div class="section-header">
                        <h2>👥 Alumnos de Curso <?= htmlspecialchars($curso_seleccionado) ?></h2>
                        <div class="section-actions">
                            <span class="total-count"><?= count($alumnos) ?> alumnos</span>
                        </div>
                    </div>
                    
                    <div class="alumnos-grid">
                        <?php foreach ($alumnos as $alumno): ?>
                        <div class="alumno-card">
                            <div class="alumno-avatar">
                                <?= strtoupper(substr($alumno['nombre'], 0, 1) . substr($alumno['apellido'], 0, 1)) ?>
                            </div>
                            <div class="alumno-info">
                                <h3><?= htmlspecialchars($alumno['nombre'] . ' ' . $alumno['apellido']) ?></h3>
                                <p class="alumno-email"><?= htmlspecialchars($alumno['email']) ?></p>
                                <span class="alumno-curso">Curso <?= htmlspecialchars($alumno['curso']) ?></span>
                            </div>
                            <div class="alumno-actions">
                                <button class="btn-calificar" onclick="openModal(<?= $alumno['id'] ?>, '<?= htmlspecialchars($alumno['nombre'] . ' ' . $alumno['apellido']) ?>')">
                                    📝 Calificar
                                </button>
                                <button class="btn-info" onclick="showAlumnoInfo(<?= $alumno['id'] ?>)">
                                    ℹ️ Info
                                </button>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php elseif ($curso_seleccionado): ?>
                <div class="empty-state">
                    <div class="empty-icon">👥</div>
                    <h3>No hay alumnos en este curso</h3>
                    <p>Este curso no tiene alumnos registrados aún.</p>
                    <a href="panel-profesores.php" class="btn-primary">Volver al Dashboard</a>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- Modal de Calificación -->
    <div id="modalCalificar" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>📝 Calificar Alumno</h2>
            <p id="alumnoNombre"></p>
            
            <form method="POST" action="panel-profesores.php">
                <input type="hidden" name="calificar" value="1">
                <input type="hidden" name="alumno_id" id="alumnoId">
                
                <div class="form-group">
                    <label>Materia</label>
                    <select name="materia" required>
                        <option value="">Seleccionar materia</option>
                        <?php foreach ($materias_profesor as $materia): ?>
                        <option value="<?= htmlspecialchars($materia) ?>"><?= htmlspecialchars($materia) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>1er Cuatrimestre</label>
                        <input type="number" name="cuatrimestre_1" min="1" max="10" step="0.1" placeholder="1.0 - 10.0">
                    </div>
                    <div class="form-group">
                        <label>2do Cuatrimestre</label>
                        <input type="number" name="cuatrimestre_2" min="1" max="10" step="0.1" placeholder="1.0 - 10.0">
                    </div>
                </div>
                
                <button type="submit" class="btn-primary">Guardar Calificación</button>
            </form>
        </div>
    </div>

    <style>
    .stats-mini {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }
    
    .stat-mini {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 15px;
        transition: all 0.3s ease;
    }
    
    .stat-mini:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }
    
    .stat-mini.active {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
    }
    
    .stat-mini .stat-icon {
        font-size: 24px;
    }
    
    .stat-mini .stat-number {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 4px;
    }
    
    .stat-mini .stat-label {
        font-size: 12px;
        opacity: 0.8;
    }
    
    .curso-selector {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        padding: 25px;
        border-radius: 15px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        margin-bottom: 30px;
    }
    
    .curso-selector h2 {
        color: #1e293b;
        margin-bottom: 20px;
        font-size: 20px;
        font-weight: 600;
    }
    
    .cursos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    
    .curso-card {
        background: white;
        padding: 20px;
        border-radius: 12px;
        text-decoration: none;
        color: #333;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .curso-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        border-color: #667eea;
    }
    
    .curso-card.active {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
    
    .curso-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    
    .curso-header h3 {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
    }
    
    .curso-badge {
        background: rgba(102, 126, 234, 0.1);
        color: #667eea;
        padding: 4px 8px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 500;
    }
    
    .curso-card.active .curso-badge {
        background: rgba(255, 255, 255, 0.2);
        color: white;
    }
    
    .curso-description p {
        margin: 0;
        font-size: 14px;
        opacity: 0.8;
    }
    
    .alumnos-section {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        padding: 25px;
        border-radius: 15px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .section-header h2 {
        color: #1e293b;
        font-size: 20px;
        font-weight: 600;
        margin: 0;
    }
    
    .total-count {
        background: #f1f5f9;
        color: #64748b;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
    }
    
    .alumnos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    
    .alumno-card {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 15px;
        transition: all 0.3s ease;
    }
    
    .alumno-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    .alumno-avatar {
        width: 50px;
        height: 50px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 600;
        flex-shrink: 0;
    }
    
    .alumno-info {
        flex: 1;
    }
    
    .alumno-info h3 {
        margin: 0 0 5px 0;
        color: #1e293b;
        font-size: 16px;
        font-weight: 600;
    }
    
    .alumno-email {
        color: #64748b;
        font-size: 14px;
        margin: 0 0 8px 0;
    }
    
    .alumno-curso {
        background: #10b981;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
    }
    
    .alumno-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .btn-calificar, .btn-info {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
    }
    
    .btn-info {
        background: #f1f5f9;
        color: #64748b;
    }
    
    .btn-calificar:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    
    .btn-info:hover {
        background: #e2e8f0;
        color: #475569;
    }
    
    .empty-state {
        text-align: center;
        padding: 60px 20px;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    
    .empty-icon {
        font-size: 64px;
        margin-bottom: 20px;
    }
    
    .empty-state h3 {
        color: #1e293b;
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 10px;
    }
    
    .empty-state p {
        color: #64748b;
        margin-bottom: 30px;
    }
    
    .btn-primary {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 25px;
        font-weight: 600;
        display: inline-block;
        transition: all 0.3s ease;
    }
    
    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
    
    /* Modal styles */
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
    }
    
    .modal-content {
        background: white;
        margin: 5% auto;
        padding: 30px;
        border-radius: 15px;
        width: 90%;
        max-width: 500px;
        position: relative;
    }
    
    .close {
        position: absolute;
        right: 15px;
        top: 15px;
        font-size: 28px;
        cursor: pointer;
        color: #64748b;
    }
    
    .close:hover {
        color: #1e293b;
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #1e293b;
    }
    
    .form-group input, .form-group select {
        width: 100%;
        padding: 12px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-family: 'Poppins', sans-serif;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
    
    @media (max-width: 768px) {
        .stats-mini {
            grid-template-columns: 1fr;
        }
        
        .cursos-grid {
            grid-template-columns: 1fr;
        }
        
        .alumnos-grid {
            grid-template-columns: 1fr;
        }
        
        .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
    }
    </style>
    <script>
        function openModal(alumnoId, alumnoNombre) {
            document.getElementById('modalCalificar').style.display = 'block';
            document.getElementById('alumnoId').value = alumnoId;
            document.getElementById('alumnoNombre').textContent = 'Alumno: ' + alumnoNombre;
        }
        
        function closeModal() {
            document.getElementById('modalCalificar').style.display = 'none';
        }
        
        function showAlumnoInfo(alumnoId) {
            alert('Información del alumno ID: ' + alumnoId + ' - Próximamente');
        }
        
        window.onclick = function(event) {
            const modal = document.getElementById('modalCalificar');
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    </script>
</body>
</html>