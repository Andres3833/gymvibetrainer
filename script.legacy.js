// ==========================================
// GYMVIBE TRAINER v0.4
// PARTE 1
// ==========================================

// ============ PANTALLAS ============
const menu = document.getElementById("menu-principal");
const pantallaRutinas = document.getElementById("pantalla-rutinas");
const entrenamiento = document.getElementById("pantalla-entrenamiento");

// ============ BOTONES ============
const btnIniciar = document.getElementById("btn-iniciar");
const btnEditar = document.getElementById("btn-editar");
const pantallaEditor = document.getElementById("pantalla-editor");
const btnVolverEditor = document.getElementById("volver-editor");
const btnVolverMenu = document.getElementById("volver-menu");
const btnVolverRutinas = document.getElementById("volver-rutinas");
const btnSerie = document.getElementById("btn-serie");
const btnPausa = document.getElementById("btn-pausa");

// ============ ELEMENTOS ============
const contadorEjercicio = document.getElementById("contador-ejercicio");
const serieActualEl = document.getElementById("serie-actual");
const nombreEjercicio = document.getElementById("nombre-ejercicio");
const tituloDia = document.getElementById("titulo-dia");
const siguienteEjercicio = document.getElementById("siguiente-ejercicio");
const timer = document.getElementById("temporizador");
const progreso = document.getElementById("progreso");
const repeticionesEjercicio = document.getElementById("repeticiones-ejercicio");



// ============ ESTADO ============
const estado={

    rutina:1,
    ejercicio:0,
    serie:1,
    descansando:false,
    pausado:false

};

// Variables que ya usa el temporizador
let tiempoRestante=60;
let temporizadorId=null;

// ============ NAVEGACIÓN ============
btnIniciar.addEventListener("click",()=>{

    menu.classList.add("oculto");
    pantallaRutinas.classList.remove("oculto");

});

btnEditar.addEventListener("click",()=>{

    menu.classList.add("oculto");
    pantallaEditor.classList.remove("oculto");

});    

btnVolverEditor.addEventListener("click",()=>{

    pantallaEditor.classList.add("oculto");
    menu.classList.remove("oculto");

});

btnVolverMenu.addEventListener("click",()=>{

    pantallaRutinas.classList.add("oculto");
    menu.classList.remove("oculto");

});

document.querySelectorAll(".rutina-btn").forEach((btn,index)=>{

    btn.addEventListener("click",()=>{

        estado.rutina=index+1;
        estado.ejercicio=0;
        estado.serie=1;

        pantallaRutinas.classList.add("oculto");
        entrenamiento.classList.remove("oculto");

        reiniciarEntrenamiento();

    });

});

btnVolverRutinas.addEventListener("click",()=>{

    detenerTemporizador();

    entrenamiento.classList.add("oculto");
    pantallaRutinas.classList.remove("oculto");

});
// ============ LÓGICA DE ENTRENAMIENTO ============

function ejercicioActualData(){

    return rutinas[estado.rutina].ejercicios[estado.ejercicio];

}

function reiniciarEntrenamiento(){

    estado.ejercicio = 0;
    estado.serie = 1;

    actualizarContadores();

    resetearTemporizador();

}

function actualizarContadores(){

    const rutina = rutinas[estado.rutina];
    const ejercicio = ejercicioActualData();

    tituloDia.textContent =
        rutina.nombre;

    contadorEjercicio.textContent =
        `Ejercicio ${estado.ejercicio + 1} de ${rutina.ejercicios.length}`;

    nombreEjercicio.textContent =
        ejercicio.nombre;
    repeticionesEjercicio.textContent = `Objetivo: ${ejercicio.repeticiones} reps`;
    
    serieActualEl.textContent =
        `Serie ${estado.serie} / ${ejercicio.series}`;

    const peso = document.getElementById("peso");

    if (peso) {
    peso.textContent =
        ejercicio.peso === ""
            ? "0 kg"
            : `${ejercicio.peso} kg`;
    }

    const siguiente = rutina.ejercicios[estado.ejercicio + 1];

    if(siguiente){

        siguienteEjercicio.textContent =
            siguiente.nombre;

    }else{

        siguienteEjercicio.textContent =
            "Fin del entrenamiento 🎉";

    }

}

    const MODO_PRUEBA = false;


