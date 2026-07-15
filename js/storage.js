class StorageManager{
    constructor(){
        this.prefijo = "gymvibe_";
    }


    guardar(clave, valor) {

    localStorage.setItem(this.prefijo + clave, JSON.stringify(valor));
    
    }

    cargar(clave, valorPorDefecto = null) {

        const dato = localStorage.getItem(this.prefijo + clave);

        if (dato === null) {
            return valorPorDefecto;
        }
  
        return JSON.parse(dato);

    }

    eliminar(clave) {

        localStorage.removeItem(this.prefijo + clave);
    }

    limpiarTodo(){
        Object.keys(localStorage).forEach(clave => { 
            if(clave.startsWith(this.prefijo)) {
                localStorage.removeItem(clave);
            }
        });
    }

}

const storage = new
StorageManager();