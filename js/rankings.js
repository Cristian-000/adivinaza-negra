const rankingsURL = 'https://raw.githubusercontent.com/Cristian-000/adivinaza-negra/main/data/rankings.json';


        // Función para verificar y agregar puntuación a los rankings
        async function verificarYAgregarPuntuacion(nombre, puntuacion) {
            // Obtener los rankings actuales
            const response = await fetch(rankingsURL);
            const rankings = await response.json();

            // Ordenar los rankings por puntuación (de mayor a menor)
            rankings.sort((a, b) => b.puntuacion - a.puntuacion);

            // Verificar si la nueva puntuación está entre las tres mejores
            if (rankings.length < 3 || puntuacion > rankings[rankings.length - 1].puntuacion) {
                // Agregar la nueva puntuación
                rankings.push({ nombre, puntuacion });

                // Mantener solo las tres mejores puntuaciones
                rankings.sort((a, b) => b.puntuacion - a.puntuacion);
                rankings.splice(3);

                // Actualizar el archivo JSON en tu repositorio
                await fetch(rankingsURL, {
                    method: 'PUT',  // Usa el método adecuado para actualizar el archivo
                    body: JSON.stringify(rankings),
                });

                // Volver a mostrar los rankings actualizados
                mostrarRankings();
            }
        }

        // Función para mostrar los rankings
        async function mostrarRankings() {
            // Obtener los rankings actuales
            const response = await fetch(rankingsURL);
            const rankings = await response.json();

            // Ordenar los rankings por puntuación (de mayor a menor)
            rankings.sort((a, b) => b.puntuacion - a.puntuacion);

            const rankingsLista = document.getElementById('rankings');
            rankingsLista.innerHTML = '';

            // Mostrar los tres mejores rankings
            rankings.slice(0, 3).forEach((ranking, index) => {
                const rankingItem = document.createElement('li');
                rankingItem.textContent = `${index + 1}. ${ranking.nombre}: ${ranking.puntuacion}`;
                rankingsLista.appendChild(rankingItem);
            });
        }

        // Manejo del formulario para ingresar puntuación
        const formularioPuntuacion = document.getElementById('formularioPuntuacion');
        formularioPuntuacion.addEventListener('submit', (event) => {
            event.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const puntuacion = parseInt(document.getElementById('puntuacion').value, 10);

            verificarYAgregarPuntuacion(nombre, puntuacion);
        });

        // Iniciar la carga de adivinanzas y mostrar los rankings
        cargarAdivinanzas();
        mostrarRankings();