btnSerie.addEventListener("click",()=>{

    if(descansando) return;

    const ejercicio = ejercicioActualData();

    estado.serie++;

    if(estado.serie > ejercicio.series){

        estado.serie = 1;

        estado.ejercicio++;

        if(estado.ejercicio >= rutinas[estado.rutina].ejercicios.length){

            alert("🎉 ¡Entrenamiento terminado!");

            estado.ejercicio = 0;

        }

    }

    actualizarContadores();

    iniciarDescanso();



});

// =============================== CONTROL DE PESO   ===============================

const btnMenosPeso = document.getElementById("menos-peso");
const btnMasPeso = document.getElementById("mas-peso");

btnMenosPeso.onclick = () => {

    const ejercicio = ejercicioActualData();

    let peso = parseFloat(ejercicio.peso);

    if (isNaN(peso)) {
        peso = 0;
    }

    peso = Math.max(0, peso - 2.5);

    ejercicio.peso = peso;

    storage.guardar(ejercicio.nombre, peso);

    actualizarContadores();
};

btnMasPeso.onclick = () => {

    const ejercicio = ejercicioActualData();

    let peso = parseFloat(ejercicio.peso);

    if (isNaN(peso)) {
        peso = 0;
    }

    peso += 2.5;

    ejercicio.peso = peso;

    actualizarContadores();
};

// ============ TEMPORIZADOR ============

function resetearTemporizador(){

    detenerTemporizador();

    descansando = false;
    pausado = false;

    tiempoRestante = ejercicioActualData().descanso;

    btnSerie.disabled = false;
    btnSerie.textContent = "Terminé la serie";

    btnPausa.classList.add("oculto");
    btnPausa.textContent = "⏸ Pausar";

    actualizarUITemporizador();

}

function iniciarDescanso(){

    detenerTemporizador();

    descansando = true;
    pausado = false;

    tiempoRestante = ejercicioActualData().descanso;

    btnSerie.disabled = true;
    btnSerie.textContent = "Descansando...";

    btnPausa.classList.remove("oculto");

    actualizarUITemporizador();

    temporizadorId = setInterval(tick,1000);

}

function tick(){

    if(pausado) return;

    tiempoRestante--;

    actualizarUITemporizador();

    if(tiempoRestante<=0){

        finalizarDescanso();

    }

}

function finalizarDescanso(){

    detenerTemporizador();

    descansando = false;

    pausado = false;

    reproducirSonido();

    if("vibrate" in navigator){

        navigator.vibrate([300,150,300]);

    }

    btnSerie.disabled = false;

    btnSerie.textContent = "Terminé la serie";

    btnPausa.classList.add("oculto");

}

function detenerTemporizador(){

    if(temporizadorId){

        clearInterval(temporizadorId);

        temporizadorId = null;

    }

}

function actualizarUITemporizador(){

    timer.textContent = tiempoRestante;

    const descanso = ejercicioActualData().descanso;

    const porcentaje = ((descanso-tiempoRestante)/descanso)*100;

    progreso.style.width = porcentaje+"%";

}

// ============ PAUSA ============

btnPausa.addEventListener("click",()=>{

    pausado=!pausado;

    btnPausa.textContent=pausado
    ? "▶ Reanudar"
    : "⏸ Pausar";

});

// =======Sonido=============
const audioDescanso = new Audio("audio/sonido-descanso.mp3");

function reproducirSonido(){

    audioDescanso.currentTime = 0;
    audioDescanso.play().catch(e=>{

        console.log(e);
    });

} 

document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "s" && descansando) {
        finalizarDescanso();
    }
});