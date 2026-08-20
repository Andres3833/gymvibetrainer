class UI {

    constructor() {

        this.nombreEjercicio =
            document.getElementById("nombre-ejercicio");

        this.repeticiones =
            document.getElementById("repeticiones-ejercicio");

        this.peso =
            document.getElementById("peso");

        this.serie =
            document.getElementById("serie-actual");

        this.temporizador =
            document.getElementById("temporizador");

        this.progreso =
            document.getElementById("progreso");

    }

    mostrarEjercicio(ejercicio) {

        this.nombreEjercicio.textContent =
            ejercicio.nombre;

        this.repeticiones.textContent =
            `🎯 Objetivo: ${ejercicio.repeticiones} reps`;

    }

    mostrarPeso(peso) {

        this.peso.textContent =
            peso + " kg";

    }

    mostrarSerie(actual,total) {

        this.serie.textContent =
            `Serie ${actual}/${total}`;

    }

    mostrarTiempo(segundos) {

        this.temporizador.textContent =
            segundos + " s";

    }

    actualizarProgreso(porcentaje) {

        this.progreso.style.width =
            porcentaje + "%";

    }

}

const ui = new UI();