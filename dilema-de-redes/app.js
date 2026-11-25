/**
 * INSTAGRAM CLONE + SISTEMA DE NIVEL POR LIKES (DILEMA DE REDES)
 * Todo el contenido del proyecto (Temas 1 a 5, testimonios de Ian, Selena, Jesús y Joaquín)
 * está estructurado como publicaciones de scroll continuo en el feed.
 * 
 * Reglas: 
 * - 1 Like = +25 XP (una sola vez por post)
 * - 1 Compartir = +30 XP (una sola vez por post)
 * - Nivel 10 = Despliega el Manifiesto de Concientización y Responsabilidad Digital.
 */

// ==========================================================================
// 1. NIVELES DE GAMIFICACIÓN CALIBRADOS
// ==========================================================================

const LEVEL_RANKS = [
  { level: 1, title: "Scroller Casual", xpNeeded: 50, reward: "Iniciando el recorrido por el feed del dilema." },
  { level: 2, title: "Enganchado al Feed", xpNeeded: 75, reward: "Comprendiendo el refuerzo intermitente." },
  { level: 3, title: "Buscador de Dopamina", xpNeeded: 100, reward: "Análisis del diseño persuasivo y el slot-machine." },
  { level: 4, title: "Cazador de Validación", xpNeeded: 125, reward: "Identificación de la trampa social de likes." },
  { level: 5, title: "Consciencia del Algoritmo", xpNeeded: 150, reward: "Entendiendo el Capitalismo de Vigilancia." },
  { level: 6, title: "Detector de Fake News", xpNeeded: 175, reward: "Descifrando la velocidad viral de la indignación (x6)." },
  { level: 7, title: "Crítico de la Manipulación", xpNeeded: 200, reward: "Protegiendo la salud mental frente a la dismorfia." },
  { level: 8, title: "Practicante de Higiene Digital", xpNeeded: 225, reward: "Notificaciones desactivadas con éxito." },
  { level: 9, title: "Mente Desconectada", xpNeeded: 250, reward: "Superando la economía de la atención." },
  { level: 10, title: "Mente Libre", xpNeeded: 300, reward: "✨ Mensaje Motivacional: Vive Despierto." }
];

/// Historias interactivas superiores centradas en los referentes del film
const INITIAL_STORIES = [
  { 
    id: 's_tristan', 
    user: 'tristan_harris', 
    role: 'Ex-Google / Center for Humane Tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&auto=format&fit=crop&q=85', 
    caption: 'Tristan Harris: "Una bicicleta no te exige atención. Las redes compiten directamente contra las debilidades evolutivas de tu cerebro."' 
  },
  { 
    id: 's_shoshana', 
    user: 'shoshana_zuboff', 
    role: 'Harvard Business School',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=900&auto=format&fit=crop&q=85', 
    caption: 'Shoshana Zuboff: "Es un mercado que nunca antes había existido en la historia humana: comercia exclusivamente con futuros conductuales humanos."' 
  },
  { 
    id: 's_jaron', 
    user: 'jaron_lanier', 
    role: 'Pionero de Realidad Virtual',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', 
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=85', 
    caption: 'Jaron Lanier: "El producto es el cambio gradual, ligero e imperceptible en tu propia conducta y en tu propia percepción."' 
  },
  { 
    id: 's_haidt', 
    user: 'jonathan_haidt', 
    role: 'Psicólogo Social NYU',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=85', 
    caption: 'Jonathan Haidt: "Toda una generación creció con un chupete digital que nunca les enseñó a lidiar con el conflicto o la soledad."' 
  },
  { 
    id: 's_mit', 
    user: 'mit_research_lab', 
    role: 'Investigación MIT (2018)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', 
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=85', 
    caption: 'Estudio del MIT: Las noticias falsas se propagan en redes sociales 6 veces más rápido que las verdaderas.' 
  }
];

// ==========================================================================
// 2. PUBLICACIONES DE SCROLLEO (EL DILEMA Y FAKE NEWS VIRALES)
// ==========================================================================

