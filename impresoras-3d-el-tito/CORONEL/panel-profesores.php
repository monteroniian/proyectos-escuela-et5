<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['user_type']) || ($_SESSION['user_type'] !== 'profesor' && $_SESSION['user_type'] !== 'admin')) {
    header('Location: login.php');
    exit;
}

// Obtener información del profesor
if ($_SESSION['user_type'] === 'admin' && isset($_GET['profesor_id'])) {
    $profesor_id = $_GET['profesor_id'];
} else {
    $profesor_id = $_SESSION['user_id'];
}

$stmt = $pdo->prepare("SELECT * FROM profesores WHERE id = ?");
$stmt->execute([$profesor_id]);
$profesor = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$profesor) {
    header('Location: admin-panel.php');
    exit;
}

// Procesar calificaciones
if ($_POST && isset($_POST['calificar'])) {
    $alumno_id = $_POST['alumno_id'];
    $materia = $_POST['materia'];
    $cuatrimestre_1 = $_POST['cuatrimestre_1'] ?: null;
    $cuatrimestre_2 = $_POST['cuatrimestre_2'] ?: null;
    
    $nota_final = null;
    if ($cuatrimestre_1 && $cuatrimestre_2) {
        $nota_final = round(($cuatrimestre_1 + $cuatrimestre_2) / 2, 1);
    }
    
    $stmt = $pdo->prepare("SELECT id FROM calificaciones WHERE alumno_id = ? AND materia = ?");
    $stmt->execute([$alumno_id, $materia]);
    $existe = $stmt->fetch();
    
    if ($existe) {
        $sql = "UPDATE calificaciones SET cuatrimestre_1 = ?, cuatrimestre_2 = ?, calificacion_anual = ? WHERE alumno_id = ? AND materia = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$cuatrimestre_1, $cuatrimestre_2, $nota_final, $alumno_id, $materia]);
    } else {
        $sql = "INSERT INTO calificaciones (alumno_id, materia, cuatrimestre_1, cuatrimestre_2, calificacion_anual) VALUES (?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$alumno_id, $materia, $cuatrimestre_1, $cuatrimestre_2, $nota_final]);
    }
    
    $success = "Calificación guardada correctamente";
}

// Obtener cursos del profesor
$stmt = $pdo->prepare("SELECT DISTINCT curso FROM materias WHERE profesor_id = ?");
$stmt->execute([$profesor_id]);
$cursos = $stmt->fetchAll(PDO::FETCH_COLUMN);

$curso_seleccionado = $_GET['curso'] ?? ($cursos[0] ?? '');

