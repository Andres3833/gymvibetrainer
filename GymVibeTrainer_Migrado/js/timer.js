class Timer {
    constructor() {
        this.tiempo = 0;
        this.intervalo = null;
        this.enEjecucion = false;
        this.onTick = null;
        this.onFinish = null;
    }

    iniciar(segundos) {
        this.detener();

        this.tiempo = Number(segundos) || 0;
        this.enEjecucion = true;

        if (this.onTick) {
            this.onTick(this.tiempo);
        }

        this.intervalo = setInterval(() => {
            this.tiempo--;

            if (this.onTick) {
                this.onTick(this.tiempo);
            }

            if (this.tiempo <= 0) {
                const callback = this.onFinish;
                this.detener();

                if (callback) {
                    callback();
                }
            }
        }, 1000);
    }

    detener() {
        if (this.intervalo !== null) {
            clearInterval(this.intervalo);
            this.intervalo = null;
        }
        this.enEjecucion = false;
    }

    pausar() {
        if (!this.enEjecucion || this.intervalo === null) return;

        clearInterval(this.intervalo);
        this.intervalo = null;
    }

    reanudar() {
        if (!this.enEjecucion || this.intervalo !== null) return;

        this.intervalo = setInterval(() => {
            this.tiempo--;

            if (this.onTick) {
                this.onTick(this.tiempo);
            }

            if (this.tiempo <= 0) {
                const callback = this.onFinish;
                this.detener();

                if (callback) {
                    callback();
                }
            }
        }, 1000);
    }

    saltar() {
        if (!this.enEjecucion) return;

        const callback = this.onFinish;
        this.detener();

        if (callback) {
            callback();
        }
    }
}

const timer = new Timer();
