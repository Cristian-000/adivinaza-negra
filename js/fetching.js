// URL del JSON
const jsonURL = 'https://raw.githubusercontent.com/Cristian-000/adivinaza-negra/main/data/adivinanzas.json';


// Elementos del DOM
const propuesta = document.getElementById('propuesta');
const tituloP = document.getElementById('tituloProp');
const opciones = document.getElementById('opciones');
const correcta = document.getElementById('correcta');
const cargarOtraAdiv = document.getElementById('cargarOtraAdiv');
const pregunta = document.getElementById("pregunta")

let adivinanzas = [];
let currentAdivinzaIndex = 0;

// Función para cargar las adivinanzas desde el JSON
async function cargarAdivinanzas() {
    try {
        const response = await fetch(jsonURL);
        const data = await response.json();
        adivinanzas = data;
        mostrarAdivinza(currentAdivinzaIndex);
        console.log(adivinanzas)
    } catch (error) {
        console.error('Error al cargar las adivinanzas:', error);
    }
}

// Función para mostrar una adivinanza
function mostrarAdivinza(index) {
    const adivinza = adivinanzas[index];
    if (adivinza) {
        tituloP.textContent = adivinza.name
        propuesta.textContent = adivinza.description;
        pregunta.textContent = adivinza.pregunta;
        opciones.innerHTML = '';
        adivinza.options.forEach((option, i) => {
            const optionElement = document.createElement('button');
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => comprobarRespuesta(option, adivinza.correct));
            opciones.appendChild(optionElement);
        });
    } else {
        propuesta.textContent = 'No hay más adivinanzas.';
        opciones.innerHTML = '';
    }
}

// Función para comprobar la respuesta
function comprobarRespuesta(respuesta, correctaRespuesta) {
    if (respuesta === correctaRespuesta) {
        correcta.textContent = '¡Correcto!';
    } else {
        correcta.textContent = 'Incorrecto. La respuesta correcta es: ' + correctaRespuesta;
    }
    currentAdivinzaIndex++;
    cargarOtraAdiv.addEventListener('click', () => {
        correcta.textContent = '';
        mostrarAdivinza(currentAdivinzaIndex);
    });
}

// Iniciar la carga de adivinanzas
cargarAdivinanzas();