$alumnos = [];
if ($curso_seleccionado) {
    $stmt = $pdo->prepare("SELECT * FROM alumnos WHERE curso = ? ORDER BY apellido, nombre");
    $stmt->execute([$curso_seleccionado]);
    $alumnos = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

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
    <title>Panel de Profesores - LUMEN</title>
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
                <a href="#" class="nav-item active">
                    <span class="nav-icon">📊</span>
                    Resumen
                </a>
                <a href="profesor-materias.php" class="nav-item">
                    <span class="nav-icon">📚</span>
                    Mis Materias
                </a>
                <a href="profesor-alumnos.php" class="nav-item">
                    <span class="nav-icon">👥</span>
                    Mis Alumnos
                </a>
                <a href="#" class="nav-item">
                    <span class="nav-icon">📋</span>
                    Asistencia
                </a>
                <a href="#" class="nav-item">
                    <span class="nav-icon">🕐</span>
                    Horarios
                </a>
                <a href="#" class="nav-item">
                    <span class="nav-icon">💬</span>
                    Mensajes
                </a>
                <a href="#" class="nav-item">
                    <span class="nav-icon">⚙️</span>
                    Configuración
                </a>
            </nav>
        </div>

        <div class="main-content">
            <div class="header">
                <div class="header-left">
                    <div class="logo-small">
                        <img src="WhatsApp Image 2025-09-02 at 3.45.39 PM.jpeg" alt="Logo" style="width: 24px; height: 24px; border-radius: 6px; object-fit: cover;">
                    </div>
                    <div class="search-bar">
                        <input type="text" placeholder="Buscar clases, alumnos...">
                    </div>
                </div>
                <div class="header-right">
                    <button class="notification-btn">🔔</button>
                    <div class="user-avatar"><?= strtoupper(substr($profesor['nombre'], 0, 1) . substr($profesor['apellido'], 0, 1)) ?></div>
                    <span style="margin-left: 10px; color: #666;"><?= htmlspecialchars($profesor['nombre'] . ' ' . $profesor['apellido']) ?></span>
                    <?php if ($_SESSION['user_type'] === 'admin'): ?>
                        <a href="admin-panel.php" class="btn-back" style="margin-left: 10px; padding: 5px 10px; background: #6c757d; color: white; text-decoration: none; border-radius: 5px;">← Admin</a>
                    <?php endif; ?>
                    <a href="logout.php" class="btn-logout" style="margin-left: 10px; padding: 5px 10px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px;">Salir</a>
                    <button class="menu-btn">☰</button>
                </div>
            </div>

            <div class="content">
                <div class="page-header">
                    <h1>Panel de Profesores</h1>
                    <span class="badge">LUMEN</span>
                </div>
                <p class="subtitle">Bienvenido, <?= htmlspecialchars($profesor['nombre']) ?></p>

                <?php if (isset($success)): ?>
                    <div class="alert success"><?= $success ?></div>
                <?php endif; ?>

                <?php 
                // Obtener estadísticas generales
                $total_alumnos = 0;
                $total_materias = 0;
                foreach ($cursos as $curso) {
                    $stmt = $pdo->prepare("SELECT COUNT(*) FROM alumnos WHERE curso = ?");
                    $stmt->execute([$curso]);
                    $total_alumnos += $stmt->fetchColumn();
                    
                    $stmt = $pdo->prepare("SELECT COUNT(*) FROM materias WHERE profesor_id = ? AND curso = ?");
                    $stmt->execute([$profesor_id, $curso]);
                    $total_materias += $stmt->fetchColumn();
                }
                ?>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">👥</div>
                        <div class="stat-content">
                            <div class="stat-label">Total Estudiantes</div>
                            <div class="stat-number"><?= $total_alumnos ?></div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📚</div>
                        <div class="stat-content">
                            <div class="stat-label">Mis Cursos</div>
                            <div class="stat-number"><?= count($cursos) ?></div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📝</div>
                        <div class="stat-content">
                            <div class="stat-label">Mis Materias</div>
                            <div class="stat-number"><?= $total_materias ?></div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-content">
                            <div class="stat-label">Estado</div>
                            <div class="stat-number">Activo</div>
                        </div>
                    </div>
                </div>

                <!-- Sección de Mis Cursos -->
                <?php if (!empty($cursos)): ?>
                <div class="dashboard-section">
                    <h2>📚 Mis Cursos</h2>
                    <div class="cursos-grid">
                        <?php foreach ($cursos as $curso): ?>
                        <?php 
                        $stmt = $pdo->prepare("SELECT COUNT(*) FROM alumnos WHERE curso = ?");
                        $stmt->execute([$curso]);
                        $cant_alumnos = $stmt->fetchColumn();
                        
                        $stmt = $pdo->prepare("SELECT COUNT(*) FROM materias WHERE profesor_id = ? AND curso = ?");
                        $stmt->execute([$profesor_id, $curso]);
                        $cant_materias = $stmt->fetchColumn();
                        ?>
                        <div class="curso-card">
                            <div class="curso-header">
                                <h3>Curso <?= htmlspecialchars($curso) ?></h3>
                                <span class="curso-badge"><?= $cant_alumnos ?> alumnos</span>
                            </div>
                            <div class="curso-stats">
                                <div class="curso-stat">
                                    <span class="stat-icon">📝</span>
                                    <span><?= $cant_materias ?> materias</span>
                                </div>
                            </div>
                            <div class="curso-actions">
                                <a href="profesor-alumnos.php?curso=<?= $curso ?>" class="btn-secondary">Ver Alumnos</a>
                                <a href="profesor-materias.php" class="btn-primary">Gestionar</a>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- Sección de Mis Materias -->
                <div class="dashboard-section">
                    <h2>📝 Mis Materias</h2>
                    <?php 
                    $stmt = $pdo->prepare("SELECT * FROM materias WHERE profesor_id = ? ORDER BY curso, nombre");
                    $stmt->execute([$profesor_id]);
                    $todas_materias = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    ?>
                    <?php if (!empty($todas_materias)): ?>
                    <div class="materias-grid">
                        <?php foreach ($todas_materias as $materia): ?>
                        <div class="materia-card">
                            <div class="materia-header">
                                <h3><?= htmlspecialchars($materia['nombre']) ?></h3>
                                <span class="materia-curso">Curso <?= htmlspecialchars($materia['curso']) ?></span>
                            </div>
                            <p class="materia-desc"><?= htmlspecialchars($materia['descripcion'] ?: 'Sin descripción') ?></p>
                            <div class="materia-actions">
                                <a href="profesor-alumnos.php?curso=<?= $materia['curso'] ?>" class="btn-outline">Ver Alumnos</a>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <?php else: ?>
                    <div class="empty-state">
                        <div class="empty-icon">📚</div>
                        <h3>No tienes materias registradas</h3>
                        <p>Comienza registrando las materias que impartes</p>
                        <a href="profesor-materias.php" class="btn-primary">Registrar Materias</a>
                    </div>
                    <?php endif; ?>
                </div>

                <!-- Sección de Mis Alumnos -->
                <div class="dashboard-section">
                    <h2>👥 Mis Alumnos por Curso</h2>
                    <?php if (!empty($cursos)): ?>
                        <?php foreach ($cursos as $curso): ?>
                        <?php 
                        $stmt = $pdo->prepare("SELECT * FROM alumnos WHERE curso = ? ORDER BY apellido, nombre LIMIT 6");
                        $stmt->execute([$curso]);
                        $alumnos_curso = $stmt->fetchAll(PDO::FETCH_ASSOC);
                        
                        $stmt = $pdo->prepare("SELECT COUNT(*) FROM alumnos WHERE curso = ?");
                        $stmt->execute([$curso]);
                        $total_alumnos_curso = $stmt->fetchColumn();
                        ?>
                        <?php if (!empty($alumnos_curso)): ?>
                        <div class="alumnos-section">
                            <div class="section-header">
                                <h3>Curso <?= htmlspecialchars($curso) ?> (<?= $total_alumnos_curso ?> alumnos)</h3>
                                <a href="profesor-alumnos.php?curso=<?= $curso ?>" class="btn-link">Ver todos →</a>
                            </div>
                            <div class="alumnos-preview">
                                <?php foreach ($alumnos_curso as $alumno): ?>
                                <div class="alumno-card-mini">
                                    <div class="alumno-avatar"><?= strtoupper(substr($alumno['nombre'], 0, 1) . substr($alumno['apellido'], 0, 1)) ?></div>
                                    <div class="alumno-info">
                                        <h4><?= htmlspecialchars($alumno['nombre'] . ' ' . $alumno['apellido']) ?></h4>
                                        <p><?= htmlspecialchars($alumno['email']) ?></p>
                                    </div>
                                    <button class="btn-calificar-mini" onclick="openModal(<?= $alumno['id'] ?>, '<?= htmlspecialchars($alumno['nombre'] . ' ' . $alumno['apellido']) ?>')">
                                        📝
                                    </button>
                                </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                        <?php endif; ?>
                        <?php endforeach; ?>
                    <?php else: ?>
                    <div class="empty-state">
                        <div class="empty-icon">👥</div>
                        <h3>No tienes cursos asignados</h3>
                        <p>Registra materias para comenzar a ver tus alumnos</p>
                        <a href="profesor-materias.php" class="btn-primary">Registrar Materias</a>
                    </div>
                    <?php endif; ?>
                </div>
                <?php endif; ?>

            </div>
        </div>
    </div>

    <!-- Modal de Calificación -->
    <div id="modalCalificar" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Calificar Alumno</h2>
            <p id="alumnoNombre"></p>
            
            <form method="POST">
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
    <script>
        function openModal(alumnoId, alumnoNombre) {
            document.getElementById('modalCalificar').style.display = 'block';
            document.getElementById('alumnoId').value = alumnoId;
            document.getElementById('alumnoNombre').textContent = 'Alumno: ' + alumnoNombre;
        }
        
        function closeModal() {
            document.getElementById('modalCalificar').style.display = 'none';
        }
        
        window.onclick = function(event) {
            const modal = document.getElementById('modalCalificar');
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }

        // Navegación del sidebar
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const text = this.textContent.trim();
                
                // Remover clase active
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                // Navegar
                switch(text) {
                    case 'Resumen':
                        // No hacer nada, ya estamos en resumen
                        break;
                    case 'Mis Materias':
                        window.location.href = 'profesor-materias.php';
                        break;
                    case 'Mis Alumnos':
                        window.location.href = 'profesor-alumnos.php';
                        break;
                    case 'Asistencia':
                        alert('Sección de Asistencia - Próximamente');
                        break;
                    case 'Horarios':
                        alert('Sección de Horarios - Próximamente');
                        break;
                    case 'Mensajes':
                        alert('Sección de Mensajes - Próximamente');
                        break;
                    case 'Configuración':
                        alert('Sección de Configuración - Próximamente');
                        break;
                }
            });
        });
        
        // Búsqueda
        document.querySelector('.search-bar input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                alert('Buscando: ' + this.value);
            }
        });
        
        // Avatar de usuario
        document.querySelector('.user-avatar').addEventListener('click', function() {
            alert('Perfil de usuario - Próximamente');
        });
    </script>
</body>
</html>