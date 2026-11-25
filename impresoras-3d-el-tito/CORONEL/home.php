<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lumen Academia Educativa</title>
    <link rel="stylesheet" href="Lumenhome.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>
    <header class="main-header">
        <div class="logo-container">
            <a href="home.php" class="logo-link">
                <img src="WhatsApp Image 2025-09-02 at 3.45.39 PM.jpeg" alt="logo" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
                <div class="logo">
                    <h1>Lumen Academia Educativa</h1>
                </div>
            </a>
        </div>
        
        <nav class="main-nav">
            <ul>
                <li><a href="login.php">Iniciar sesión</a></li>
                <li><a href="registro.php">¿Alumno nuevo?</a></li>
                <li><a href="registro_profesor.php">Registrar Profesor</a></li>
                <li><a href="registro_admin.php">Crear Admin</a></li>
                <li><a href="#programas">Programas</a></li>
                <li><a href="#contacto">Contacto</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="inicio" class="hero">
            <div class="hero-text">
                <h2>Bienvenido a nuestra institución</h2>
                <p>Formamos líderes del futuro con una educación de calidad.</p>
                <a href="login.php" class="btn">Iniciar sesión</a>
            </div>
        </section>

        <section id="nosotros" class="about-us">
            <h2>Sobre Nosotros</h2>
            <p>Somos una institución con más de 20 años de experiencia, comprometida con la excelencia académica y el desarrollo integral de nuestros estudiantes.</p>
        </section>

        <section id="programas" class="programs">
            <h2>Nuestros Programas</h2>
            <div class="programs-grid">
                <div class="program-card">
                    <h3>Programación</h3>
                    <p>Desarrollo de software, algoritmos y aplicaciones web y móviles.</p>
                </div>
                <div class="program-card">
                    <h3>Informática</h3>
                    <p>Tratamiento automático de información mediante dispositivos electrónicos.</p>
                </div>
                <div class="program-card">
                    <h3>Maestro Mayor de Obra</h3>
                    <p>Ejecución, supervisión y coordinación de proyectos de construcción.</p>
                </div>
            </div>
        </section>

        <section id="contacto" class="contact">
            <h2>Contacto</h2>
            <p>Calle 316 1869, 1886 Ranelagh | Tel: 011 4258-4354</p>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 Lumen Academia Educativa. Todos los derechos reservados.</p>
    </footer>

    <style>
    .program-card {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        padding: 25px;
        border-radius: 15px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        text-align: center;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .program-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    }
    .program-card h3 {
        color: #333;
        font-weight: 600;
        margin-bottom: 15px;
    }
    .program-card p {
        color: #666;
        line-height: 1.6;
    }
    .programs-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 25px;
        margin-top: 30px;
    }
    .logo-link {
        display: flex;
        align-items: center;
        gap: 15px;
        text-decoration: none;
        color: inherit;
    }
    .logo-link:hover {
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }
    .btn {
        position: relative;
        overflow: hidden;
        z-index: 1;
    }
    .btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 100%;
        background: linear-gradient(45deg, #667eea, #764ba2);
        transition: width 0.3s ease;
        z-index: -1;
    }
    .btn:hover::before {
        width: 100%;
    }
    </style>
</body>
</html>