const ALL_SCROLL_POSTS = [
  // POST 1: PUBLICIDAD SOSPECHOSAMENTE EXACTA
  {
    id: 'post-algoritmo-publicidad',
    user: 'lucas_martinez',
    verified: false,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    time: 'hace 25 min',
    location: 'Buenos Aires, Argentina',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1000&auto=format&fit=crop&q=85',
    filter: 'filter-cyberpunk',
    sticker: 'CASUALIDADES DE LA RED',
    likesCount: 6420,
    caption: 'Ayer hablé con un amigo sobre comprarme unas zapatillas de trekking. Nunca lo busqué en Google, solo lo dije en voz alta en la cocina con el celular sobre la mesa. Abro Instagram hoy y la primera publicidad que me sale es exactamente de zapatillas de trekking con descuento. No me digan que es coincidencia.',
    hashtags: ['#Algoritmo', '#Publicidad', '#Casualidad', '#Instagram', '#Paranoia'],
    comments: [
      { user: 'martin_g', text: 'Me pasa exactamente lo mismo cada semana' },
      { user: 'camila.s', text: 'Ya ni disimulan que nos escuchan' }
    ],
    isLiked: false,
    hasGivenLikeXP: false,
    hasGivenShareXP: false,
    isSaved: false
  },

  // POST 2: MEME DEL MICRO ESCOLAR (Captura.PNG)
  {
    id: 'post-meme-micro',
    user: 'memes_del_dia',
    verified: false,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    time: 'hace 40 min',
    location: 'En camino a la escuela',
    image: 'Captura.PNG',
    filter: 'filter-normal',
    sticker: 'MEME',
    likesCount: 15420,
    caption: 'Literalmente la vibra de subirse al micro a las 7 de la mañana. Todos en silencio absoluto con el brillo al máximo mirando videos de 5 segundos sin saludarse. El nuevo en el asiento del fondo solo intentando sobrevivir al viaje.',
    hashtags: ['#Meme', '#Colegio', '#Lunes', '#Vibes', '#Humor'],
    comments: [
      { user: 'joaquin_o', text: 'Real que nadie habla en todo el camino' },
      { user: 'ian_m', text: 'El brillo al 100% te deja ciego a esa hora' }
    ],
    isLiked: false,
    hasGivenLikeXP: false,
    hasGivenShareXP: false,
    isSaved: false
  },

  // POST 3: VIRAL FAKE CON IA (s.PNG)
  {
    id: 'post-viral-famosos',
    user: 'tendencias_virales',
    verified: false,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    time: 'hace 1 h',
    location: 'Tendencias de Hoy',
    image: 's.PNG',
    filter: 'filter-normal',
    sticker: 'VIRAL EN REDES',
    likesCount: 24280,
    caption: 'Mi tía en el grupo de WhatsApp de la familia mandó esto diciendo: "Miren qué humildes, todos iban a la misma escuela en México". No sé si reírme o preocuparme de la cantidad de gente que en los comentarios se creyó que esta foto era real.',
    hashtags: ['#Viral', '#FotoDelDia', '#Tendencia', '#Internet', '#Humor'],
    comments: [
      { user: 'sofi_rodriguez', text: 'Mi mamá casi se lo cree también jaja' },
      { user: 'mateo_p', text: 'La inteligencia artificial ya está fuera de control' }
    ],
    isLiked: false,
    hasGivenLikeXP: false,
    hasGivenShareXP: false,
    isSaved: false
  },

  // POST 4: MEME DEL BICHO (Bicho.png)
  {
    id: 'post-meme-bicho',
    user: 'humor_nocturno',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    time: 'hace 1 h 20 min',
    location: 'El sillón a la noche',
    image: 'Bicho.png',
    filter: 'filter-normal',
    sticker: 'REFLEXIÓN NOCTURNA',
    likesCount: 32400,
    caption: 'Tardas 40 minutos scrolleando y buscando qué video mirar mientras se te enfría la comida. Cuando finalmente elegís uno, ya terminaste de comer. Todos los días la misma historia con las recomendaciones del feed.',
    hashtags: ['#ElBicho', '#Meme', '#ComidaFria', '#Relatable', '#Humor'],
    comments: [
      { user: 'franco_b', text: 'Lo de la comida que se enfría es demasiado real' },
      { user: 'lautaro_v', text: 'Terminas mirando cualquier cosa al final' }
    ],
    isLiked: false,
    hasGivenLikeXP: false,
    hasGivenShareXP: false,
    isSaved: false
  },

  // POST 5: LA TRAMPA DE LAS 3 AM (Pantalla en la oscuridad)
  {
    id: 'post-insomnio-madrugada',
    user: 'insomnio_digital',
    verified: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    time: 'hace 2 h',
    location: 'En la cama a oscuras',
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=1000&auto=format&fit=crop&q=85',
    filter: 'filter-clarendon',
    sticker: '3:45 AM',
    likesCount: 16520,
    caption: 'Eran las 11:30 PM y me dije: "Miro dos publicaciones y me duermo". Parpadeé dos veces y ya son las 3:45 AM y estoy viendo cómo una persona en el sudeste asiático construye un castillo con barro y ramas. Mañana tengo que madrugar y no sé cómo llegué a este rincón de internet.',
    hashtags: ['#Insomnio', '#BuenasNoches', '#ScrollInfinito', '#Madrugada', '#F'],
    comments: [
      { user: 'agus_fernandez', text: 'El algoritmo sabe exactamente qué video ponerte cuando te estás por dormir' },
      { user: 'valen_g', text: 'Me pasa todas las noches sin falta' }
    ],
    isLiked: false,
    hasGivenLikeXP: false,
    hasGivenShareXP: false,
    isSaved: false
  },

  // POST 6: MEME DAME DA NE (image.png)
  {
    id: 'post-meme-damedane',
    user: 'shitposting_random',
    verified: false,
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    time: 'hace 2 h 30 min',
    location: 'Para Ti / Explorar',
    image: 'image.png',
    filter: 'filter-normal',
    sticker: 'MEME RANDOM',
    likesCount: 18900,
    caption: 'Cuando el feed decide que este es el video más importante que necesitas ver en este momento exacto de tu vida. No pedí esto, pero tampoco puedo dejar de mirarlo.',
    hashtags: ['#DameDaNe', '#Meme', '#Random', '#Shitpost', '#Internet'],
    comments: [
      { user: 'tomi_k', text: 'Arte puro de internet' },
      { user: 'nico_r', text: 'Imposible no quedarse mirándolo' }
    ],
    isLiked: false,
    hasGivenLikeXP: false,
    hasGivenShareXP: false,
    isSaved: false
  },

  // POST 7: MEME DEL CLON (meme.png)
  {
    id: 'post-meme-clon',
    user: 'crisis_existencial_meme',
    verified: false,
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    time: 'hace 3 h',
    location: 'Mi cerebro scrolleando',
    image: 'meme.png',
    filter: 'filter-normal',
    sticker: 'SITUACIÓN REAL',
    likesCount: 20100,
    caption: 'Cuando te das cuenta de que el algoritmo te conoce mejor que tus propios amigos. Te recomienda exactamente lo que pensabas hace media hora y te quedas mirando la pantalla preguntándote si sos vos o sos un clon digital creado por las redes.',
    hashtags: ['#Meme', '#Clon', '#Real', '#Algoritmo', '#Pensamientos'],
    comments: [
      { user: 'esteban_m', text: 'Me asusta lo preciso que se volvió' },
      { user: 'flor_c', text: 'Totalmente identificada' }
    ],
    isLiked: false,
    hasGivenLikeXP: false,
    hasGivenShareXP: false,
    isSaved: false
  },

  // POST 8: CADENA DE NOTICIAS DE FAMILIA
  {
    id: 'post-cadena-noticias',
    user: 'noticias_o_bulo',
    verified: false,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    time: 'hace 3 h 30 min',
    location: 'Grupo de WhatsApp Familiar',
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop&q=85',
    filter: 'filter-dramatic-bw',
    sticker: 'CADENA FAMILIAR',
    likesCount: 11800,
    caption: 'Llegó al grupo de la familia una noticia con un título gigante en mayúsculas asegurando que WhatsApp se va a volver de pago mañana a menos que reenvíes el mensaje a 20 contactos. Lo peor es que tres personas ya lo reenviaron "por las dudas".',
    hashtags: ['#GrupoFamiliar', '#Cadenas', '#WhatsApp', '#Noticias', '#Familia'],
    comments: [
      { user: 'marcos_d', text: 'El clásico "por las dudas lo mando"' },
      { user: 'belen_a', text: 'Pasa en todas las familias jaja' }
    ],
    isLiked: false,
    hasGivenLikeXP: false,
    hasGivenShareXP: false,
    isSaved: false
  },

  // POST 9: EXPECTATIVA VS REALIDAD
  {
    id: 'post-expectativa-realidad',
    user: 'reflexiones_cotidianas',
    verified: false,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    time: 'hace 4 h',
    location: 'Filtros vs Realidad',
    image: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?w=1000&auto=format&fit=crop&q=85',
    filter: 'filter-dramatic-bw',
    sticker: 'MUNDO REAL',
    likesCount: 14890,
    caption: 'A veces hace bien acordarse de que lo que vemos acá son solo los mejores 10 segundos del día de alguien, con la mejor luz y el filtro justo. Compararse con vidas editadas de personas que ni conocemos no tiene ningún sentido.',
    hashtags: ['#SinFiltro', '#Realidad', '#Autoestima', '#SaludMental', '#PensamientoDelDia'],
    comments: [
      { user: 'paula_m', text: 'Hacía falta leer esto hoy' },
      { user: 'julian_t', text: 'Gran verdad, nadie sube sus días malos' }
    ],
    isLiked: false,
    hasGivenLikeXP: false,
    hasGivenShareXP: false,
    isSaved: false
  },

  // POST 10: DESCONEXIÓN Y VIDA REAL
  {
    id: 'post-desconexion-tarde',
    user: 'vida_offline',
    verified: false,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    time: 'hace 5 h',
    location: 'Parque de la Ciudad',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1000&auto=format&fit=crop&q=85',
    filter: 'filter-valencia',
    sticker: 'DESCONEXIÓN',
    likesCount: 17920,
    caption: 'Dejé el teléfono en silencio adentro de la mochila por tres horas para tomar unos mates al aire libre y caminar un rato. Increíble cómo baja el ritmo de la cabeza cuando no estás recibiendo un estímulo cada 15 segundos.',
    hashtags: ['#Desconectar', '#AireLibre', '#Tranquilidad', '#Mates', '#Offline'],
    comments: [
      { user: 'lucia_p', text: 'El mejor plan que existe' },
      { user: 'diego_s', text: 'Deberíamos hacerlo mucho más seguido' }
    ],
    isLiked: false,
    hasGivenLikeXP: false,
    hasGivenShareXP: false,
    isSaved: false
  }
];

