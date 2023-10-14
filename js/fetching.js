// URL del JSON
const jsonURL = 'https://raw.githubusercontent.com/Cristian-000/adivinaza-negra/main/data/adivinanzas.json';

// Elementos del DOM
const propuesta = document.getElementById('propuesta');
const tituloP = document.getElementById('tituloProp');
const opciones = document.getElementById('opciones');
const correcta = document.getElementById('correcta');
const cargarOtraAdiv = document.getElementById('cargarOtraAdiv');
const pregunta = document.getElementById('pregunta');
const puntajeMasAltoElement = document.getElementById('puntajeMasAlto');
const puntajeActualElement = document.getElementById('puntajeActual');
let adivinanzas = [];
let currentAdivinzaIndex = 0;
let adivinanzasPorMostrar = [];
let segmentoActual = 0;
let respuestaCorrecta = false;
let adivinanzasAcertadas = 0;
let adivinanzasErradas = 0;

async function cargarAdivinanzas() {
    try {
        const response = await fetch(jsonURL);
        const data = await response.json();
        const adivinanzasAleatorias = data.sort(() => Math.random() - 0.5);

        adivinanzas = adivinanzasAleatorias.slice(0, 20);

        adivinanzasPorMostrar = [...adivinanzas];
        mostrarAdivinzaAleatoria();
        console.log(adivinanzas);

        crearLineaHorizontal(adivinanzas.length);
    } catch (error) {
        console.error('Error al cargar las adivinanzas:', error);
    }
}

function mostrarAdivinzaAleatoria() {
    if (adivinanzasPorMostrar.length === 0) {
        adivinanzasPorMostrar = [...adivinanzas];
    }

    const randomIndex = Math.floor(Math.random() * adivinanzasPorMostrar.length);
    const adivinza = adivinanzasPorMostrar[randomIndex];
    adivinanzasPorMostrar.splice(randomIndex, 1);

    tituloP.textContent = adivinza.name;
    propuesta.textContent = adivinza.description;
    pregunta.textContent = adivinza.question;

    const opcionesAleatorias = shuffle(adivinza.options);

    opciones.innerHTML = '';
    opcionesAleatorias.forEach((option, i) => {
        const optionElement = document.createElement('button');
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => comprobarRespuesta(option, adivinza.correct));
        opciones.appendChild(optionElement);
    });
}

