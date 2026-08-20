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

        this.tiempo = segundos;
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

                this.detener();

                if (this.onFinish) {

                    this.onFinish();

                }

            }

        },1000);

    }

    detener() {

        clearInterval(this.intervalo);

        this.enEjecucion = false;

    }

    pausar() {

        clearInterval(this.intervalo);

    }

    reanudar() {

        if(this.enEjecucion===false)return;

        this.intervalo=setInterval(()=>{

            this.tiempo--;

            if(this.onTick){

                this.onTick(this.tiempo);

            }

            if(this.tiempo<=0){

                this.detener();

                if(this.onFinish){

                    this.onFinish();

                }

            }

        },1000);

    }

}

const timer = new Timer();

// =========Sonido===============
//const audioDescanso = new Audio("audio/descanso.mp3");

//function reproducirSonido(){

    //audioDescanso.currentTime = 0;
    //audioDescanso.play().catch(error=>{

        //console.log("No se pudo reproducir el sonido: ",error);
    //});

//} 