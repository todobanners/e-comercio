let datosProducto = [];
let imagenesProducto = [];
let comentariosProducto = [];
let contenido = document.getElementById("contenido");
let imagenes = document.getElementById("imagenes");
let comentarios = document.getElementById("comentarios");
let formEnviar = document.getElementById("enviar");
let formComentario = document.getElementById("comentario");
let formRating = document.getElementById("rating");
let comentariosLocal = JSON.parse(localStorage.getItem("listaLocal"));
if (comentariosLocal === null) {comentariosLocal = [] }; // Solucion a bug que sucede si se actualiza la pagina y no hay elementos en el array da error.
//Obtenemos las imagenes
function mostrarImagenes(){
    for (const imagen of imagenesProducto) {
        imagenes.innerHTML += `<a href="${imagen}"><img src="${imagen}" class="img-thumbnail m-1" alt="" height="200" width="200"></a>`;
    }
}

//Obtenemos la informacion
function mostrarInfo(){
    contenido.innerHTML = `
    <div class="p-4">
        <h1>${datosProducto.name}</h1>
        <dt>Precio</dt>
        <dd>${datosProducto.currency} ${datosProducto.cost}</dd>
        <dt>Descripción:</dt>
        <dd>${datosProducto.description}</dd>
        <dt>Categoría:</dt>
        <dd>${datosProducto.category}</dd>
        <dt>Cantidad de vendidos</dt>
        <dd>${datosProducto.soldCount}</dd>
    </div>
    `; 
}
function mostrarRating(valor) {
    //Hago la resta entre el total de estrellas y el valor para saber cuantas estrellas vacias colocar
    let resta = 5 - valor;
    //HTML para estrellas vacias y que se repita resta cantidades
    let estrellasVacias = '<span class="fa fa-star"></span>'.repeat(resta);
    //lo mismo pero para estrellas llenas y que se repita valor cantidades
    let estrellasLlenas =  '<span class="fa fa-star checked"></span>'.repeat(valor);
    // retorno las estrellas y muestro
    return estrellasLlenas + estrellasVacias;
}
//Obtenemos los comentarios
function mostrarComentarios() {
    // creo un array con concat() uniendo el del localStorage y el traido por getJSONdata
    let comentTotal = comentariosProducto.concat(comentariosLocal)
    // limpio antes del for
    comentarios.innerHTML = "";
    for (const comentario of comentTotal){
        //Muestra solo los comentarios para el ProductID actual
        if (comentario.product == productID) {
            comentarios.innerHTML += `
        <div class="card m-1">
            <div class="card-body">
                <h5 class="card-title"> <b>${comentario.user}</b> <i class="text-muted text-end">${comentario.dateTime}</i> </h5>
                <p class="card-text">${comentario.description}</p>
                <p class="text-end">${mostrarRating(comentario.score)}</p> 
            </div>
        </div> 
        `;
        }
        
    }
}

//Funcion para crear comentario
function crearComentario() {
    //Obtengo la fecha y hora de hoy y formateo segun json
    var hoy = new Date();
    //Para el caso de month obtiene el mes numerico del 0 al 11 lo cual hace que se obtenga algo no acorde a la realidad comun
    //Por lo tanto se soluciona agregando +1 al valor y con padStart se le agrega un 0 a los meses con 1 digito.
    var fechaYHora = hoy.getFullYear() + '-' + (hoy.getMonth() + 1).toString().padStart(2, 0) + '-' + addZero(hoy.getDate())+ ' ' + addZero(hoy.getHours()) + ':' + addZero(hoy.getMinutes()) + ':' + addZero(hoy.getSeconds());
    //Guardo el user en una variable
    var usuario = localStorage.getItem("usuario")
    // funcion para formatear los elementos
    function addZero(i) {
        if (i < 10) {i = "0" + i}
        return i;
      }
    //Creo el array con los datos a enviar  
    let comentarioAEnviar = {product: parseInt(productID), score: parseInt(formRating.value), description: formComentario.value, user: usuario, dateTime: fechaYHora};
    // Guardo el array en localstorage
    localStorage.setItem("formvalores", JSON.stringify(comentarioAEnviar));
    // Agrego los valores del comentario al array
    comentariosLocal.push(comentarioAEnviar);
    //Guardo como un array en localstorage el array con los datos
    localStorage.setItem('listaLocal', JSON.stringify(comentariosLocal));
}

document.addEventListener("DOMContentLoaded", function (e) {
    //Obtengo la info del producto
    getJSONData(PRODUCT_INFO_URL).then(function (producto){
        if (producto.status === "ok") {
            datosProducto = producto.data;
            imagenesProducto = producto.data.images;
            mostrarInfo();
            mostrarImagenes();
        };
    });

    //Obtengo los comentarios del producto
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (comentario){
        if (comentario.status === "ok") {
            comentariosProducto = comentario.data;
            mostrarComentarios();
        };
    });
    //Verifico el envio con boton y mando a crear el comentario
    formEnviar.addEventListener("click", function(){
        console.log("envie el formulario");
        crearComentario();
    });
});