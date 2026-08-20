class GymVibeApp {

    constructor() {

        this.rutinaActual = null;
        this.ejercicioActual = 0;
        this.serieActual = 1;

    }

    iniciar(nombreRutina) {

        this.rutinaActual = rutinas[nombreRutina];

        if (!this.rutinaActual) {

            console.error("Rutina no encontrada.");

            return;

        }

        this.ejercicioActual = 0;
        this.serieActual = 1;

        this.cargarEjercicio();

    }

    cargarEjercicio() {

        const ejercicio =
            this.rutinaActual[this.ejercicioActual];

        if (!ejercicio) {

            alert("🎉 Entrenamiento terminado");

            return;

        }

        ui.mostrarEjercicio(ejercicio);

        const pesoGuardado =
            storage.cargar(ejercicio.id,
            ejercicio.pesoInicial);

        ui.mostrarPeso(pesoGuardado);

        ui.mostrarSerie(
            this.serieActual,
            ejercicio.series
        );

    }

    terminarSerie() {

        const ejercicio =
            this.rutinaActual[this.ejercicioActual];

        timer.iniciar(ejercicio.descanso);

        timer.onTick = (segundos)=>{

            ui.mostrarTiempo(segundos);

        };

        timer.onFinish = ()=>{

            if(this.serieActual < ejercicio.series){

                this.serieActual++;

            }else{

                this.serieActual = 1;

                this.ejercicioActual++;

            }

            this.cargarEjercicio();

        };

    }

}

const app = new GymVibeApp();