// Expertos sugeridos en sidebar
const SUGGESTED_EXPERTS = [
  { username: 'tristan_harris', relation: 'Ex-diseñador ético de Google', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { username: 'shoshana_zuboff', relation: 'Autora "Capitalismo de Vigilancia"', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' },
  { username: 'jaron_lanier', relation: 'Pionero de Realidad Virtual', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' },
  { username: 'jonathan_haidt', relation: 'Psicólogo social NYU', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' }
];

// Estado de la Aplicación
let appState = {
  currentLevel: 1,
  currentXP: 0,
  targetXP: 50,
  totalLikesGiven: 0,
  soundEnabled: true,
  posts: [],
  comboCount: 0,
  comboTimer: null,
  activeFilter: 'filter-normal',
  activeSticker: 'none',
  selectedImageSrc: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&auto=format&fit=crop&q=85',
  isLoadingMore: false,
  activeStoryInterval: null
};

// ==========================================================================
// 3. PERSISTENCIA & CARGA DE DATOS
// ==========================================================================

function loadPersistedState() {
  try {
    const savedLevel = localStorage.getItem('insta_scroll_level_data_v15');
    if (savedLevel) {
      const parsed = JSON.parse(savedLevel);
      appState.currentLevel = parsed.currentLevel || 1;
      appState.currentXP = parsed.currentXP || 0;
      appState.totalLikesGiven = parsed.totalLikesGiven || 0;
      appState.soundEnabled = parsed.soundEnabled !== undefined ? parsed.soundEnabled : true;
    }

    const savedPosts = localStorage.getItem('insta_scroll_posts_v15');
    if (savedPosts) {
      appState.posts = JSON.parse(savedPosts);
    } else {
      appState.posts = JSON.parse(JSON.stringify(ALL_SCROLL_POSTS));
    }
  } catch (err) {
    console.warn("Error cargando localStorage:", err);
    appState.posts = JSON.parse(JSON.stringify(ALL_SCROLL_POSTS));
  }

  const rankInfo = LEVEL_RANKS.find(r => r.level === appState.currentLevel) || LEVEL_RANKS[0];
  appState.targetXP = rankInfo.xpNeeded;
}

function saveState() {
  try {
    localStorage.setItem('insta_scroll_level_data_v15', JSON.stringify({
      currentLevel: appState.currentLevel,
      currentXP: appState.currentXP,
      totalLikesGiven: appState.totalLikesGiven,
      soundEnabled: appState.soundEnabled
    }));
    localStorage.setItem('insta_scroll_posts_v15', JSON.stringify(appState.posts));
  } catch (err) {
    console.warn("Error guardando en localStorage:", err);
  }
}

// ==========================================================================
// 4. SISTEMA DE AUDIO (Web Audio API)
// ==========================================================================

class AudioFxEngine {
  constructor() {
    this.ctx = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playLikePop() {
    if (!appState.soundEnabled) return;
    try {
      this.initContext();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(460, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(920, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }

  playShareChime() {
    if (!appState.soundEnabled) return;
    try {
      this.initContext();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1046.50, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch (e) {}
  }

  playLevelUpFanfare() {
    if (!appState.soundEnabled) return;
    try {
      this.initContext();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.4);
      });
    } catch (e) {}
  }

  playLevel10Chime() {
    if (!appState.soundEnabled) return;
    try {
      this.initContext();
      // Acorde cinematográfico profundo y reflexivo (C maj9)
      const chord = [261.63, 329.63, 392.00, 493.88, 587.33, 1046.50];
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.09 + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.09);
        osc.stop(this.ctx.currentTime + idx * 0.09 + 0.85);
      });
    } catch (e) {}
  }

  playPostSuccess() {
    if (!appState.soundEnabled) return;
    try {
      this.initContext();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }
}

const audioFX = new AudioFxEngine();

// ==========================================================================
// 5. SISTEMA DE GAMIFICACIÓN & BARRA DE NIVEL
// ==========================================================================

function updateLevelUI() {
  const rankInfo = LEVEL_RANKS.find(r => r.level === appState.currentLevel) || LEVEL_RANKS[LEVEL_RANKS.length - 1];
  const percentage = Math.min(100, Math.round((appState.currentXP / appState.targetXP) * 100));

  // HUD superior
  const hudLevelNum = document.getElementById('hud-level-number');
  const hudLevelTitle = document.getElementById('hud-level-title');
  const hudXpCurrent = document.getElementById('hud-xp-current');
  const hudXpTarget = document.getElementById('hud-xp-target');
  const progressFill = document.getElementById('progress-fill');

  if (hudLevelNum) hudLevelNum.textContent = `Nivel ${appState.currentLevel}`;
  if (hudLevelTitle) hudLevelTitle.textContent = rankInfo.title;
  if (hudXpCurrent) hudXpCurrent.textContent = appState.currentXP;
  if (hudXpTarget) hudXpTarget.textContent = appState.targetXP;
  if (progressFill) progressFill.style.width = `${percentage}%`;

  // Mini tarjeta lateral
  const sidebarBadge = document.getElementById('sidebar-level-badge');
  const sidebarTitle = document.getElementById('sidebar-level-title');
  const sidebarFill = document.getElementById('sidebar-progress-fill');
  const sidebarXp = document.getElementById('sidebar-xp-text');

  if (sidebarBadge) sidebarBadge.textContent = `LVL ${appState.currentLevel}`;
  if (sidebarTitle) sidebarTitle.textContent = rankInfo.title;
  if (sidebarFill) sidebarFill.style.width = `${percentage}%`;
  if (sidebarXp) sidebarXp.textContent = `${appState.currentXP} / ${appState.targetXP} XP`;

  saveState();
}

/**
 * Añadir XP (Regla: solo 1 vez por Like y 1 vez por Compartir en cada publicación)
 */
function addXP(amount = 25, eventCoordinates = null) {
  appState.comboCount++;
  clearTimeout(appState.comboTimer);

  let multiplier = 1.0;
  if (appState.comboCount >= 6) multiplier = 2.5;
  else if (appState.comboCount >= 4) multiplier = 2.0;
  else if (appState.comboCount >= 2) multiplier = 1.5;

  const comboBadge = document.getElementById('combo-badge');
  const comboMultiplier = document.getElementById('combo-multiplier');
  if (comboBadge && comboMultiplier) {
    if (multiplier > 1.0) {
      comboMultiplier.textContent = `x${multiplier}`;
      comboBadge.classList.remove('hidden');
    }
  }

  appState.comboTimer = setTimeout(() => {
    appState.comboCount = 0;
    if (comboBadge) comboBadge.classList.add('hidden');
  }, 2800);

  const earnedXP = Math.round(amount * multiplier);
  appState.currentXP += earnedXP;

  if (eventCoordinates) {
    spawnFloatingXP(earnedXP, eventCoordinates.x, eventCoordinates.y);
  }

  if (appState.currentXP >= appState.targetXP) {
    handleLevelUp();
  } else {
    updateLevelUI();
  }
}

function handleLevelUp() {
  const maxLevel = LEVEL_RANKS.length; // 10
  if (appState.currentLevel < maxLevel) {
    appState.currentXP = appState.currentXP - appState.targetXP;
    appState.currentLevel++;
    
    const nextRank = LEVEL_RANKS.find(r => r.level === appState.currentLevel) || LEVEL_RANKS[LEVEL_RANKS.length - 1];
    appState.targetXP = nextRank.xpNeeded;

    updateLevelUI();

    // Comprobar si alcanzó el Nivel 10
    if (appState.currentLevel === 10) {
      showLevel10AwarenessModal();
    } else {
      showLevelUpModal(nextRank);
    }
  } else {
    appState.currentXP = appState.targetXP;
    updateLevelUI();
    showLevel10AwarenessModal();
  }
}

function showLevelUpModal(rankInfo) {
  audioFX.playLevelUpFanfare();
  triggerConfetti('confetti-canvas');

  const modal = document.getElementById('levelup-modal');
  const badge = document.getElementById('levelup-badge-display');
  const rankDisplay = document.getElementById('levelup-rank-display');
  const rewardDisplay = document.getElementById('levelup-reward-text');

  if (badge) badge.textContent = `LVL ${appState.currentLevel}`;
  if (rankDisplay) rankDisplay.textContent = rankInfo.title;
  if (rewardDisplay) rewardDisplay.textContent = rankInfo.reward;

  if (modal) modal.classList.remove('hidden');
}

// ==========================================================================
// 6. MODAL DE NIVEL 10: CONCIENTIZACIÓN Y RESPONSABILIDAD
// ==========================================================================

function showLevel10AwarenessModal() {
  audioFX.playLevel10Chime();
  triggerConfetti('confetti-canvas-lvl10', ['#10b981', '#f59e0b', '#06b6d4', '#ffffff', '#3b82f6']);

  const modal = document.getElementById('level10-modal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function spawnFloatingXP(amount, x, y) {
  const el = document.createElement('div');
  el.className = 'floating-xp';
  el.textContent = `+${amount} XP`;
  el.style.left = `${Math.min(window.innerWidth - 110, Math.max(20, x))}px`;
  el.style.top = `${y}px`;
  document.body.appendChild(el);

  setTimeout(() => {
    el.remove();
  }, 1100);
}

function triggerConfetti(canvasId = 'confetti-canvas', customColors = null) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = customColors || ['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888', '#0095f6', '#4ade80', '#ffd700'];

  for (let i = 0; i < 95; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      r: Math.random() * 6 + 4,
      d: Math.random() * 80 + 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 10,
      tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
      tiltAngle: 0,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.5) * 14 - 3
    });
  }

  let animationFrame;
  let life = 0;

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    life++;

    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.tiltAngle += p.tiltAngleIncremental;
      p.tilt = Math.sin(p.tiltAngle) * 12;

      ctx.beginPath();
      ctx.lineWidth = p.r / 2;
      ctx.strokeStyle = p.color;
      ctx.fillStyle = p.color;
      ctx.moveTo(p.x + p.tilt + (p.r / 4), p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + (p.r / 4));
      ctx.stroke();
    });

    if (life < 140) {
      animationFrame = requestAnimationFrame(update);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  update();
}

