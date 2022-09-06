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
        <h2>${datosProducto.name}</h2>
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
    
    switch (valor) {
        case 0:
        return `
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span>`;
        case 1:
        return `
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span>`;
        
        case 2:

            return `
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>`;
        case 3:
        return `
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span>`;
        
        case 4:
            return `
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star"></span>`;
        
        case 5:
            return `
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>`;
        
        default:
        return "nada"
    }
}
//Obtenemos los comentarios
function mostrarComentarios() {
    
    let comentTotal = comentariosProducto.concat(comentariosLocal)
    comentarios.innerHTML = "";
    for (const comentario of comentTotal){
        if (comentario.product == productID) {
            comentarios.innerHTML += `
        <div class="card m-1">
        <div class="card-body">
          <h5 class="card-title"> <b>${comentario.user}</b> <i class="text-muted text-end">${comentario.dateTime}</i> </h5>
         
          <p class="card-text">${comentario.description}</p>
        <p class="text-end">${mostrarRating(comentario.score)}</p> </div>
      </div> 
        `;
        }
        
    }
}

function crearComentario() {
    var hoy = new Date();
    var fechaYHora = hoy.getFullYear() + '-' + addZero(hoy.getMonth()) + '-' + addZero(hoy.getDate())+ ' ' + addZero(hoy.getHours()) + ':' + addZero(hoy.getMinutes()) + ':' + addZero(hoy.getSeconds());
    var usuario = localStorage.getItem("usuario")

    function addZero(i) {
        if (i < 10) {i = "0" + i}
        return i;
      }

    // //Guardo como un array en localstorage
    // localStorage.setItem('comentario', JSON.stringify(comentarioAEnviar));
    // comentariosLocal.push(comentarioAEnviar)
    // localStorage.setItem('comentario', JSON.stringify(comentarioAEnviar));
    // mostrarComentarios();

let comentarioAEnviar = {product: parseInt(productID), score: parseInt(formRating.value), description: formComentario.value, user: usuario, dateTime: fechaYHora};
    // Guardo valor en localStorage
    localStorage.setItem("formvalores", JSON.stringify(comentarioAEnviar));
    // Obtengo el valor y lo guardo en variable
    
    // Agrego item a la lista
    comentariosLocal.push(comentarioAEnviar);
    //Guardo como un array en localstorage
    localStorage.setItem('listaLocal', JSON.stringify(comentariosLocal));
    

}
// let mandaresto = {
//     "product": 50741,
//     "score": 5,
//     "description": "Precioso, a mi nena le encantó",
//     "user": "silvia_fagundez",
//     "dateTime": "2021-02-20 14:00:42"
// };
// function crearcomentario(array) {
//     array.push(mandaresto);
//     mostrarComentarios();
// }

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

    formEnviar.addEventListener("click", function(){
        console.log("envie el formulario");
        crearComentario();

    });
});