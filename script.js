const listaCartasBase = [
    "a", "i", "u", "e", "o",
    "ka", "ki", "ku", "ke", "ko",
    "sa", "shi", "su", "se", "so",
    "ta", "chi", "tsu", "te", "to",
    "na", "ni", "nu", "ne", "no",
    "ha", "hi", "fu", "he", "ho",
    "ma", "mi", "mu", "me", "mo",
    "ya", "yu", "yo",
    "ra", "ri", "ru", "re", "ro",
    "wa"
];

const configuracionAudios = {
    "audio1": {
        archivo: "pista1.mp3",
        tiempos: {
            "a": { inicio: 5.0, fin: 7.5 },
            "ka": { inicio: 8.0, fin: 10.2 }
        }
    },
    "audio2": {
        archivo: "pista2.mp3",
        tiempos: {
            "i": { inicio: 2.0, fin: 4.5 }
        }
    }
};

let puntuacion = 0;
const tablero = document.getElementById('tablero');
const audio = document.getElementById('pista-audio');
const selectorAudio = document.getElementById('selector-audio');
const marcador = document.getElementById('marcador');

function mezclarArreglo(arreglo) {
    const arr = [...arreglo];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function renderizarTablero() {
    tablero.innerHTML = '';
    puntuacion = 0;
    marcador.innerText = `Puntuación: ${puntuacion}`;
    
    const cartasMezcladas = mezclarArreglo(listaCartasBase);
    let indiceCarta = 0;

    for (let fila = 0; fila < 4; fila++) {
        const divFila = document.createElement('div');
        divFila.className = 'fila';
        
        if (fila < 2) divFila.classList.add('fila-rotada');

        for (let columna = 0; columna < 11; columna++) {
            if (indiceCarta >= cartasMezcladas.length) break;

            const idCarta = cartasMezcladas[indiceCarta];
            const elementoCarta = document.createElement('div');
            elementoCarta.className = 'carta';
            elementoCarta.dataset.id = idCarta;
            elementoCarta.innerHTML = `<img src="Imagenes/${idCarta}.jpg" alt="${idCarta}">`;

            if (fila === 0 || fila === 2) { 
                if (columna === 3 || columna === 7) elementoCarta.classList.add('espacio-extra');
            } else { 
                if (columna === 2 || columna === 6) elementoCarta.classList.add('espacio-extra');
            }

            elementoCarta.addEventListener('click', manejarClicCarta);
            divFila.appendChild(elementoCarta);
            indiceCarta++;
        }
        
        tablero.appendChild(divFila);

        if (fila === 1) {
            const linea = document.createElement('div');
            linea.className = 'linea-divisoria';
            tablero.appendChild(linea);
        }
    }
}

function manejarClicCarta(evento) {
    const elementoCarta = evento.currentTarget;
    if (audio.paused || elementoCarta.classList.contains('oculta')) return;

    const idCarta = elementoCarta.dataset.id;
    const audioActual = selectorAudio.value;
    const datosTiempos = configuracionAudios[audioActual]?.tiempos;
    
    if (!datosTiempos) return;

    const tiempoCarta = datosTiempos[idCarta];
    const tiempoActual = audio.currentTime;

    if (tiempoCarta && tiempoActual >= tiempoCarta.inicio && tiempoActual <= tiempoCarta.fin) {
        elementoCarta.classList.add('oculta');
        puntuacion++;
        marcador.innerText = `Puntuación: ${puntuacion}`;
    } else {
        elementoCarta.classList.add('incorrecta');
        setTimeout(() => {
            elementoCarta.classList.remove('incorrecta');
        }, 500);
    }
}

function cargarAudioSeleccionado() {
    const audioActual = selectorAudio.value;
    if(configuracionAudios[audioActual]) {
        audio.src = configuracionAudios[audioActual].archivo;
    }
    renderizarTablero();
}

document.getElementById('btn-mezclar').addEventListener('click', renderizarTablero);
document.getElementById('btn-pausa').addEventListener('click', () => {
    if (audio.paused) audio.play();
    else audio.pause();
});
selectorAudio.addEventListener('change', cargarAudioSeleccionado);
audio.addEventListener('ended', () => {
    alert(`El juego ha terminado. Puntuación final: ${puntuacion}`);
});

cargarAudioSeleccionado();