// ==========================================================================
// 7. RENDERIZADO DEL FEED DE SCROLLEO & INTERACCIONES
// ==========================================================================

function renderStories() {
  const container = document.getElementById('stories-list');
  if (!container) return;

  container.innerHTML = INITIAL_STORIES.map(s => `
    <div class="story-item" data-story-id="${s.id}">
      <div class="story-avatar-wrap">
        <img src="${s.avatar}" alt="${s.user}">
      </div>
      <span class="story-username">${s.user}</span>
    </div>
  `).join('');

  container.querySelectorAll('.story-item').forEach(item => {
    item.addEventListener('click', () => {
      const storyId = item.getAttribute('data-story-id');
      const story = INITIAL_STORIES.find(st => st.id === storyId);
      if (story) openStoryModal(story, item);
    });
  });
}

function renderSuggestions() {
  const container = document.getElementById('suggestions-list');
  if (!container) return;

  container.innerHTML = SUGGESTED_EXPERTS.map(u => `
    <div class="suggest-user-item">
      <div class="suggest-user-info">
        <img src="${u.avatar}" alt="${u.username}" class="suggest-avatar">
        <div class="suggest-names">
          <span class="suggest-user-nick">${u.username}</span>
          <span class="suggest-relation">${u.relation}</span>
        </div>
      </div>
      <button class="btn-follow" onclick="handleFollowToggle(this)">Seguir</button>
    </div>
  `).join('');
}

