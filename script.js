/* === DOM === */
const audio = document.getElementById('audio');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');

/* CONTROLES */
const playBtn = document.getElementById('play');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

/* PROGRESO Y TIEMPO */
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('duration-time');

/* VOLUMEN */
const volumeControl = document.getElementById('volume-control');
const volumeIcon = document.getElementById('volume-icon');
const volumePercentage = document.getElementById('volume-percentage');

/* LISTA Y BÚSQUEDA */
const playlistUl = document.getElementById('playlist-ul');
const searchInput = document.getElementById('search-input');

/* === ESTADO === */
let indiceActual = 0;

/* === UTILIDADES === */
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

/* === LÓGICA CORE === */
function cargarCancion(indice) {
    const cancion = listaCanciones[indice];
    audio.src = cancion.archivo;
    title.innerText = cancion.nombre;
    artist.innerText = cancion.autor;
    cover.src = cancion.portada || "img/default.jpg";
    actualizarListaVisual();
}

function togglePlay() {
    if (audio.paused) {
        audio.play().then(() => {
            playIcon.classList.replace('bi-play-circle-fill', 'bi-pause-circle-fill');
        });
    } else {
        audio.pause();
        playIcon.classList.replace('bi-pause-circle-fill', 'bi-play-circle-fill');
    }
}

/* === GESTIÓN LISTA === */
function generarLista() {
    playlistUl.innerHTML = ""; 
    listaCanciones.forEach((cancion, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${cancion.nombre} <span class="playlist-author">${cancion.autor}</span>`;
        
        li.addEventListener('click', () => {
            indiceActual = index;
            cargarCancion(indiceActual);
            audio.play();
            playIcon.classList.replace('bi-play-circle-fill', 'bi-pause-circle-fill');
        });
        playlistUl.appendChild(li);
    });
}

function actualizarListaVisual() {
    const items = playlistUl.querySelectorAll('li');
    items.forEach((item, index) => {
        item.classList.toggle('active', index === indiceActual);
    });
}

/* === EVENTOS CONTROL === */
playBtn.addEventListener('click', togglePlay);

nextBtn.addEventListener('click', () => {
    indiceActual = (indiceActual + 1) % listaCanciones.length;
    cargarCancion(indiceActual);
    audio.play();
    playIcon.classList.replace('bi-play-circle-fill', 'bi-pause-circle-fill');
});

prevBtn.addEventListener('click', () => {
    indiceActual = (indiceActual - 1 + listaCanciones.length) % listaCanciones.length;
    cargarCancion(indiceActual);
    audio.play();
    playIcon.classList.replace('bi-play-circle-fill', 'bi-pause-circle-fill');
});

/* === EVENTOS PROGRESO === */
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100;
        currentTimeEl.innerText = formatTime(audio.currentTime);
        durationTimeEl.innerText = formatTime(audio.duration);
    }
});

progress.addEventListener('input', () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
});

audio.addEventListener('loadedmetadata', () => {
    durationTimeEl.innerText = formatTime(audio.duration);
});

audio.addEventListener('ended', () => nextBtn.click());

/* === EVENTOS VOLUMEN === */
volumeControl.addEventListener('input', (e) => {
    const vol = e.target.value;
    audio.volume = vol;

    if (volumePercentage) {
        volumePercentage.innerText = `${Math.round(vol * 100)}%`;
    }
    
    if (vol == 0) {
        volumeIcon.className = "bi bi-volume-mute-fill";
    } else if (vol < 0.5) {
        volumeIcon.className = "bi bi-volume-down-fill";
    } else {
        volumeIcon.className = "bi bi-volume-up-fill";
    }
});

volumeIcon.addEventListener('click', () => {
    const isMuted = audio.volume > 0;
    audio.volume = isMuted ? 0 : 1;
    volumeControl.value = audio.volume;
    volumePercentage.innerText = isMuted ? "0%" : "100%";
    volumeIcon.className = isMuted ? "bi bi-volume-mute-fill" : "bi bi-volume-up-fill";
});

/* === EVENTO BÚSQUEDA === */
searchInput.addEventListener('input', () => {
    const filtro = searchInput.value.toLowerCase();
    const items = playlistUl.querySelectorAll('li');

    items.forEach(item => {
        const texto = item.innerText.toLowerCase();
        item.style.display = texto.includes(filtro) ? "block" : "none";
    });
});

/* === INICIO === */
generarLista();
cargarCancion(indiceActual);

/* === MENÚ MÓVIL (BOTTOM SHEET) === */
const toggleListBtn = document.getElementById('toggle-list');
const closeListBtn = document.getElementById('close-list');
const listContainer = document.querySelector('.list');

// Al hacer clic en "Ver Playlist", sube el menú
if (toggleListBtn) {
    toggleListBtn.addEventListener('click', () => {
        listContainer.classList.add('show');
    });
}

// Al hacer clic en la flecha hacia abajo, baja el menú
if (closeListBtn) {
    closeListBtn.addEventListener('click', () => {
        listContainer.classList.remove('show');
    });
}

// Opcional: Que el menú se cierre solo cuando el usuario elige una canción (solo en móvil)
playlistUl.addEventListener('click', () => {
    if(window.innerWidth <= 850) {
        listContainer.classList.remove('show');
    }
});