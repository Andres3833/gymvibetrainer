class GymVibeApp {
    constructor() {
        this.rutinaActual = null;
        this.rutinaId = null;
        this.ejercicioActual = 0;
        this.serieActual = 1;
        this.descansando = false;
        this.pausado = false;
        this.modoPrueba = false;
        const rutinasGuardadas = storage.cargar("rutinas", null);

        if (rutinasGuardadas) {
        Object.assign(rutinas, rutinasGuardadas);
        }

        this.audioDescanso = new Audio("audio/sonido-descanso.mp3");

        this.btnIniciar = document.getElementById("btn-iniciar");
        this.btnEditar = document.getElementById("btn-editar");
        this.btnConfig = document.getElementById("btn-config");
        this.btnVolverMenu = document.getElementById("volver-menu");
        this.btnVolverRutinas = document.getElementById("volver-rutinas");
        this.btnVolverEditor = document.getElementById("volver-editor");
        this.listaRutinasEditor = document.getElementById("lista-rutinas-editor");
        this.btnSerie = document.getElementById("btn-serie");
        this.btnPausa = document.getElementById("btn-pausa");
        this.btnMenosPeso = document.getElementById("menos-peso");
        this.btnMasPeso = document.getElementById("mas-peso");

        this.configurarEventos();
    }

    configurarEventos() {
        this.btnIniciar?.addEventListener("click", () => ui.mostrarRutinas());

        this.btnEditar?.addEventListener("click", () => {ui.mostrarEditor(); this.cargarRutinasEditor()});

        this.btnVolverMenu?.addEventListener("click", () => ui.mostrarMenu());

        this.btnVolverEditor?.addEventListener("click", () => ui.mostrarMenu());

        this.btnConfig?.addEventListener("click", () => {
            alert("Configuración próximamente.");
        });

        document.querySelectorAll(".rutina-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                this.iniciar(btn.dataset.rutina);
            });
        });

        this.btnVolverRutinas?.addEventListener("click", () => {
            this.detenerEntrenamiento();
            ui.mostrarRutinas();
        });

        this.btnSerie?.addEventListener("click", () => this.terminarSerie());

        this.btnPausa?.addEventListener("click", () => this.togglePausa());

        this.btnMenosPeso?.addEventListener("click", () => this.cambiarPeso(-2.5));

        this.btnMasPeso?.addEventListener("click", () => this.cambiarPeso(2.5));

        document.addEventListener("keydown", event => {
            if (this.modoPrueba && event.key.toLowerCase() === "s" && this.descansando) {
                timer.saltar();
            }
        });
    }

    iniciar(rutinaId) {
        this.rutinaId = String(rutinaId);
        this.rutinaActual = rutinas[this.rutinaId];

        if (!this.rutinaActual) {
            console.error("Rutina no encontrada:", rutinaId);
            return;
        }

        this.ejercicioActual = 0;
        this.serieActual = 1;
        this.descansando = false;
        this.pausado = false;

        ui.mostrarEntrenamiento();
        this.cargarEjercicio();
    }

    ejercicioData() {
        return this.rutinaActual?.ejercicios?.[this.ejercicioActual] ?? null;
    }

    clavePeso() {
        const ejercicio = this.ejercicioData();
        return `peso_${this.rutinaId}_${ejercicio?.nombre ?? "sin_nombre"}`;
    }

    pesoActual() {
        const ejercicio = this.ejercicioData();
        const guardado = storage.cargar(this.clavePeso(), 0);
        return guardado ?? ejercicio?.peso ?? 0;
    }

    cargarEjercicio() {
        const ejercicio = this.ejercicioData();

        if (!ejercicio) {
            this.detenerEntrenamiento();
            alert("🎉 ¡Entrenamiento terminado!");
            ui.mostrarRutinas();
            return;
        }

        const siguiente = this.rutinaActual.ejercicios[this.ejercicioActual + 1];

        ui.mostrarEjercicio({
            ...ejercicio,
            rutinaNombre: this.rutinaActual.nombre,
            siguienteNombre: siguiente?.nombre
        }, this.ejercicioActual + 1, this.rutinaActual.ejercicios.length);

        ui.mostrarPeso(this.pesoActual());
        ui.mostrarSerie(this.serieActual, ejercicio.series);

        this.resetearDescanso();
    }

    cambiarPeso(delta) {
        const peso = Math.max(0, this.pesoActual() + delta);
        storage.guardar(this.clavePeso(), peso);
        ui.mostrarPeso(peso);
    }

    terminarSerie() {
        if (this.descansando) return;

        const ejercicio = this.ejercicioData();
        if (!ejercicio) return;

        this.iniciarDescanso();
    }

    iniciarDescanso() {
        this.detenerTemporizador();

        this.descansando = true;
        this.pausado = false;
        ui.preparandoDescanso();

        const descansoReal = Number(this.ejercicioData().descanso) || 0;
        const segundos = this.modoPrueba ? Math.min(5, descansoReal) : descansoReal;

        ui.actualizarProgreso(0);

        timer.onTick = segundosRestantes => {
            ui.mostrarTiempo(segundosRestantes);

            if (descansoReal > 0) {
                const porcentaje =
                    ((segundos - segundosRestantes) / segundos) * 100;
                ui.actualizarProgreso(Math.min(100, Math.max(0, porcentaje)));
            }
        };

        timer.onFinish = () => this.finalizarDescanso();

        timer.iniciar(segundos);
    }

    finalizarDescanso() {
        this.descansando = false;
        this.pausado = false;

        this.reproducirSonido();

        if ("vibrate" in navigator) {
            navigator.vibrate([300, 150, 300]);
        }

        const ejercicio = this.ejercicioData();

        if (this.serieActual < ejercicio.series) {
            this.serieActual++;
        } else {
            this.serieActual = 1;
            this.ejercicioActual++;
        }

        ui.finalizarDescanso();

        if (this.ejercicioActual >= this.rutinaActual.ejercicios.length) {
            alert("🎉 ¡Entrenamiento terminado!");
            this.detenerEntrenamiento();
            ui.mostrarRutinas();
            return;
        }

        this.cargarEjercicio();
    }

    togglePausa() {
        if (!this.descansando) return;

        if (this.pausado) {
            this.pausado = false;
            timer.reanudar();
            ui.reanudar();
        } else {
            this.pausado = true;
            timer.pausar();
            ui.pausar();
        }
    }

    resetearDescanso() {
        this.detenerTemporizador();
        this.descansando = false;
        this.pausado = false;

        const descanso = Number(this.ejercicioData()?.descanso) || 0;
        ui.mostrarTiempo(descanso);
        ui.actualizarProgreso(0);
        ui.finalizarDescanso();
    }

    detenerTemporizador() {
        timer.detener();
    }

    detenerEntrenamiento() {
        this.detenerTemporizador();
        this.descansando = false;
        this.pausado = false;
    }

    reproducirSonido() {
        this.audioDescanso.currentTime = 0;
        this.audioDescanso.play().catch(() => {});
    }

    mostrarEjerciciosEditor(id, rutina) {

    if (!rutina || !rutina.ejercicios) {
        console.error("La rutina no tiene ejercicios:", id);
        return;
    }

    this.listaRutinasEditor.innerHTML = "";

    const titulo = document.createElement("h3");
    titulo.textContent = `Editar rutina: ${rutina.nombre}`;

    this.listaRutinasEditor.appendChild(titulo);

    rutina.ejercicios.forEach((ejercicio, index) => {

        const contenedor = document.createElement("div");
        contenedor.className = "editor-ejercicio";

        const eliminar = document.createElement("button");
        eliminar.className = "btn-eliminar-editor";
        eliminar.textContent = "🗑️ Eliminar";

        eliminar.addEventListener("click", () => {
    const confirmar = confirm(
        `¿Eliminar "${ejercicio.nombre}"?`
    );

    if (!confirmar) return;

    rutina.ejercicios.splice(index, 1);
    this.mostrarEjerciciosEditor(id, rutina);
});

        contenedor.innerHTML = `
    <h4>${index + 1}. ${ejercicio.nombre}</h4>

    <label>
        Nombre:
        <input type="text" class="editor-nombre" value="${ejercicio.nombre}">
    </label>

    <label>
        Series:
        <input type="number" class="editor-series" value="${ejercicio.series}">
    </label>

    <label>
        Repeticiones:
        <input type="text" class="editor-repeticiones" value="${ejercicio.repeticiones}">
    </label>

    <label class="campo-descanso">
    Descanso:
    <div class="descanso-input">
        <input type="number" class="editor-descanso" value="${ejercicio.descanso}">
        <span>segundos</span>
    </div>
    </label>

    <label>
        Peso:
        <input type="text" class="editor-peso" value="${ejercicio.peso || ""}">
    </label>
    `;

            contenedor.appendChild(eliminar);
            this.listaRutinasEditor.appendChild(contenedor);
    });

    const acciones = document.createElement("div");
acciones.className = "editor-acciones";

const guardar = document.createElement("button");
guardar.className = "btn-guardar-editor";
guardar.textContent = "💾 Guardar cambios";

const agregar = document.createElement("button");
agregar.className = "btn-agregar-editor";
agregar.textContent = "➕ Añadir ejercicio";

agregar.addEventListener("click", () => {
    rutina.ejercicios.push({
        nombre: "Nuevo ejercicio",
        series: 4,
        repeticiones: "10-12",
        descanso: 60,
        peso: ""
    });

    this.mostrarEjerciciosEditor(id, rutina);
});

acciones.appendChild(agregar);
acciones.appendChild(guardar);
guardar.addEventListener("click", () => {

    rutina.ejercicios.forEach((ejercicio, index) => {

        const contenedor = this.listaRutinasEditor
            .querySelectorAll(".editor-ejercicio")[index];

        ejercicio.nombre = contenedor
            .querySelector(".editor-nombre").value;

        ejercicio.series = Number(
            contenedor.querySelector(".editor-series").value
        );

        ejercicio.repeticiones = contenedor
            .querySelector(".editor-repeticiones").value;

        ejercicio.descanso = Number(
            contenedor.querySelector(".editor-descanso").value
        );

        ejercicio.peso = contenedor
            .querySelector(".editor-peso").value;
    });

    storage.guardar("rutinas", rutinas);

    alert("💾 Cambios guardados");
});
guardar.addEventListener("click", () => {

    rutina.ejercicios.forEach((ejercicio, index) => {

        const contenedor = this.listaRutinasEditor
            .querySelectorAll(".editor-ejercicio")[index];

        ejercicio.nombre =
            contenedor.querySelector(".editor-nombre").value.trim();

        ejercicio.series =
            Number(contenedor.querySelector(".editor-series").value);

        ejercicio.repeticiones =
            contenedor.querySelector(".editor-repeticiones").value.trim();

        ejercicio.descanso =
            Number(contenedor.querySelector(".editor-descanso").value);

        ejercicio.peso =
            contenedor.querySelector(".editor-peso").value.trim();
    });

    console.log("Rutina actualizada:", id, rutina);
    storage.guardar("rutinas", rutinas);
    alert("✅ Cambios guardados");
});

this.listaRutinasEditor.appendChild(acciones);

    const volver = document.createElement("button");
    volver.className = "menu-btn";
    volver.textContent = "← Volver a rutinas";

    volver.addEventListener("click", () => {
        this.cargarRutinasEditor();
    });

    this.listaRutinasEditor.appendChild(volver);
}

cargarRutinasEditor() {
    if (!this.listaRutinasEditor) return;

    this.listaRutinasEditor.innerHTML = "";

    Object.entries(rutinas).forEach(([id, rutina]) => {

        const boton = document.createElement("button");

        boton.className = "menu-btn";
        boton.textContent = rutina.nombre;

        boton.addEventListener("click", () => {
            this.mostrarEjerciciosEditor("Rutina seleccionada:" + id,rutina);
        });

        this.listaRutinasEditor.appendChild(boton);
        });
    
    }

}

const app = new GymVibeApp();