window.handleFollowToggle = function(btn) {
  if (btn.classList.contains('following')) {
    btn.classList.remove('following');
    btn.textContent = 'Seguir';
  } else {
    btn.classList.add('following');
    btn.textContent = 'Siguiendo';
    addXP(10);
    showToast("Siguiendo a referente del documental (+10 XP)");
  }
};

function renderFeed(prepend = false) {
  const container = document.getElementById('posts-feed');
  if (!container) return;

  if (!prepend) {
    container.innerHTML = '';
  }

  const postsToRender = prepend ? [appState.posts[0]] : appState.posts;

  postsToRender.forEach(post => {
    const postEl = createPostElement(post);
    if (prepend) {
      container.insertBefore(postEl, container.firstChild);
    } else {
      container.appendChild(postEl);
    }
  });
}

function createPostElement(post) {
  const article = document.createElement('article');
  article.className = 'post-card';
  article.id = post.id;

  const verifiedSvg = post.verified ? `
    <svg class="verified-badge" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ` : '';

  const stickerHtml = post.sticker && post.sticker !== 'none' ? `
    <div class="post-sticker-badge">${post.sticker}</div>
  ` : '';

  const hashtagsHtml = post.hashtags && post.hashtags.length > 0 ? `
    <div class="post-hashtags">
      ${post.hashtags.map(tag => `<span>${tag}</span>`).join(' ')}
    </div>
  ` : '';

  const commentsHtml = post.comments && post.comments.length > 0 ? `
    <div class="comments-preview-list">
      ${post.comments.map(c => `
        <div class="single-comment">
          <span class="comment-author">${c.user}</span>
          <span class="comment-text">${escapeHTML(c.text)}</span>
        </div>
      `).join('')}
    </div>
  ` : '';

  const formattedCaption = escapeHTML(post.caption).replace(/\n/g, '<br>');

  const xpIndicator = (post.hasGivenLikeXP && post.hasGivenShareXP) 
    ? `<span class="xp-claimed-status" title="Ya reclamaste XP de like y compartir">✓ XP Completado</span>` 
    : '';

  article.innerHTML = `
    <!-- Cabecera -->
    <div class="post-header">
      <div class="post-author-info">
        <div class="post-avatar-ring">
          <img src="${post.avatar}" alt="${post.user}">
        </div>
        <div class="post-author-text">
          <div class="post-username-row">
            <span class="post-username">${post.user}</span>
            ${verifiedSvg}
            <span class="post-time">• ${post.time}</span>
          </div>
          ${post.location ? `<span class="post-location">${post.location}</span>` : ''}
        </div>
      </div>
      <button class="post-options-btn" title="Opciones" onclick="handlePostOptions('${post.id}')">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <circle cx="12" cy="12" r="2"/>
          <circle cx="19" cy="12" r="2"/>
          <circle cx="5" cy="12" r="2"/>
        </svg>
      </button>
    </div>

    <!-- Media con Doble Clic -->
    <div class="post-media-container" data-post-id="${post.id}">
      ${stickerHtml}
      <img src="${post.image}" alt="Publicación" class="post-img ${post.filter || 'filter-normal'}" loading="lazy">
      
      <div class="double-tap-heart">
        <svg viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
    </div>

    <!-- Acciones -->
    <div class="post-actions-bar">
      <div class="actions-left">
        <button class="action-btn like-btn ${post.isLiked ? 'liked' : ''}" title="Me gusta (+25 XP primera vez)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        <button class="action-btn comment-btn" title="Comentar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </button>

        <button class="action-btn share-btn ${post.hasGivenShareXP ? 'shared' : ''}" title="Compartir (+30 XP una vez)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

      <button class="action-btn bookmark-btn ${post.isSaved ? 'saved' : ''}" title="Guardar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
    </div>

    <!-- Contador de Likes y Estado XP -->
    <div class="post-likes-section">
      <span class="likes-count-text">${post.likesCount.toLocaleString()} Me gusta</span>
      ${xpIndicator}
    </div>

    <!-- Pie de Foto Formateado -->
    <div class="post-caption-section">
      <span class="caption-author">${post.user}</span>
      <span class="caption-text">${formattedCaption}</span>
      ${hashtagsHtml}
    </div>

    <!-- Comentarios -->
    <div class="post-comments-summary">
      <button class="view-comments-btn">Ver los ${post.comments ? post.comments.length : 0} comentarios</button>
      ${commentsHtml}
    </div>

    <!-- Añadir Comentario -->
    <div class="add-comment-row">
      <input type="text" placeholder="Escribe tu reflexión sobre este tema..." class="comment-input-field">
      <button class="comment-submit-btn">Publicar</button>
    </div>
  `;

  setupPostInteractions(article, post);
  return article;
}

