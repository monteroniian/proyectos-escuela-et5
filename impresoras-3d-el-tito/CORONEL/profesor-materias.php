<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'profesor') {
    header('Location: login.php');
    exit;
}

$profesor_id = $_SESSION['user_id'];

// Obtener información del profesor
$stmt = $pdo->prepare("SELECT * FROM profesores WHERE id = ?");
$stmt->execute([$profesor_id]);
$profesor = $stmt->fetch(PDO::FETCH_ASSOC);

// Procesar formulario
if ($_POST) {
    $nombre = $_POST['nombre'];
    $curso = $_POST['curso'];
    $descripcion = $_POST['descripcion'];
    
    $sql = "INSERT INTO materias (nombre, curso, profesor_id, descripcion) VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    
    if ($stmt->execute([$nombre, $curso, $profesor_id, $descripcion])) {
        $success = "Materia registrada correctamente";
    } else {
        $error = "Error al registrar la materia";
    }
}

// Obtener materias del profesor
$stmt = $pdo->prepare("SELECT * FROM materias WHERE profesor_id = ? ORDER BY curso, nombre");
$stmt->execute([$profesor_id]);
$materias = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mis Materias - LUMEN</title>
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
                <a href="profesor-materias.php" class="nav-item active">
                    <span class="nav-icon">📚</span>
                    Mis Materias
                </a>
            </nav>
        </div>

        <div class="main-content">
            <div class="header">
                <div class="header-left">
                    <h1>Mis Materias</h1>
                </div>
                <div class="header-right">
                    <span><?= htmlspecialchars($profesor['nombre'] . ' ' . $profesor['apellido']) ?></span>
                    <a href="logout.php" class="btn-logout" style="margin-left: 10px; padding: 5px 10px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px;">Salir</a>
                </div>
            </div>

            <div class="content">
                <?php if (isset($success)): ?>
                    <div class="alert success"><?= $success ?></div>
                <?php endif; ?>
                
                <?php if (isset($error)): ?>
                    <div class="alert error"><?= $error ?></div>
                <?php endif; ?>

                <!-- Estadísticas rápidas -->
                <div class="stats-mini">
                    <div class="stat-mini">
                        <span class="stat-icon">📝</span>
                        <div>
                            <div class="stat-number"><?= count($materias) ?></div>
                            <div class="stat-label">Mis Materias</div>
                        </div>
                    </div>
                    <div class="stat-mini">
                        <span class="stat-icon">📚</span>
                        <div>
                            <?php 
                            $cursos_unicos = array_unique(array_column($materias, 'curso'));
                            ?>
                            <div class="stat-number"><?= count($cursos_unicos) ?></div>
                            <div class="stat-label">Cursos</div>
                        </div>
                    </div>
                    <div class="stat-mini">
                        <span class="stat-icon">🎯</span>
                        <div>
                            <div class="stat-number">Activo</div>
                            <div class="stat-label">Estado</div>
                        </div>
                    </div>
                </div>

                <div class="content-grid">
                    <div class="form-section">
                        <h2>➕ Registrar Nueva Materia</h2>
                        <form method="POST" class="materia-form">
                            <div class="form-group">
                                <label>Curso</label>
                                <select name="curso" id="curso" required onchange="loadMaterias()">
                                    <option value="">Seleccionar curso</option>
                                    <option value="1-1">1-1 (Maestro Mayor de Obra)</option>
                                    <option value="1-2">1-2 (Programación)</option>
                                    <option value="1-3">1-3 (Informática)</option>
                                    <option value="2-1">2-1 (Maestro Mayor de Obra)</option>
                                    <option value="2-2">2-2 (Programación)</option>
                                    <option value="2-3">2-3 (Informática)</option>
                                    <option value="3-1">3-1 (Maestro Mayor de Obra)</option>
                                    <option value="3-2">3-2 (Programación)</option>
                                    <option value="3-3">3-3 (Informática)</option>
                                    <option value="4-1">4-1 (Maestro Mayor de Obra)</option>
                                    <option value="4-2">4-2 (Programación)</option>
                                    <option value="4-3">4-3 (Informática)</option>
                                    <option value="5-1">5-1 (Maestro Mayor de Obra)</option>
                                    <option value="5-2">5-2 (Programación)</option>
                                    <option value="5-3">5-3 (Informática)</option>
                                    <option value="6-1">6-1 (Maestro Mayor de Obra)</option>
                                    <option value="6-2">6-2 (Programación)</option>
                                    <option value="6-3">6-3 (Informática)</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label>Materia</label>
                                <select name="nombre" id="materia" required>
                                    <option value="">Primero selecciona un curso</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label>Descripción</label>
                                <textarea name="descripcion" rows="3" placeholder="Descripción de la materia..."></textarea>
                            </div>
                            
                            <button type="submit" class="btn-primary">Registrar Materia</button>
                        </form>
                    </div>

                    <div class="materias-list">
                        <h2>📚 Mis Materias Registradas</h2>
                        <?php if (empty($materias)): ?>
                            <div class="empty-state-small">
                                <div class="empty-icon">📝</div>
                                <h3>No tienes materias registradas</h3>
                                <p>Comienza registrando tu primera materia</p>
                            </div>
                        <?php else: ?>
                            <div class="materias-grid">
                                <?php 
                                $materias_por_curso = [];
                                foreach ($materias as $materia) {
                                    $materias_por_curso[$materia['curso']][] = $materia;
                                }
                                ?>
                                <?php foreach ($materias_por_curso as $curso => $materias_curso): ?>
                                <div class="curso-group">
                                    <h3 class="curso-title">Curso <?= htmlspecialchars($curso) ?></h3>
                                    <div class="materias-curso">
                                        <?php foreach ($materias_curso as $materia): ?>
                                        <div class="materia-card">
                                            <div class="materia-header">
                                                <h4><?= htmlspecialchars($materia['nombre']) ?></h4>
                                                <span class="materia-date"><?= date('d/m/Y', strtotime($materia['fecha_creacion'])) ?></span>
                                            </div>
                                            <p class="materia-desc"><?= htmlspecialchars($materia['descripcion'] ?: 'Sin descripción') ?></p>
                                            <div class="materia-actions">
                                                <a href="profesor-alumnos.php?curso=<?= $materia['curso'] ?>" class="btn-small">👥 Ver Alumnos</a>
                                            </div>
                                        </div>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
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
    
    .stat-mini .stat-icon {
        font-size: 24px;
    }
    
    .stat-mini .stat-number {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 4px;
        color: #1e293b;
    }
    
    .stat-mini .stat-label {
        font-size: 12px;
        color: #64748b;
    }
    
    .content-grid {
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        gap: 30px;
    }
    
    .form-section, .materias-list {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        padding: 25px;
        border-radius: 15px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    
    .form-section h2, .materias-list h2 {
        color: #1e293b;
        margin-bottom: 20px;
        font-size: 18px;
        font-weight: 600;
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
    
    .form-group input, .form-group select, .form-group textarea {
        width: 100%;
        padding: 12px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-family: 'Poppins', sans-serif;
        transition: border-color 0.3s ease;
    }
    
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
        outline: none;
        border-color: #667eea;
    }
    
    .btn-primary {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        width: 100%;
    }
    
    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
    
    .empty-state-small {
        text-align: center;
        padding: 40px 20px;
        color: #64748b;
    }
    
    .empty-state-small .empty-icon {
        font-size: 48px;
        margin-bottom: 15px;
    }
    
    .empty-state-small h3 {
        color: #1e293b;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 8px;
    }
    
    .empty-state-small p {
        font-size: 14px;
        margin: 0;
    }
    
    .materias-grid {
        display: flex;
        flex-direction: column;
        gap: 25px;
    }
    
    .curso-group {
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        overflow: hidden;
    }
    
    .curso-title {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        padding: 15px 20px;
        margin: 0;
        font-size: 16px;
        font-weight: 600;
    }
    
    .materias-curso {
        padding: 15px;
        display: grid;
        gap: 15px;
    }
    
    .materia-card {
        background: #f8fafc;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #10b981;
        transition: all 0.3s ease;
    }
    
    .materia-card:hover {
        background: white;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        transform: translateX(5px);
    }
    
    .materia-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }
    
    .materia-header h4 {
        color: #1e293b;
        font-size: 14px;
        font-weight: 600;
        margin: 0;
    }
    
    .materia-date {
        color: #64748b;
        font-size: 12px;
        background: #e2e8f0;
        padding: 2px 8px;
        border-radius: 12px;
    }
    
    .materia-desc {
        color: #64748b;
        font-size: 13px;
        margin: 0 0 10px 0;
        line-height: 1.4;
    }
    
    .materia-actions {
        display: flex;
        gap: 8px;
    }
    
    .btn-small {
        background: #667eea;
        color: white;
        padding: 6px 12px;
        text-decoration: none;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .btn-small:hover {
        background: #5a67d8;
        transform: translateY(-1px);
    }
    
    .alert {
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 20px;
    }
    
    .alert.success {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
        border: 1px solid rgba(16, 185, 129, 0.3);
    }
    
    .alert.error {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.3);
    }
    
    @media (max-width: 768px) {
        .stats-mini {
            grid-template-columns: 1fr;
        }
        
        .content-grid {
            grid-template-columns: 1fr;
        }
        
        .materia-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
        }
    }
    </style>

    <script>
    function loadMaterias() {
        const curso = document.getElementById('curso').value;
        const materiaSelect = document.getElementById('materia');
        
        materiaSelect.innerHTML = '<option value="">Seleccionar materia</option>';
        
        if (!curso) return;
        
        const año = parseInt(curso.split('-')[0]);
        const division = curso.split('-')[1];
        
        let materias = [
            'Lengua y Literatura',
            'Matemáticas',
            'Historia',
            'Geografía',
            'Ciencias Naturales',
            'Educación Física',
            'Inglés'
        ];
        
        // Materias específicas según la división
        if (division === '1') { // Maestro Mayor de Obra
            materias = materias.concat([
                'Construcciones',
                'Dibujo Técnico',
                'Materiales de Construcción'
            ]);
            if (año >= 4) {
                materias = materias.concat([
                    'Estructuras',
                    'Instalaciones',
                    'Proyecto de Obra',
                    'Costos y Presupuestos'
                ]);
            }
        } else if (division === '2') { // Programación
            materias = materias.concat([
                'Programación I',
                'Algoritmos',
                'Base de Datos'
            ]);
            if (año >= 4) {
                materias = materias.concat([
                    'Desarrollo Web',
                    'Sistemas Operativos',
                    'Programación Avanzada',
                    'Desarrollo de Aplicaciones'
                ]);
            }
        } else if (division === '3') { // Informática
            materias = materias.concat([
                'Informática Aplicada',
                'Redes y Comunicaciones',
                'Hardware'
            ]);
            if (año >= 4) {
                materias = materias.concat([
                    'Software de Aplicación',
                    'Seguridad Informática',
                    'Administración de Sistemas',
                    'Soporte Técnico'
                ]);
            }
        }
        
        materias.forEach(materia => {
            const option = document.createElement('option');
            option.value = materia;
            option.textContent = materia;
            materiaSelect.appendChild(option);
        });
    }
    </script>
</body>
</html>