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
            "mu": { inicio: 24.0, fin: 42.0 },
            "chi": { inicio: 42.0, fin: 63.0 },
            "ne": { inicio: 63.0, fin: 85.0 },
            "to": { inicio: 85.0, fin: 106.0 },
            "ra": { inicio: 106.0, fin: 127.0 },
            "mi": { inicio: 127.0, fin: 149.0 },
            "ke": { inicio: 149.0, fin: 170.0 },
            "hi": { inicio: 170.0, fin: 192.0 },
            "no": { inicio: 192.0, fin: 212.0 },
            "ku": { inicio: 212.0, fin: 233.0 },
            "ru": { inicio: 233.0, fin: 254.0 },
            "e": { inicio: 254.0, fin: 276.0 },
            "i": { inicio: 276.0, fin: 296.0 },
            "yo": { inicio: 296.0, fin: 316.0 },
            "nu": { inicio: 316.0, fin: 337.0 },
            "wa": { inicio: 337.0, fin: 357.0 },
            "ma": { inicio: 357.0, fin: 377.0 },
            "ya": { inicio: 377.0, fin: 395.0 },
            "he": { inicio: 395.0, fin: 415.0 },
            "re": { inicio: 415.0, fin: 437.0 },
            "me": { inicio: 437.0, fin: 455.0 },
            "te": { inicio: 455.0, fin: 476.0 },
            "ri": { inicio: 476.0, fin: 496.0 },
            "mo": { inicio: 496.0, fin: 517.0 },
            "se": { inicio: 517.0, fin: 538.0 },
            "a": { inicio: 538.0, fin: 559.0 },
            "ha": { inicio: 559.0, fin: 579.0 },
            "shi": { inicio: 579.0, fin: 599.0 },
            "yu": { inicio: 599.0, fin: 620.0 },
            "su": { inicio: 620.0, fin: 639.0 },
            "so": { inicio: 639.0, fin: 660.0 },
            "na": { inicio: 660.0, fin: 682.0 },
            "ni": { inicio: 682.0, fin: 703.0 },
            "tsu": { inicio: 703.0, fin: 724.0 },
            "ro": { inicio: 724.0, fin: 742.0 },
            "ki": { inicio: 742.0, fin: 761.0 },
            "ka": { inicio: 761.0, fin: 782.0 },
            "sa": { inicio: 782.0, fin: 803.0 },
            "fu": { inicio: 803.0, fin: 822.0 },
            "ho": { inicio: 822.0, fin: 844.0 },
            "ko": { inicio: 844.0, fin: 864.0 },
            "ta": { inicio: 864.0, fin: 885.0 },
            "u": { inicio: 885.0, fin: 903.0 }
        }
    },
    "audio2": { archivo: "pista2.mp3", tiempos: {} },
    "audio3": { archivo: "pista3.mp3", tiempos: {} },
    "audio4": { archivo: "pista4.mp3", tiempos: {} }
};

let puntuacion = 0;
let tiempoAcumulado = 0;
let estadoCartas = {};
let bloqueoClic = false;
let modoFinalActivado = false;
let listaTiemposOrdenada = [];
let tiemposReaccion = [];
let cartasFalladas = [];

const tablero = document.getElementById('tablero');
const audio = document.getElementById('pista-audio');
const selectorAudio = document.getElementById('selector-audio');
const marcador = document.getElementById('marcador');
const pantallaDemora = document.getElementById('tiempo-acumulado');

function actualizarDemoraVisual() {
    pantallaDemora.innerText = `Demora: ${tiempoAcumulado.toFixed(2)} s`;
}

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
    tablero.className = '';
    puntuacion = 0;
    tiempoAcumulado = 0;
    estadoCartas = {};
    bloqueoClic = false;
    modoFinalActivado = false;
    tiemposReaccion = [];
    cartasFalladas = [];
    
    audio.pause();
    audio.currentTime = 0;
    
    marcador.innerText = `Puntuación: ${puntuacion}`;
    actualizarDemoraVisual();
    
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

