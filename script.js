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

// ============ RUTINAS ============
const rutinas = {

    1:{
        nombre:"Empuje",

        ejercicios:[
            {nombre:"Press de banca",series:4,repeticiones:10-12,descanso:60,peso:""},
            {nombre:"Press inclinado",series:4,repeticiones:10-12,descanso:60,peso:""},
            {nombre:"Aperturas",series:4,repeticiones:10-12,descanso:60,peso:""},
            {nombre:"Press militar",series:4,repeticiones:10-12,descanso:60,peso:""},
            {nombre:"Laterales",series:4,repeticiones:10-12,descanso:60,peso:""},
            {nombre:"Tríceps polea",series:4,repeticiones:10-12,descanso:60,peso:""}
        ]
    },

    2:{
        nombre:"Jalón",

        ejercicios:[
            {nombre:"Dominadas",series:4,repeticiones:10-12,descanso:60,peso:""},
            {nombre:"Remo",series:4,repeticiones:10-12,descanso:60,peso:""},
            {nombre:"Pullover",series:4,repeticiones:10-12,descanso:60,peso:""},
            {nombre:"Curl barra",series:4,repeticiones:10-12,descanso:60,peso:""},
            {nombre:"Martillo",series:4,repeticiones:10-12,descanso:60,peso:""},
            {nombre:"Face Pull",series:4,repeticiones:10-12,descanso:60,peso:""}
        ]
    },

    3:{
        nombre:"Pierna",

        ejercicios:[
            {nombre:"Sentadilla",series:4,repeticiones:10-12,descanso:90,peso:""},
            {nombre:"Prensa",series:4,repeticiones:10-12,descanso:90,peso:""},
            {nombre:"Peso muerto rumano",repeticiones:10-12,series:4,descanso:90,peso:""},
            {nombre:"Extensión",series:4,repeticiones:10-12,descanso:60,peso:""},
            {nombre:"Femoral",series:4,repeticiones:10-12,descanso:60,peso:""},
            {nombre:"Pantorrilla",series:4,repeticiones:10-12,descanso:60,peso:""}
        ]
    }

};

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
    repeticionesEjercicio.textContent = 'Objetivos: $ {ejercicios.repeticiones} reps';
    
    serieActualEl.textContent =
        `Serie ${estado.serie} / ${ejercicio.series}`;

    if(document.getElementById("peso-ejercicio")){

        document.getElementById("peso-ejercicio").textContent =
        ejercicio.peso === ""
        ? "Peso: --"
        : `Peso: ${ejercicio.peso}`;

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

// ============ SONIDO ============

const audioDescanso = new Audio("sonido-descanso.mp3");

function reproducirSonido(){

    audioDescanso.currentTime = 0;

    audioDescanso.play().catch(e=>{

        console.log(e);

    });

}