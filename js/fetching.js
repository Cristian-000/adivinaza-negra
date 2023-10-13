// URL del JSON
const jsonURL = 'https://raw.githubusercontent.com/Cristian-000/adivinaza-negra/main/data/adivinanzas.json';

// Elementos del DOM
const propuesta = document.getElementById('propuesta');
const tituloP = document.getElementById('tituloProp');
const opciones = document.getElementById('opciones');
const correcta = document.getElementById('correcta');
const cargarOtraAdiv = document.getElementById('cargarOtraAdiv');
const pregunta = document.getElementById('pregunta');

let adivinanzas = [];
let currentAdivinzaIndex = 0;
let adivinanzasPorMostrar = [];
let segmentoActual = 0;
let respuestaCorrecta = false;
let adivinanzasAcertadas = 0;
let adivinanzasErradas = 0;

// Función para cargar las adivinanzas desde el JSON
async function cargarAdivinanzas() {
    try {
        const response = await fetch(jsonURL);
        const data = await response.json();
        adivinanzas = data;
        adivinanzasPorMostrar = [...adivinanzas];
        mostrarAdivinzaAleatoria();
        console.log(adivinanzas);

        // Crea dinámicamente la línea horizontal con segmentos
        crearLineaHorizontal(adivinanzas.length);
    } catch (error) {
        console.error('Error al cargar las adivinanzas:', error);
    }
}

// Función para mostrar una adivinanza aleatoria
function mostrarAdivinzaAleatoria() {
    if (adivinanzasPorMostrar.length === 0) {
        // Si ya se mostraron todas las adivinanzas, reiniciamos el arreglo
        adivinanzasPorMostrar = [...adivinanzas];
    }

    // Elegir una adivinanza aleatoria de las que quedan por mostrar
    const randomIndex = Math.floor(Math.random() * adivinanzasPorMostrar.length);
    const adivinza = adivinanzasPorMostrar[randomIndex];
    adivinanzasPorMostrar.splice(randomIndex, 1);

    tituloP.textContent = adivinza.name;
    propuesta.textContent = adivinza.description;
    pregunta.textContent = adivinza.question;

    // Mezclar las opciones de forma aleatoria
    const opcionesAleatorias = shuffle(adivinza.options);

    opciones.innerHTML = '';
    opcionesAleatorias.forEach((option, i) => {
        const optionElement = document.createElement('button');
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => comprobarRespuesta(option, adivinza.correct));
        opciones.appendChild(optionElement);
    });
}

// Función para mezclar un arreglo de forma aleatoria
function shuffle(array) {
    let currentIndex = array.length-1,
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

// Función para comprobar la respuesta
function comprobarRespuesta(respuesta, correctaRespuesta) {
    const opciones = document.querySelectorAll('#opciones button');
    const botonSeleccionado = Array.from(opciones).find((option) => option.textContent === respuesta);

    // Limpiar las clases de los botones
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
    cargarOtraAdiv.removeAttribute('disabled');
}


function mostrarResultadoFinal() {
    // Mostrar un mensaje con la cantidad de adivinanzas acertadas y erradas
    alert(`Adivinanzas acertadas: ${adivinanzasAcertadas}\nAdivinanzas erradas: ${adivinanzasErradas}`);
    // Reiniciar el juego
    adivinanzasPorMostrar = [...adivinanzas];
    currentAdivinzaIndex = 0;
    segmentoActual = 0;
    adivinanzasAcertadas = 0;
    adivinanzasErradas = 0;
    respuestaCorrecta = false

    // Reiniciar la línea de segmentos
    const segmentos = document.querySelectorAll('.segmento');
    segmentos.forEach((segmento) => {
        segmento.style.backgroundColor = '#000';
    });
    cargarOtraAdiv.textContent = 'Siguiente';
        cargarOtraAdiv.style.backgroundColor = '#333';
    
    // Mostrar la primera adivinanza después de reiniciar
    mostrarAdivinzaAleatoria();
}


// Función para colorear el siguiente segmento de la línea
function colorearSiguienteSegmento() {
    const segmentos = document.querySelectorAll('.segmento');
   
    if (segmentoActual < segmentos.length) {
        segmentos[segmentoActual].style.backgroundColor = cargarOtraAdiv.style.backgroundColor;
    }
    if (segmentoActual === segmentos.length - 1) {
        // Cambiar el texto y el color del botón en el último segmento
        cargarOtraAdiv.textContent = 'Reiniciar';
        cargarOtraAdiv.style.backgroundColor = 'gold'; // o el color dorado que desees
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

// Iniciar la carga de adivinanzas
cargarAdivinanzas();

// Función para crear dinámicamente la línea horizontal con segmentos
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
