// Debe completar esta lista hasta llegar a las 44 cartas.
// tiempoInicio y tiempoFin se miden en segundos (ej: 1 minuto 10 segundos = 70.0)
const datosCartas = [
    { id: 1, imagen: 'carta1.png', tiempoInicio: 5.0, tiempoFin: 7.5 },
    { id: 2, imagen: 'carta2.png', tiempoInicio: 8.0, tiempoFin: 10.2 },
    { id: 3, imagen: 'carta3.png', tiempoInicio: 12.5, tiempoFin: 14.0 },
    // Añadir el resto de las cartas aquí...
];

let puntuacion = 0;
const audio = document.getElementById('pista-audio');
const btnPausa = document.getElementById('btn-pausa');
const marcador = document.getElementById('marcador');
const contenedor = document.getElementById('contenedor-cartas');

// Control de reproducción y pausa
btnPausa.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

// Generar las cartas en la pantalla
datosCartas.forEach(datos => {
    const elementoCarta = document.createElement('div');
    elementoCarta.className = 'carta';
    elementoCarta.innerHTML = `<img src="${datos.imagen}">`;

    elementoCarta.addEventListener('click', () => {
        // Si el juego está pausado o la carta ya tiene el borde verde, no hacer nada
        if (audio.paused || elementoCarta.classList.contains('correcta')) return;

        const tiempoActual = audio.currentTime;

        // Verificar si el clic se hizo en el momento correcto
        if (tiempoActual >= datos.tiempoInicio && tiempoActual <= datos.tiempoFin) {
            elementoCarta.classList.add('correcta');
            puntuacion++;
            marcador.innerText = `Puntuación: ${puntuacion}`;
        } else {
            elementoCarta.classList.add('incorrecta');
            // Remover la clase después de 1 segundo (1000 milisegundos) para que pueda volver a temblar si se equivoca de nuevo
            setTimeout(() => {
                elementoCarta.classList.remove('incorrecta');
            }, 1000);
        }
    });

    contenedor.appendChild(elementoCarta);
});

// Finalizar el juego cuando la canción termina
audio.addEventListener('ended', () => {
    alert(`El juego ha terminado. Puntuación final: ${puntuacion} de 44`);
});