function activarDueloFinal() {
    modoFinalActivado = true;
    tablero.innerHTML = '';
    tablero.className = 'duelo-final';

    const cartasRestantes = listaCartasBase.filter(id => !estadoCartas[id]);

    cartasRestantes.forEach(idCarta => {
        const elementoCarta = document.createElement('div');
        elementoCarta.className = 'carta';
        elementoCarta.dataset.id = idCarta;
        elementoCarta.innerHTML = `<img src="Imagenes/${idCarta}.jpg" alt="${idCarta}">`;
        elementoCarta.addEventListener('click', manejarClicCarta);
        tablero.appendChild(elementoCarta);
    });
}

function manejarClicCarta(evento) {
    if (bloqueoClic) return;
    
    const elementoCarta = evento.currentTarget;
    if (audio.paused || elementoCarta.classList.contains('oculta') || elementoCarta.classList.contains('transparente')) return;

    const idCarta = elementoCarta.dataset.id;
    const audioActual = selectorAudio.value;
    const datosTiempos = configuracionAudios[audioActual]?.tiempos;
    
    if (!datosTiempos) return;

    const tiempoCarta = datosTiempos[idCarta];
    const tiempoActual = audio.currentTime;

    if (tiempoCarta && tiempoActual >= tiempoCarta.inicio && tiempoActual <= tiempoCarta.fin) {
        if (!estadoCartas[idCarta]) {
            estadoCartas[idCarta] = 'acierto';
            elementoCarta.classList.add('oculta');
            
            const demora = tiempoActual - tiempoCarta.inicio;
            tiempoAcumulado += demora;
            tiemposReaccion.push(demora);
            
            if (modoFinalActivado) {
                puntuacion += 2;
                document.querySelectorAll('.carta').forEach(c => c.classList.add('oculta'));
            } else {
                puntuacion++;
            }
            
            marcador.innerText = `Puntuación: ${puntuacion}`;
            actualizarDemoraVisual();
        }
    } else {
        bloqueoClic = true;
        elementoCarta.classList.add('incorrecta');
        setTimeout(() => {
            elementoCarta.classList.remove('incorrecta');
            bloqueoClic = false;
        }, 1000);
    }
}

audio.addEventListener('timeupdate', () => {
    const audioActual = selectorAudio.value;
    const datosTiempos = configuracionAudios[audioActual]?.tiempos;
    if (!datosTiempos) return;

    const tiempoActual = audio.currentTime;

    for (const [idCarta, tiempo] of Object.entries(datosTiempos)) {
        if (tiempoActual > tiempo.fin && !estadoCartas[idCarta]) {
            estadoCartas[idCarta] = 'fallo';
            cartasFalladas.push(idCarta);
            
            const demora = tiempo.fin - tiempo.inicio;
            tiempoAcumulado += demora;
            tiemposReaccion.push(demora);
            actualizarDemoraVisual();

            const cartaVisual = document.querySelector(`.carta[data-id="${idCarta}"]`);
            if (cartaVisual) cartaVisual.classList.add('transparente');
        }
    }

    if (listaTiemposOrdenada.length >= 43) {
        const tiempoCarta43 = listaTiemposOrdenada[42];
        if (tiempoActual >= tiempoCarta43.inicio && !modoFinalActivado) {
            activarDueloFinal();
        }
    }
});

function cargarAudioSeleccionado() {
    const audioActual = selectorAudio.value;
    const datosTiempos = configuracionAudios[audioActual]?.tiempos;
    
    if (datosTiempos) {
        audio.src = configuracionAudios[audioActual].archivo;
        listaTiemposOrdenada = Object.entries(datosTiempos)
            .map(([id, t]) => ({ id, ...t }))
            .sort((a, b) => a.inicio - b.inicio);
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
    const promedio = tiemposReaccion.length > 0 ? (tiempoAcumulado / tiemposReaccion.length).toFixed(2) : 0;
    const listadoFallas = cartasFalladas.length > 0 ? cartasFalladas.join(', ') : 'Ninguna';
    alert(`Reporte Final\n\nPuntuación: ${puntuacion} de 44\nPromedio de reacción: ${promedio} s\nDemora total: ${tiempoAcumulado.toFixed(2)} s\nCartas falladas: ${listadoFallas}`);
});

cargarAudioSeleccionado();