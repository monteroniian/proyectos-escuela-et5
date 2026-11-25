/**
 * Random YouTube Hits 200 - Main Application Logic
 * Smart YouTube Integration with Embedding Fallback & Error Handling
 */

document.addEventListener('DOMContentLoaded', () => {
  const tracks = window.TRACKS_DATA || [];
  
  // App State
  let currentTrackIndex = -1;
  let isPlaying = false;
  let isRepeat = false;
  let isShuffle = true;
  let filteredTracks = [...tracks];
  let currentPage = 1;
  const itemsPerPage = 24;
  let activeGenre = 'ALL';
  let searchQuery = '';
  let likedTrackIds = new Set(JSON.parse(localStorage.getItem('random_youtube_likes') || '[]'));
  let progressInterval = null;

  // YouTube Player instance
  let ytPlayer = null;
  let isYtReady = false;

  // DOM Elements
  const btnRandomHero = document.getElementById('btnRandomHero');
  const spotlightTitle = document.getElementById('spotlightTitle');
  const spotlightArtist = document.getElementById('spotlightArtist');
  const spotlightGenre = document.getElementById('spotlightGenre');
  const spotlightCoverImg = document.getElementById('spotlightCoverImg');
  const btnToggleVideo = document.getElementById('btnToggleVideo');
  const btnOpenYoutubeSpotlight = document.getElementById('btnOpenYoutubeSpotlight');
  const youtubeWrapper = document.getElementById('youtubeWrapper');

  const tracksGrid = document.getElementById('tracksGrid');
  const searchInput = document.getElementById('searchInput');
  const genreChipsContainer = document.getElementById('genreChipsContainer');
  const catalogStats = document.getElementById('catalogStats');
  
  const btnPrevPage = document.getElementById('btnPrevPage');
  const btnNextPage = document.getElementById('btnNextPage');
  const pageIndicator = document.getElementById('pageIndicator');
  
  // Player Bar Elements
  const playerTitle = document.getElementById('playerTitle');
  const playerArtist = document.getElementById('playerArtist');
  const playerThumbImg = document.getElementById('playerThumbImg');
  const btnPlayMain = document.getElementById('btnPlayMain');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnRepeat = document.getElementById('btnRepeat');
  const btnShuffle = document.getElementById('btnShuffle');
  const btnLikeCurrent = document.getElementById('btnLikeCurrent');
  const btnOpenYoutubePlayer = document.getElementById('btnOpenYoutubePlayer');
  
  const progressBarWrap = document.getElementById('progressBarWrap');
  const progressBarFill = document.getElementById('progressBarFill');
  const currentTimeEl = document.getElementById('currentTime');
  const totalTimeEl = document.getElementById('totalTime');
  const volumeSlider = document.getElementById('volumeSlider');
  const btnMute = document.getElementById('btnMute');
  
  const canvas = document.getElementById('canvasVisualizer');
  const canvasCtx = canvas ? canvas.getContext('2d') : null;
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  // Sync liked status
  tracks.forEach(t => {
    t.liked = likedTrackIds.has(t.id);
  });

  // Canvas visualizer sizing & animation
  function initCanvas() {
    if (!canvas) return;
    canvas.width = canvas.parentElement.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.parentElement.clientHeight * window.devicePixelRatio;
    if (canvasCtx) canvasCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  window.addEventListener('resize', initCanvas);
  initCanvas();

  function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    if (!canvasCtx || !canvas) return;

    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;

    canvasCtx.clearRect(0, 0, width, height);

    const barsCount = 32;
    const barWidth = (width / barsCount) * 1.5;
    let x = 0;

    for (let i = 0; i < barsCount; i++) {
      let val = 5;
      if (isPlaying) {
        val = Math.sin(Date.now() * 0.008 + i * 0.4) * 20 + 25 + Math.random() * 15;
      }

      const barHeight = (val / 60) * height * 0.85;
      
      const gradient = canvasCtx.createLinearGradient(0, height - barHeight, 0, height);
      gradient.addColorStop(0, '#ff0000');
      gradient.addColorStop(0.5, '#ec4899');
      gradient.addColorStop(1, '#9333ea');

      canvasCtx.fillStyle = gradient;
      canvasCtx.shadowColor = 'rgba(239, 68, 68, 0.4)';
      canvasCtx.shadowBlur = 6;
      
      canvasCtx.beginPath();
      canvasCtx.roundRect(x, height - barHeight, barWidth - 4, barHeight, 4);
      canvasCtx.fill();

      x += barWidth + 2;
    }
  }
  drawVisualizer();

  // YOUTUBE API INITIALIZATION
  window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player('ytPlayer', {
      height: '100%',
      width: '100%',
      videoId: tracks[0].youtubeId,
      playerVars: {
        'autoplay': 1,
        'controls': 1,
        'modestbranding': 1,
        'rel': 0,
        'enablejsapi': 1,
        'origin': window.location.origin
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onError': onPlayerError
      }
    });
  };

  function onPlayerReady(event) {
    isYtReady = true;
    if (volumeSlider) {
      ytPlayer.setVolume(volumeSlider.value);
    }
  }

  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
      isPlaying = true;
      startProgressTracker();
    } else if (event.data === YT.PlayerState.PAUSED) {
      isPlaying = false;
      stopProgressTracker();
    } else if (event.data === YT.PlayerState.ENDED) {
      isPlaying = false;
      stopProgressTracker();
      if (isRepeat) {
        playTrackIndex(currentTrackIndex);
      } else if (isShuffle) {
        playRandomTrack();
      } else {
        playTrackIndex((currentTrackIndex + 1) % tracks.length);
      }
    }
    updatePlayerUI();
    renderGrid();
  }

  // Handle YouTube Embedding Restrictions / Video Unavailable errors
  function onPlayerError(event) {
    console.warn("YouTube Player error code:", event.data);
    const track = tracks[currentTrackIndex];
    if (!track) return;

    if (event.data === 101 || event.data === 150 || event.data === 100 || event.data === 2) {
      showToast(`⚠️ "${track.title}" no permite inserción. Pasando a otra canción aleatoria...`);
      // Automatically jump to another working random track after 1.2 seconds
      setTimeout(() => {
        playRandomTrack();
      }, 1200);
    }
  }

  // Progress Tracker for Time & Seek Bar
  function startProgressTracker() {
    stopProgressTracker();
    progressInterval = setInterval(() => {
      if (ytPlayer && isYtReady && isPlaying) {
        const curTime = ytPlayer.getCurrentTime() || 0;
        const dur = ytPlayer.getDuration() || 0;

        if (dur > 0) {
          const pct = (curTime / dur) * 100;
          progressBarFill.style.width = `${pct}%`;
          
          const curMins = Math.floor(curTime / 60);
          const curSecs = String(Math.floor(curTime % 60)).padStart(2, '0');
          currentTimeEl.textContent = `${curMins}:${curSecs}`;

          const durMins = Math.floor(dur / 60);
          const durSecs = String(Math.floor(dur % 60)).padStart(2, '0');
          totalTimeEl.textContent = `${durMins}:${durSecs}`;
        }
      }
    }, 500);
  }

  function stopProgressTracker() {
    if (progressInterval) clearInterval(progressInterval);
  }

  // PLAY TRACK BY INDEX
  function playTrackIndex(index) {
    if (index < 0 || index >= tracks.length) return;
    
    currentTrackIndex = index;
    const track = tracks[currentTrackIndex];

    if (isYtReady && ytPlayer) {
      ytPlayer.loadVideoById(track.youtubeId);
      isPlaying = true;
    }

    showToast(`🎲 ¡Sonando éxito #${track.id}: "${track.title}" de ${track.artist}!`);
    updateSpotlightUI(track);
    updatePlayerUI();
    renderGrid();
  }

  // PLAY RANDOM TRACK
  function playRandomTrack() {
    if (tracks.length === 0) return;
    
    let randomIndex;
    if (tracks.length > 1) {
      do {
        randomIndex = Math.floor(Math.random() * tracks.length);
      } while (randomIndex === currentTrackIndex);
    } else {
      randomIndex = 0;
    }

    playTrackIndex(randomIndex);
  }

  // UI UPDATERS
  function updateSpotlightUI(track) {
    spotlightTitle.textContent = track.title;
    spotlightArtist.textContent = track.artist;
    spotlightGenre.textContent = track.genre;
    spotlightCoverImg.src = track.cover;

    if (btnOpenYoutubeSpotlight) {
      btnOpenYoutubeSpotlight.href = track.audioUrl;
    }
  }

  function updatePlayerUI() {
    if (currentTrackIndex === -1) return;
    const track = tracks[currentTrackIndex];

    playerTitle.textContent = track.title;
    playerArtist.textContent = track.artist;
    playerThumbImg.src = track.cover;

    btnPlayMain.innerHTML = isPlaying ? '❚❚' : '▶';
    
    if (btnLikeCurrent) {
      btnLikeCurrent.classList.toggle('liked', track.liked);
    }

    if (btnOpenYoutubePlayer) {
      btnOpenYoutubePlayer.href = track.audioUrl;
    }
  }

  function showToast(msg) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

  // GENRE FILTERS RENDER
  function renderGenreChips() {
    if (!genreChipsContainer) return;
    const genres = ['ALL', 'FAVORITES', ...new Set(tracks.map(t => t.genre))];
    
    genreChipsContainer.innerHTML = '';
    genres.forEach(g => {
      const btn = document.createElement('button');
      btn.className = `btn-chip ${g === activeGenre ? 'active' : ''}`;
      
      if (g === 'ALL') btn.textContent = '🔥 Todos los Éxitos (200)';
      else if (g === 'FAVORITES') btn.textContent = `❤️ Favoritas (${likedTrackIds.size})`;
      else btn.textContent = g;

      btn.addEventListener('click', () => {
        activeGenre = g;
        currentPage = 1;
        renderGenreChips();
        applyFilters();
      });
      genreChipsContainer.appendChild(btn);
    });
  }

  // APPLY FILTERS
  function applyFilters() {
    filteredTracks = tracks.filter(track => {
      const matchesSearch = searchQuery === '' || 
        track.title.toLowerCase().includes(searchQuery) ||
        track.artist.toLowerCase().includes(searchQuery) ||
        track.genre.toLowerCase().includes(searchQuery) ||
        String(track.id).includes(searchQuery);

      let matchesGenre = true;
      if (activeGenre === 'FAVORITES') {
        matchesGenre = track.liked;
      } else if (activeGenre !== 'ALL') {
        matchesGenre = track.genre === activeGenre;
      }

      return matchesSearch && matchesGenre;
    });

    renderGrid();
  }

  // CATALOG GRID RENDER
  function renderGrid() {
    if (!tracksGrid) return;
    
    catalogStats.textContent = `Mostrando ${filteredTracks.length} de 200 canciones`;
    
    const totalPages = Math.ceil(filteredTracks.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    pageIndicator.textContent = `Página ${currentPage} de ${totalPages}`;
    btnPrevPage.disabled = currentPage === 1;
    btnNextPage.disabled = currentPage === totalPages;

    const start = (currentPage - 1) * itemsPerPage;
    const pageTracks = filteredTracks.slice(start, start + itemsPerPage);

    tracksGrid.innerHTML = '';

    if (pageTracks.length === 0) {
      tracksGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: var(--text-muted);">
          No se encontraron canciones famosas que coincidan con la búsqueda.
        </div>
      `;
      return;
    }

    pageTracks.forEach(track => {
      const isCurrent = track.id === (tracks[currentTrackIndex]?.id);
      const card = document.createElement('div');
      card.className = `track-card ${isCurrent ? 'active' : ''}`;
      
      card.innerHTML = `
        <div class="card-cover">
          <img src="${track.cover}" alt="${track.title}" loading="lazy">
          <div class="play-overlay">
            <div class="play-btn-circle">${isCurrent && isPlaying ? '❚❚' : '▶'}</div>
          </div>
        </div>
        <div class="card-details">
          <div class="card-title">${track.title}</div>
          <div class="card-artist">${track.artist}</div>
          <div class="card-meta">
            <span>${track.genre}</span>
            <div style="display:flex; align-items:center; gap:8px;">
              <a href="${track.audioUrl}" target="_blank" class="link-yt" title="Abrir video en YouTube" onclick="event.stopPropagation();">
                📺
              </a>
              <button class="btn-like ${track.liked ? 'liked' : ''}" data-id="${track.id}">
                ${track.liked ? '❤️' : '🤍'}
              </button>
            </div>
          </div>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-like') || e.target.closest('.link-yt')) return;
        const targetIndex = tracks.findIndex(t => t.id === track.id);
        if (targetIndex !== -1) {
          if (targetIndex === currentTrackIndex) {
            togglePlayPause();
          } else {
            playTrackIndex(targetIndex);
          }
        }
      });

      const likeBtn = card.querySelector('.btn-like');
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleLike(track.id);
      });

      tracksGrid.appendChild(card);
    });
  }

  function toggleLike(id) {
    const track = tracks.find(t => t.id === id);
    if (!track) return;

    track.liked = !track.liked;
    if (track.liked) {
      likedTrackIds.add(id);
    } else {
      likedTrackIds.delete(id);
    }

    localStorage.setItem('random_youtube_likes', JSON.stringify([...likedTrackIds]));
    renderGenreChips();
    applyFilters();
    updatePlayerUI();
  }

  function togglePlayPause() {
    if (currentTrackIndex === -1) {
      playRandomTrack();
      return;
    }

    if (isYtReady && ytPlayer) {
      if (isPlaying) {
        ytPlayer.pauseVideo();
      } else {
        ytPlayer.playVideo();
      }
    }
  }

  // Progress Bar Seek
  if (progressBarWrap) {
    progressBarWrap.addEventListener('click', (e) => {
      if (currentTrackIndex === -1 || !ytPlayer || !isYtReady) return;
      const rect = progressBarWrap.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      const dur = ytPlayer.getDuration() || 0;
      if (dur > 0) {
        ytPlayer.seekTo(pct * dur, true);
      }
    });
  }

  // Volume Control
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      const vol = parseInt(e.target.value, 10);
      if (ytPlayer && isYtReady) {
        ytPlayer.setVolume(vol);
      }
    });
  }

  // Video Toggle
  if (btnToggleVideo && youtubeWrapper) {
    btnToggleVideo.addEventListener('click', () => {
      youtubeWrapper.classList.toggle('hidden');
      btnToggleVideo.textContent = youtubeWrapper.classList.contains('hidden') 
        ? '🎥 Mostrar Video' 
        : '🙈 Ocultar Video';
    });
  }

  // Buttons Event Handlers
  if (btnRandomHero) {
    btnRandomHero.addEventListener('click', (e) => {
      const circle = document.createElement('span');
      const diameter = Math.max(btnRandomHero.clientWidth, btnRandomHero.clientHeight);
      const radius = diameter / 2;
      const rect = btnRandomHero.getBoundingClientRect();

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');

      const ripple = btnRandomHero.getElementsByClassName('ripple')[0];
      if (ripple) ripple.remove();

      btnRandomHero.appendChild(circle);

      playRandomTrack();
    });
  }

  btnPlayMain.addEventListener('click', togglePlayPause);

  btnNext.addEventListener('click', () => {
    if (isShuffle) playRandomTrack();
    else playTrackIndex((currentTrackIndex + 1) % tracks.length);
  });

  btnPrev.addEventListener('click', () => {
    if (currentTrackIndex > 0) playTrackIndex(currentTrackIndex - 1);
    else playRandomTrack();
  });

  btnRepeat.addEventListener('click', () => {
    isRepeat = !isRepeat;
    btnRepeat.classList.toggle('active', isRepeat);
    showToast(isRepeat ? '🔂 Repetición activada' : '➡️ Repetición desactivada');
  });

  btnShuffle.addEventListener('click', () => {
    isShuffle = !isShuffle;
    btnShuffle.classList.toggle('active', isShuffle);
    showToast(isShuffle ? '🔀 Modo Aleatorio activado' : '▶️ Modo Secuencial activado');
  });

  if (btnLikeCurrent) {
    btnLikeCurrent.addEventListener('click', () => {
      if (currentTrackIndex !== -1) {
        toggleLike(tracks[currentTrackIndex].id);
      }
    });
  }

  // Search Input Handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      currentPage = 1;
      applyFilters();
    });
  }

  // Pagination Handlers
  btnPrevPage.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderGrid();
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  });

  btnNextPage.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredTracks.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderGrid();
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  });

  // Keyboard Shortcuts (Space or 'R' for random track)
  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlayPause();
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      playRandomTrack();
    }
  });

  // Initial Setup
  renderGenreChips();
  applyFilters();

  const initialTrack = tracks[0];
  updateSpotlightUI(initialTrack);
});