function setupPostInteractions(article, post) {
  const mediaContainer = article.querySelector('.post-media-container');
  const doubleHeart = article.querySelector('.double-tap-heart');
  const likeBtn = article.querySelector('.like-btn');
  const likesCountEl = article.querySelector('.likes-count-text');
  const bookmarkBtn = article.querySelector('.bookmark-btn');
  const shareBtn = article.querySelector('.share-btn');
  const commentInput = article.querySelector('.comment-input-field');
  const commentSubmit = article.querySelector('.comment-submit-btn');

  let lastTap = 0;
  mediaContainer.addEventListener('click', (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 300 && tapLength > 0) {
      triggerHeartAnimation();
      togglePostLike(true, e);
    }
    lastTap = currentTime;
  });

  function triggerHeartAnimation() {
    doubleHeart.classList.remove('animate');
    void doubleHeart.offsetWidth;
    doubleHeart.classList.add('animate');
  }

  // Like único XP
  function togglePostLike(forceLike = false, e = null) {
    const coords = e ? { x: e.clientX, y: e.clientY } : { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    if (!post.isLiked || forceLike) {
      if (!post.isLiked) {
        post.isLiked = true;
        post.likesCount++;
        appState.totalLikesGiven++;
      }
      likeBtn.classList.add('liked');
      audioFX.playLikePop();

      if (!post.hasGivenLikeXP) {
        post.hasGivenLikeXP = true;
        addXP(25, coords);
        showToast("❤️ ¡Me gusta! +25 XP ganados");
      } else {
        showToast("❤️ Me gusta (XP ya reclamado anteriormente)");
      }
    } else {
      post.isLiked = false;
      post.likesCount = Math.max(0, post.likesCount - 1);
      likeBtn.classList.remove('liked');
      showToast("Quitaste tu 'Me gusta'");
    }

    likesCountEl.textContent = `${post.likesCount.toLocaleString()} Me gusta`;
    saveState();
  }

  likeBtn.addEventListener('click', (e) => {
    togglePostLike(false, e);
  });

  // Compartir único XP
  shareBtn.addEventListener('click', (e) => {
    const coords = { x: e.clientX, y: e.clientY };
    navigator.clipboard?.writeText(window.location.href);

    if (!post.hasGivenShareXP) {
      post.hasGivenShareXP = true;
      shareBtn.classList.add('shared');
      audioFX.playShareChime();
      addXP(30, coords);
      showToast("📤 ¡Publicación compartida! +30 XP ganados (1 vez por post)");
      saveState();
    } else {
      showToast("📋 Enlace copiado al portapapeles (XP ya reclamado)");
    }
  });

  bookmarkBtn.addEventListener('click', () => {
    post.isSaved = !post.isSaved;
    bookmarkBtn.classList.toggle('saved', post.isSaved);
    showToast(post.isSaved ? "Guardado en tu colección 🔖" : "Eliminado de tus guardados");
    saveState();
  });

  // Comentarios
  commentInput.addEventListener('input', () => {
    if (commentInput.value.trim().length > 0) {
      commentSubmit.classList.add('active');
    } else {
      commentSubmit.classList.remove('active');
    }
  });

  commentInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitComment();
  });

  commentSubmit.addEventListener('click', submitComment);

  function submitComment() {
    const text = commentInput.value.trim();
    if (!text) return;

    const newComment = {
      user: 'lector_del_dilema',
      text: text
    };

    if (!post.comments) post.comments = [];
    post.comments.push(newComment);

    const commentRow = document.createElement('div');
    commentRow.className = 'single-comment';
    commentRow.innerHTML = `
      <span class="comment-author">lector_del_dilema</span>
      <span class="comment-text">${escapeHTML(text)}</span>
    `;

    let previewList = article.querySelector('.comments-preview-list');
    if (!previewList) {
      previewList = document.createElement('div');
      previewList.className = 'comments-preview-list';
      article.querySelector('.post-comments-summary').appendChild(previewList);
    }
    previewList.appendChild(commentRow);

    commentInput.value = '';
    commentSubmit.classList.remove('active');

    addXP(15);
    showToast("Reflexión comentada (+15 XP)");
    saveState();
  }
}

window.handlePostOptions = function(postId) {
  showToast("Publicación del proyecto 'El Dilema de las Redes Sociales'.");
};

// ==========================================================================
// 8. SCROLL INFINITO DINÁMICO
// ==========================================================================

const INFINITE_PHOTO_POOL = [
  {
    user: 'infraestructura_digital',
    location: 'Data Center · Silicon Valley',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&auto=format&fit=crop&q=85',
    filter: 'filter-cyberpunk',
    sticker: 'INFRAESTRUCTURA ALGORÍTMICA',
    caption: 'Granjas de servidores en Silicon Valley procesando petabytes de dwell time, scroll y clics en milisegundos para optimizar las subastas en tiempo real de tu atención.',
    hashtags: ['#DataCenter', '#Algoritmos', '#SiliconValley', '#DwellTime']
  },
  {
    user: 'habitos_conscientes',
    location: 'Espacio Libre de Pantallas',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&auto=format&fit=crop&q=85',
    filter: 'filter-valencia',
    sticker: 'HIGIENE DIGITAL',
    caption: 'Dormitorios libres de pantallas y escritorios despejados: la estrategia recomendada por Tristan Harris para desactivar la compulsión de estímulos antes de dormir.',
    hashtags: ['#HigieneDigital', '#Desconexion', '#Enfoque', '#PazMental']
  },
  {
    user: 'analisis_conductual',
    location: 'Modelado Predictivo',
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1000&auto=format&fit=crop&q=85',
    filter: 'filter-cyberpunk',
    sticker: 'MODELADO DE CONDUCTA',
    caption: 'El gemelo digital se nutre con cada segundo que pasas frente a la pantalla. No subastan datos estáticos: subastan la probabilidad matemática de influir en lo que piensas y haces.',
    hashtags: ['#GemeloDigital', '#Algoritmo', '#Psicometria', '#Futuro']
  },
  {
    user: 'naturaleza_tangible',
    location: 'Mundo Real Desconectado',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1000&auto=format&fit=crop&q=85',
    filter: 'filter-golden',
    sticker: 'VIDA REAL',
    caption: 'Jaron Lanier lo sintetiza en el documental: "Salte de las redes. Elimina tus cuentas. Fíjate cómo se siente el mundo cuando dejas de estar bajo la máquina de manipulación permanente."',
    hashtags: ['#MundoReal', '#JaronLanier', '#DesconexionConsciente', '#Libertad']
  }
];

let poolIndex = 0;

function setupInfiniteScroll() {
  const loader = document.getElementById('feed-loader');
  if (!loader) return;

  const observer = new IntersectionObserver((entries) => {
    const first = entries[0];
    if (first.isIntersecting && !appState.isLoadingMore) {
      loadMorePosts();
    }
  }, { threshold: 0.2 });

  observer.observe(loader);
}

