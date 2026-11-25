// Smooth scrolling para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animación de números en métricas de sustentabilidad
function animateNumbers() {
    const metrics = document.querySelectorAll('.metric .number');
    
    metrics.forEach(metric => {
        const finalNumber = parseInt(metric.textContent);
        let currentNumber = 0;
        const increment = finalNumber / 50;
        
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                metric.textContent = finalNumber + '%';
                clearInterval(timer);
            } else {
                metric.textContent = Math.floor(currentNumber) + '%';
            }
        }, 30);
    });
}

// Intersection Observer para animaciones
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animar números cuando la sección de sustentabilidad es visible
            if (entry.target.id === 'sustentabilidad') {
                animateNumbers();
            }
        }
    });
}, observerOptions);

// Observar secciones para animaciones
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Simulación de datos en tiempo real para el prototipo
function simulateRealTimeData() {
    const temperatureDisplay = document.getElementById('temperature-display');
    const statusDisplay = document.getElementById('status-display');
    
    if (temperatureDisplay && statusDisplay) {
        setInterval(() => {
            const temperature = (Math.random() * 50 + 180).toFixed(1);
            const status = Math.random() > 0.8 ? 'Alerta' : 'Normal';
            
            temperatureDisplay.textContent = temperature + '°C';
            statusDisplay.textContent = status;
            statusDisplay.className = status === 'Normal' ? 'status-normal' : 'status-alert';
        }, 2000);
    }
}

// Inicializar simulación cuando se carga la página
document.addEventListener('DOMContentLoaded', simulateRealTimeData);

// Navegación activa
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Función para mostrar/ocultar detalles técnicos
function toggleTechnicalDetails(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
}

// Validación de formulario de contacto (si se agrega)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}