class UI {
    constructor() {
        this.menu = document.getElementById("menu-principal");
        this.pantallaRutinas = document.getElementById("pantalla-rutinas");
        this.entrenamiento = document.getElementById("pantalla-entrenamiento");
        this.pantallaEditor = document.getElementById("pantalla-editor");

        this.contadorEjercicio = document.getElementById("contador-ejercicio");
        this.serieActual = document.getElementById("serie-actual");
        this.nombreEjercicio = document.getElementById("nombre-ejercicio");
        this.tituloDia = document.getElementById("titulo-dia");
        this.siguienteEjercicio = document.getElementById("siguiente-ejercicio");
        this.repeticiones = document.getElementById("repeticiones-ejercicio");
        this.peso = document.getElementById("peso");
        this.temporizador = document.getElementById("temporizador");
        this.progreso = document.getElementById("progreso");

        this.btnSerie = document.getElementById("btn-serie");
        this.btnPausa = document.getElementById("btn-pausa");
    }

    ocultarTodasLasPantallas() {
        [this.menu, this.pantallaRutinas, this.entrenamiento, this.pantallaEditor]
            .forEach(pantalla => pantalla?.classList.add("oculto"));
    }

    mostrarMenu() {
        this.ocultarTodasLasPantallas();
        this.menu?.classList.remove("oculto");
    }

    mostrarRutinas() {
        this.ocultarTodasLasPantallas();
        this.pantallaRutinas?.classList.remove("oculto");
    }

    mostrarEntrenamiento() {
        this.ocultarTodasLasPantallas();
        this.entrenamiento?.classList.remove("oculto");
    }

    mostrarEditor() {
        this.ocultarTodasLasPantallas();
        this.pantallaEditor?.classList.remove("oculto");
    }

    mostrarEjercicio(ejercicio, numero, total) {
        this.tituloDia.textContent = ejercicio.rutinaNombre || this.tituloDia.textContent;
        this.contadorEjercicio.textContent =
            `Ejercicio ${numero} de ${total}`;
        this.nombreEjercicio.textContent = ejercicio.nombre;
        this.repeticiones.textContent =
            `Objetivo: ${ejercicio.repeticiones} reps`;
        this.siguienteEjercicio.textContent =
            ejercicio.siguienteNombre || "Fin del entrenamiento 🎉";
    }

    mostrarPeso(peso) {
        const valor = Number(peso);
        this.peso.textContent =
            Number.isFinite(valor) && valor > 0 ? `${valor} kg` : "0 kg";
    }

    mostrarSerie(actual, total) {
        this.serieActual.textContent = `Serie ${actual} / ${total}`;
    }

    mostrarTiempo(segundos) {
        this.temporizador.textContent = segundos;
    }

    actualizarProgreso(porcentaje) {
        this.progreso.style.width = `${porcentaje}%`;
    }

    preparandoDescanso() {
        this.btnSerie.disabled = true;
        this.btnSerie.textContent = "Descansando...";
        this.btnPausa.classList.remove("oculto");
    }

    finalizarDescanso() {
        this.btnSerie.disabled = false;
        this.btnSerie.textContent = "Terminé la serie";
        this.btnPausa.classList.add("oculto");
        this.btnPausa.textContent = "⏸ Pausar";
    }

    pausar() {
        this.btnPausa.textContent = "▶ Reanudar";
    }

    reanudar() {
        this.btnPausa.textContent = "⏸ Pausar";
    }
}

const ui = new UI();