function loadMorePosts() {
  appState.isLoadingMore = true;
  const loader = document.getElementById('feed-loader');
  if (loader) loader.style.display = 'flex';

  setTimeout(() => {
    const template = INFINITE_PHOTO_POOL[poolIndex % INFINITE_PHOTO_POOL.length];
    poolIndex++;

    const newPost = {
      id: `post-inf-${Date.now()}`,
      user: template.user,
      verified: true,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      time: 'hace unos momentos',
      location: template.location,
      image: template.image,
      filter: template.filter,
      sticker: template.sticker,
      likesCount: Math.floor(Math.random() * 2000) + 400,
      caption: template.caption,
      hashtags: template.hashtags,
      comments: [
        { user: 'investigador_dilema', text: 'Excelente punto de vista.' }
      ],
      isLiked: false,
      hasGivenLikeXP: false,
      hasGivenShareXP: false,
      isSaved: false
    };

    appState.posts.push(newPost);
    const container = document.getElementById('posts-feed');
    if (container) {
      const postEl = createPostElement(newPost);
      container.appendChild(postEl);
    }

    appState.isLoadingMore = false;
  }, 700);
}

// ==========================================================================
// 9. CREADOR DE PUBLICACIONES LLAMATIVAS
// ==========================================================================

function setupPostCreator() {
  const createModal = document.getElementById('create-modal');
  const openModalBtns = [
    document.getElementById('nav-create-btn'),
    document.getElementById('mobile-create-btn'),
    document.getElementById('mob-create-trigger'),
    document.getElementById('quick-post-btn'),
    document.getElementById('quick-photo-trigger')
  ];
  const closeModalBtn = document.getElementById('close-create-modal');
  const fileInput = document.getElementById('post-file-input');
  const dropzoneEmpty = document.getElementById('dropzone-empty');
  const dropzonePreview = document.getElementById('dropzone-preview');
  const previewImg = document.getElementById('preview-image');
  const previewSticker = document.getElementById('preview-sticker');
  const changePhotoBtn = document.getElementById('change-photo-btn');
  const captionInput = document.getElementById('post-caption-input');
  const charCount = document.getElementById('char-count');
  const locationInput = document.getElementById('post-location-input');
  const boostToggle = document.getElementById('boost-toggle');
  const submitBtn = document.getElementById('submit-post-btn');

  openModalBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        createModal.classList.remove('hidden');
      });
    }
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      createModal.classList.add('hidden');
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setModalImage(ev.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  document.querySelectorAll('.preset-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.preset-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const imgUrl = thumb.getAttribute('data-img');
      setModalImage(imgUrl);
    });
  });

  function setModalImage(url) {
    appState.selectedImageSrc = url;
    previewImg.src = url;
    dropzoneEmpty.classList.add('hidden');
    dropzonePreview.classList.remove('hidden');
  }

  if (changePhotoBtn) {
    changePhotoBtn.addEventListener('click', () => {
      dropzonePreview.classList.add('hidden');
      dropzoneEmpty.classList.remove('hidden');
    });
  }

  document.querySelectorAll('.filter-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-option').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterClass = btn.getAttribute('data-filter');
      appState.activeFilter = filterClass;
      previewImg.className = filterClass;
    });
  });

  document.querySelectorAll('.sticker-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sticker-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sticker = btn.getAttribute('data-sticker');
      appState.activeSticker = sticker;

      if (sticker === 'none') {
        previewSticker.classList.add('hidden');
      } else {
        previewSticker.textContent = sticker;
        previewSticker.classList.remove('hidden');
      }
    });
  });

  document.querySelectorAll('.hashtag-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const tag = chip.getAttribute('data-tag');
      const cur = captionInput.value;
      if (!cur.includes(tag)) {
        captionInput.value = cur ? `${cur} ${tag}` : tag;
        updateCharCount();
      }
    });
  });

  captionInput.addEventListener('input', updateCharCount);

  function updateCharCount() {
    const len = captionInput.value.length;
    charCount.textContent = `${len}/2200`;
  }

  submitBtn.addEventListener('click', () => {
    const caption = captionInput.value.trim() || 'Reflexión compartida sobre El Dilema de las Redes Sociales ✨ #ElDilemaDeLasRedes';
    const location = locationInput.value.trim() || 'Debate Escolar / Universitario';
    const initialLikes = boostToggle.checked ? Math.floor(Math.random() * 200) + 95 : 0;

    const hashRegex = /#[a-zA-Z0-9_áéíóúÁÉÍÓÚñÑ]+/g;
    const extractedHashtags = caption.match(hashRegex) || ['#ElDilemaDeLasRedes', '#Debate'];

    const newPost = {
      id: `post-user-${Date.now()}`,
      user: 'dilema_redes_grupo',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&auto=format&fit=crop&q=80',
      time: 'hace 1 segundo',
      location: location,
      image: appState.selectedImageSrc || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&auto=format&fit=crop&q=85',
      filter: appState.activeFilter,
      sticker: appState.activeSticker !== 'none' ? appState.activeSticker : '',
      likesCount: initialLikes,
      caption: caption,
      hashtags: extractedHashtags,
      comments: [
        { user: 'shoshana_zuboff', text: 'Excelente aporte para fomentar la conciencia digital.' }
      ],
      isLiked: false,
      hasGivenLikeXP: false,
      hasGivenShareXP: false,
      isSaved: false
    };

    appState.posts.unshift(newPost);
    renderFeed(true);

    audioFX.playPostSuccess();
    addXP(50);

    captionInput.value = '';
    locationInput.value = '';
    createModal.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    showToast("🎉 ¡Publicación creada con éxito! +50 XP");
    saveState();
  });
}

// ==========================================================================
// 10. VISOR DE HISTORIAS INTERACTIVO
// ==========================================================================

