class JuegoVideoIA {
    constructor() {
        this.puntuacion = 0;
        this.vidas = 3;
        this.videosDatabase = [];
        this.videoActual = null;
        this.videosUsados = [];
        this.videoIndex = 0;
        
        this.inicializar();
    }
    
    async inicializar() {
        await this.cargarConfiguracionVideos();
        this.configurarEventos();
        this.iniciarJuego();
    }
    
    async cargarConfiguracionVideos() {
        this.videosDatabase = [
            {"archivo": "ia.2.mp4", "es_ia": true},
            {"archivo": "real.1.mp4", "es_ia": false},
            {"archivo": "Ia.1.mp4", "es_ia": true},
            {"archivo": "real.4.mp4", "es_ia": false},
            {"archivo": "real.5.mp4", "es_ia": false},
            {"archivo": "ia.4.mp4", "es_ia": true},
            {"archivo": "ia.3.mp4", "es_ia": true},
            {"archivo": "real.3.mp4", "es_ia": false},
            {"archivo": "real.2.mp4", "es_ia": false},
            {"archivo": "ia.5.mp4", "es_ia": true}
        ];
    }
    
    configurarEventos() {
        document.getElementById('btnPlay').addEventListener('click', () => this.reproducirVideo());
        document.getElementById('btnPause').addEventListener('click', () => this.pausarVideo());
        document.getElementById('btnRestart').addEventListener('click', () => this.reiniciarVideo());
        document.getElementById('btnReal').addEventListener('click', () => this.responder(false));
        document.getElementById('btnIA').addEventListener('click', () => this.responder(true));
        document.getElementById('modalClose').addEventListener('click', () => this.cerrarModal());
    }
    
    iniciarJuego() {
        this.videosUsados = [];
        this.videoIndex = 0;
        this.siguienteVideo();
        this.actualizarInterfaz();
    }
    
    cargarVideo() {
        const videoPlayer = document.getElementById('videoPlayer');
        videoPlayer.src = this.videoActual.archivo;
        videoPlayer.load();
        
        videoPlayer.onerror = () => {
            console.log('Error cargando:', this.videoActual.archivo);
            this.siguienteVideo();
        };
    }
    
    reproducirVideo() {
        const videoPlayer = document.getElementById('videoPlayer');
        videoPlayer.play();
    }
    
    pausarVideo() {
        const videoPlayer = document.getElementById('videoPlayer');
        videoPlayer.pause();
    }
    
    reiniciarVideo() {
        const videoPlayer = document.getElementById('videoPlayer');
        videoPlayer.currentTime = 0;
    }
    
    responder(respuestaIA) {
        this.pausarVideo();
        
        const esCorrecto = respuestaIA === this.videoActual.es_ia;
        
        if (esCorrecto) {
            this.puntuacion += 10;
            this.mostrarModal('¡CORRECTO! 🎉', `¡Excelente! Has ganado 10 puntos`);
        } else {
            this.vidas--;
            const respuestaCorrecta = this.videoActual.es_ia ? 'generado por IA' : 'REAL';
            this.mostrarModal('Incorrecto ❌', `El video era ${respuestaCorrecta}.\n\nPierdes 1 vida.`);
        }
        
        setTimeout(() => {
            this.cerrarModal();
            this.continuarJuego();
        }, esCorrecto ? 1500 : 2500);
        
        this.actualizarInterfaz();
    }
    
    continuarJuego() {
        if (this.vidas <= 0) {
            this.gameOver();
            return;
        }
        
        if (this.puntuacion >= 100) {
            this.juegoGanado();
            return;
        }
        
        if (this.videoIndex >= 10) {
            this.juegoCompletado();
            return;
        }
        
        this.siguienteVideo();
    }
    
    siguienteVideo() {
        if (this.videoIndex >= this.videosDatabase.length) {
            this.juegoCompletado();
            return;
        }
        
        this.videoActual = this.videosDatabase[this.videoIndex];
        this.videoIndex++;
        
        this.cargarVideo();
        this.actualizarInterfaz();
    }
    
    juegoGanado() {
        this.mostrarModal('¡GANASTE! 🎆', `¡Has conseguido 100 puntos!\n¡Felicidades!`);
        setTimeout(() => {
            this.cerrarModal();
            this.reiniciarJuego();
        }, 3000);
    }
    
    juegoCompletado() {
        this.mostrarModal('Juego Terminado', `Has visto todos los videos.\nPuntuación final: ${this.puntuacion} / 100 puntos`);
        setTimeout(() => {
            this.cerrarModal();
            this.reiniciarJuego();
        }, 3000);
    }
    
    gameOver() {
        this.mostrarModal('Game Over 💀', `Puntuación final: ${this.puntuacion} puntos`);
        setTimeout(() => {
            this.cerrarModal();
            this.reiniciarJuego();
        }, 3000);
    }
    
    reiniciarJuego() {
        this.puntuacion = 0;
        this.vidas = 3;
        this.iniciarJuego();
    }
    
    actualizarInterfaz() {
        document.getElementById('videoActual').textContent = this.videoIndex;
        document.getElementById('puntuacion').textContent = this.puntuacion;
        document.getElementById('vidas').textContent = this.vidas;
    }
    
    mostrarModal(titulo, mensaje) {
        document.getElementById('modalTitle').textContent = titulo;
        document.getElementById('modalMessage').textContent = mensaje;
        document.getElementById('modal').style.display = 'block';
    }
    
    cerrarModal() {
        document.getElementById('modal').style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new JuegoVideoIA();
});