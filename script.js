// 1. Defina aquí el nombre exacto de sus 44 imágenes (sin la extensión .png)
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

// 2. Defina los audios y en qué segundo exacto es válida cada carta.
// Si una carta no se menciona en el audio, simplemente no la incluya en su lista de tiempos.
const configuracionAudios = {
    "audio1": {
        archivo: "pista1.mp3",
        tiempos: {
            "a": { inicio: 5.0, fin: 7.5 },
            "ka": { inicio: 8.0, fin: 10.2 }
            // ... complete con el resto de tiempos para la pista 1
        }
    },
    "audio2": {
        archivo: "pista2.mp3",
        tiempos: {
            "i": { inicio: 2.0, fin: 4.5 }
            // ... tiempos para pista 2
        }
    }
    // Añada audio3 y audio4 siguiendo la misma estructura
};

let puntuacion = 0;
const tablero = document.getElementById('tablero');
const audio = document.getElementById('pista-audio');
const selectorAudio = document.getElementById('selector-audio');
const marcador = document.getElementById('marcador');

// Función para mezclar aleatoriamente las cartas
function mezclarArreglo(arreglo) {
    const arr = [...arreglo];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Función para construir el tablero visualmente
function renderizarTablero() {
    tablero.innerHTML = '';
    puntuacion = 0;
    marcador.innerText = `Puntuación: ${puntuacion}`;
    
    // Si la lista de cartas base no tiene 44 elementos, generará un error de visualización
    const cartasMezcladas = mezclarArreglo(listaCartasBase);
    let indiceCarta = 0;

    for (let fila = 0; fila < 4; fila++) {
        const divFila = document.createElement('div');
        divFila.className = 'fila';
        
        // Las dos primeras filas están rotadas
        if (fila < 2) divFila.classList.add('fila-rotada');

        for (let columna = 0; columna < 11; columna++) {
            if (indiceCarta >= cartasMezcladas.length) break;

            const idCarta = cartasMezcladas[indiceCarta];
            const elementoCarta = document.createElement('div');
            elementoCarta.className = 'carta';
            elementoCarta.dataset.id = idCarta;
            elementoCarta.innerHTML = `<img src="Imagenes/${idCarta}.jpg" alt="${idCarta}">`;

            // Aplicar patrón de espacios
            if (fila === 0 || fila === 2) { // Patrón 4-4-3
                if (columna === 3 || columna === 7) elementoCarta.classList.add('espacio-extra');
            } else { // Patrón 3-4-4
                if (columna === 2 || columna === 6) elementoCarta.classList.add('espacio-extra');
            }

            elementoCarta.addEventListener('click', manejarClicCarta);
            divFila.appendChild(elementoCarta);
            indiceCarta++;
        }
        
        tablero.appendChild(divFila);

        // Añadir la línea divisoria después de la segunda fila (índice 1)
        if (fila === 1) {
            const linea = document.createElement('div');
            linea.className = 'linea-divisoria';
            tablero.appendChild(linea);
        }
    }
}

// Función para validar el clic según el audio actual
function manejarClicCarta(evento) {
    const elementoCarta = evento.currentTarget;
    if (audio.paused || elementoCarta.classList.contains('correcta')) return;

    const idCarta = elementoCarta.dataset.id;
    const audioActual = selectorAudio.value;
    const datosTiempos = configuracionAudios[audioActual].tiempos;
    
    const tiempoCarta = datosTiempos[idCarta];
    const tiempoActual = audio.currentTime;

    // Verificar si la carta está configurada en el audio y si el tiempo coincide
    if (tiempoCarta && tiempoActual >= tiempoCarta.inicio && tiempoActual <= tiempoCarta.fin) {
        elementoCarta.classList.add('correcta');
        puntuacion++;
        marcador.innerText = `Puntuación: ${puntuacion}`;
    } else {
        elementoCarta.classList.add('incorrecta');
        setTimeout(() => {
            elementoCarta.classList.remove('incorrecta');
        }, 500);
    }
}

// Cargar el audio seleccionado
function cargarAudioSeleccionado() {
    const audioActual = selectorAudio.value;
    if(configuracionAudios[audioActual]) {
        audio.src = configuracionAudios[audioActual].archivo;
    }
    renderizarTablero(); // Reinicia el tablero al cambiar de pista
}

// Eventos
document.getElementById('btn-mezclar').addEventListener('click', renderizarTablero);
document.getElementById('btn-pausa').addEventListener('click', () => {
    if (audio.paused) audio.play();
    else audio.pause();
});
selectorAudio.addEventListener('change', cargarAudioSeleccionado);
audio.addEventListener('ended', () => {
    alert(`El juego ha terminado. Puntuación final: ${puntuacion}`);
});

// Inicialización
cargarAudioSeleccionado();