function openStoryModal(story, storyItemElement) {
  const modal = document.getElementById('story-modal');
  const avatar = document.getElementById('story-viewer-avatar');
  const username = document.getElementById('story-viewer-user');
  const role = document.getElementById('story-viewer-role');
  const img = document.getElementById('story-viewer-img');
  const caption = document.getElementById('story-viewer-caption');
  const progressFill = document.getElementById('story-progress-fill');
  const closeBtn = document.getElementById('close-story-btn');
  const replyInput = modal.querySelector('.story-reply-input');
  const storyLikeBtn = document.getElementById('story-like-btn');
  const storyFireBtn = document.getElementById('story-fire-btn');

  avatar.src = story.avatar;
  username.textContent = story.user;
  if (role) role.textContent = story.role || 'Dilema de Redes';
  img.src = story.image;
  caption.textContent = story.caption || '';
  replyInput.value = '';

  modal.classList.remove('hidden');
  if (storyItemElement) storyItemElement.classList.add('viewed');

  clearInterval(appState.activeStoryInterval);
  let progress = 0;
  progressFill.style.width = '0%';

  appState.activeStoryInterval = setInterval(() => {
    progress += 2;
    progressFill.style.width = `${progress}%`;

    if (progress >= 100) {
      clearInterval(appState.activeStoryInterval);
      modal.classList.add('hidden');
    }
  }, 100);

  closeBtn.onclick = () => {
    clearInterval(appState.activeStoryInterval);
    modal.classList.add('hidden');
  };

  storyLikeBtn.onclick = (e) => {
    addXP(10, { x: e.clientX, y: e.clientY });
    showToast(`Reaccionaste a la historia de @${story.user} ❤️`);
  };

  storyFireBtn.onclick = (e) => {
    addXP(10, { x: e.clientX, y: e.clientY });
    showToast(`Reaccionaste con fuego a la historia 🔥`);
  };
}

// ==========================================================================
// 11. CONFIGURACIÓN DE MODALES (INCLUYE NIVEL 10)
// ==========================================================================

function setupModals() {
  // Modal de Level Up Normal (2 al 9)
  const levelUpModal = document.getElementById('levelup-modal');
  const claimBtn = document.getElementById('claim-levelup-btn');
  if (claimBtn) {
    claimBtn.addEventListener('click', () => {
      levelUpModal.classList.add('hidden');
    });
  }

  // Modal de Nivel 10 (Concientización y Responsabilidad)
  const level10Modal = document.getElementById('level10-modal');
  const closeLevel10Btn = document.getElementById('close-level10-btn');
  const acceptLevel10Btn = document.getElementById('accept-level10-btn');

  if (closeLevel10Btn) {
    closeLevel10Btn.addEventListener('click', () => {
      level10Modal.classList.add('hidden');
    });
  }

  if (acceptLevel10Btn) {
    acceptLevel10Btn.addEventListener('click', () => {
      level10Modal.classList.add('hidden');
      showToast("🌟 ¡Decisión inspiradora! Tu vida real es tu mejor historia.");
    });
  }

  // Botones de acceso directo para previsualizar Nivel 10
  const triggerLvl10Btn = document.getElementById('trigger-lvl10-demo-btn');
  const mobileLvl10Btn = document.getElementById('mobile-lvl10-btn');

  if (triggerLvl10Btn) {
    triggerLvl10Btn.addEventListener('click', () => {
      showLevel10AwarenessModal();
    });
  }

  if (mobileLvl10Btn) {
    mobileLvl10Btn.addEventListener('click', () => {
      showLevel10AwarenessModal();
    });
  }

  // Modal de Dossier
  const dilemmaModal = document.getElementById('dilemma-info-modal');
  const openDilemmaBtns = [
    document.getElementById('nav-dilemma-report'),
    document.getElementById('mobile-dilemma-btn'),
    document.getElementById('mob-dilemma-tab'),
    document.getElementById('info-dilemma-btn'),
    document.getElementById('btn-open-group-modal'),
    document.getElementById('see-all-experts-btn')
  ];
  const closeDilemmaBtn = document.getElementById('close-dilemma-modal');

  openDilemmaBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        dilemmaModal.classList.remove('hidden');
      });
    }
  });

  if (closeDilemmaBtn) {
    closeDilemmaBtn.addEventListener('click', () => dilemmaModal.classList.add('hidden'));
  }

  document.querySelectorAll('.dossier-tab-btn').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('.dossier-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.dossier-tab-content').forEach(c => c.classList.remove('active'));

      tabBtn.classList.add('active');
      const targetTabId = tabBtn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetTabId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // Botón de sonido
  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundIconOn = document.getElementById('sound-icon-on');
  const soundIconOff = document.getElementById('sound-icon-off');
  const soundText = document.getElementById('sound-status-text');

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      appState.soundEnabled = !appState.soundEnabled;
      if (appState.soundEnabled) {
        soundIconOn.classList.remove('hidden');
        soundIconOff.classList.add('hidden');
        soundText.textContent = 'Sonido: ON';
        showToast("Sonidos activados 🔊");
      } else {
        soundIconOn.classList.add('hidden');
        soundIconOff.classList.remove('hidden');
        soundText.textContent = 'Sonido: OFF';
        showToast("Sonidos silenciados 🔇");
      }
      saveState();
    });
  }

  // Reiniciar XP
  const resetBtn = document.getElementById('reset-progress-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm("¿Deseas reiniciar la barra de progreso a Nivel 1 y restablecer los XP de los posts?")) {
        appState.currentLevel = 1;
        appState.currentXP = 0;
        appState.targetXP = LEVEL_RANKS[0].xpNeeded;
        appState.totalLikesGiven = 0;
        appState.posts = JSON.parse(JSON.stringify(ALL_SCROLL_POSTS));
        updateLevelUI();
        renderFeed();
        showToast("Barra y publicaciones del feed reiniciadas a Nivel 1.");
      }
    });
  }
}

// ==========================================================================
// 12. UTILIDADES
// ==========================================================================

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2600);
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Secret 3-click trigger on Instagram logo to access Tema 1: Vigilancia
let logoClickCount = 0;
let logoClickTimer = null;

function setupSecretLogoTrigger() {
  const logoElements = document.querySelectorAll('.logo-font, .logo-area, .mobile-logo-bar');
  logoElements.forEach(logo => {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      logoClickCount++;

      if (logoClickTimer) clearTimeout(logoClickTimer);

      if (logoClickCount === 3) {
        logoClickCount = 0;
        showToast("Accediendo a la Cabina de Vigilancia...");
        setTimeout(() => {
          window.location.href = 'tema1.html';
        }, 300);
      } else {
        logoClickTimer = setTimeout(() => {
          logoClickCount = 0;
        }, 1500);
      }
    });
  });
}

// ==========================================================================
// 13. INICIALIZACIÓN
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  loadPersistedState();
  updateLevelUI();
  renderStories();
  renderSuggestions();
  renderFeed();
  setupInfiniteScroll();
  setupPostCreator();
  setupModals();
  setupSecretLogoTrigger();

  const unlockAudio = () => {
    audioFX.initContext();
    document.removeEventListener('click', unlockAudio);
  };
  document.addEventListener('click', unlockAudio, { once: true });
});