function shuffle(array) {
    let currentIndex = array.length - 1,
        randomIndex,
        temporaryValue;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function comprobarRespuesta(respuesta, correctaRespuesta) {
    const opciones = document.querySelectorAll('#opciones button');
    const botonSeleccionado = Array.from(opciones).find((option) => option.textContent === respuesta);

    opciones.forEach((option) => {
        option.classList.remove('selected');
        option.classList.remove('noSelected');
    });

    if (respuesta === correctaRespuesta) {
        correcta.textContent = '¡Correcto!';
        botonSeleccionado.classList.add('selected');
        cargarOtraAdiv.style.backgroundColor = 'green';
        adivinanzasAcertadas++;
    } else {
        correcta.textContent = 'Incorrecto. La respuesta correcta es: ' + correctaRespuesta;
        botonSeleccionado.classList.add('noSelected');
        cargarOtraAdiv.style.backgroundColor = 'red';
        adivinanzasErradas++;
    }

    if (!respuestaCorrecta) {
        colorearSiguienteSegmento();
        respuestaCorrecta = true;
    }
    agregarPuntajeActual()
    cargarOtraAdiv.removeAttribute('disabled');
}


function mostrarResultadoFinal() {
    if (adivinanzasAcertadas > adivinanzas.length -2) {
        alert(`¡Excelente! Has acertado ${adivinanzasAcertadas} adivinanzas y solo erraste ${adivinanzasErradas}.\n ¡Eres un experto en adivinanzas de mierda!`);
      } else if (adivinanzasAcertadas > adivinanzas.length -5) {
        alert(`No está mal. Has acertado ${adivinanzasAcertadas} adivinanzas, pero has errado ${adivinanzasErradas}.\n Sigue practicando esa mente retorcida.`);
      } else {
        alert(`Necesitas mejorar. Has acertado solo ${adivinanzasAcertadas} adivinanzas y erraste ${adivinanzasErradas}.\n ¡Sigue intentando!`);
      }
    //alert(`Adivinanzas acertadas: ${adivinanzasAcertadas}\nAdivinanzas erradas: ${adivinanzasErradas}`);
    const puntajeAnterior = localStorage.getItem('puntajeMasAlto');
    if (puntajeAnterior === null || adivinanzasAcertadas > parseInt(puntajeAnterior)) {
        localStorage.setItem('puntajeMasAlto', adivinanzasAcertadas);
        mostrarPuntajeMasAlto(); 
    }

    // Reiniciar el juego
    adivinanzasPorMostrar = [...adivinanzas];
    currentAdivinzaIndex = 0;
    segmentoActual = 0;
    adivinanzasAcertadas = 0;
    adivinanzasErradas = 0;
    respuestaCorrecta = false
    correcta.textContent = "";
    cargarOtraAdiv.style.color = 'white';
    puntajeActualElement.textContent = ` 0 / ${adivinanzas.length}`;

    // Reiniciar la línea de segmentos
    const segmentos = document.querySelectorAll('.segmento');
    segmentos.forEach((segmento) => {
        segmento.style.backgroundColor = '#000';
    });
    cargarOtraAdiv.textContent = 'Siguiente';
    cargarOtraAdiv.style.backgroundColor = '#333';
    mostrarAdivinzaAleatoria();
}

function colorearSiguienteSegmento() {
    const segmentos = document.querySelectorAll('.segmento');

    if (segmentoActual < segmentos.length) {
        segmentos[segmentoActual].style.backgroundColor = cargarOtraAdiv.style.backgroundColor;
    }
    if (segmentoActual === segmentos.length - 1) {
        // Cambiar el texto y el color del botón en el último segmento
        cargarOtraAdiv.textContent = 'Ver puntaje';
        cargarOtraAdiv.style.backgroundColor = 'gold';
        cargarOtraAdiv.style.color = 'black';
    }

    segmentoActual++;
}

cargarOtraAdiv.addEventListener('click', () => {
    if (currentAdivinzaIndex < adivinanzas.length - 1) {
        correcta.textContent = '';
        mostrarAdivinzaAleatoria();
        respuestaCorrecta = false;
        currentAdivinzaIndex++; // Mover el incremento aquí
    } else {
        mostrarResultadoFinal();
    }
    cargarOtraAdiv.setAttribute('disabled', 'disabled');
});

function crearLineaHorizontal(numeroSegmentos) {
    const footer = document.createElement('footer');
    footer.style.width = '100%';
    footer.style.backgroundColor = '#ccc';
    footer.style.position = 'fixed';
    footer.style.bottom = '0';
    footer.style.left = '0';

    const lineaHorizontal = document.createElement('div');
    lineaHorizontal.classList.add('linea-horizontal');

    for (let i = 0; i < numeroSegmentos; i++) {
        const segmento = document.createElement('div');
        segmento.classList.add('segmento');
        segmento.style.width = `calc(100% / ${numeroSegmentos})`;
        segmento.style.height = '15px';
        segmento.style.backgroundColor = '#000';
        lineaHorizontal.appendChild(segmento);
    }

    footer.appendChild(lineaHorizontal);
    document.body.appendChild(footer);
}

function mostrarPuntajeMasAlto() {
    const puntajeMasAlto = localStorage.getItem('puntajeMasAlto');
    if (puntajeMasAlto !== null) {
        puntajeMasAltoElement.textContent =`${puntajeMasAlto} - ` ;
    }
}
function agregarPuntajeActual() {
    puntajeActualElement.textContent = `${adivinanzasAcertadas} / ${adivinanzas.length}`;
  }
  

window.addEventListener('load', () => {
    cargarAdivinanzas();
    mostrarPuntajeMasAlto();
});
