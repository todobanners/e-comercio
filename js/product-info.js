//Creo las variables necesarias
let datosProducto = [];
let imagenesProducto = [];
let comentariosProducto = [];
let contenido = document.getElementById("contenido");
let imagenes = document.getElementById("imagenes");
let relacionados = document.getElementById("relacionados");
let comentarios = document.getElementById("comentarios");
let formEnviar = document.getElementById("enviar");
let formComentario = document.getElementById("comentario");
let formRating = document.getElementById("rating");
let comentariosLocal = JSON.parse(localStorage.getItem("listaLocal"));
// Si no existen comentarios en el LocalStorage guardo la variable vacia
if (comentariosLocal === null) {comentariosLocal = [] }; 


//Obtenemos la informacion del producto
function mostrarInfo(){
    contenido.innerHTML = `
    <div class="container">
        <div class="row">
            <div class="col-sm-8 col-lg-9"><h1>${datosProducto.name}</h1></div>
            <div class="col-sm-4 col-lg-3" id="btnComprar"><a onclick="comprar(${datosProducto.id})" class="btn btn-success" href="#btnComprar" role="button"><i class="fas fa-shopping-cart"></i> Agregar al carrito</a></div>
        </div>        
        <dl>
            <dt>Precio</dt>
            <dd>${datosProducto.currency} ${datosProducto.cost}</dd>
            <dt>Descripción:</dt>
            <dd>${datosProducto.description}</dd>
            <dt>Categoría:</dt>
            <dd>${datosProducto.category}</dd>
            <dt>Cantidad de vendidos</dt>
            <dd>${datosProducto.soldCount}</dd>
        </dl>
    </div>
    `; 
}

function comprar() {
    
    let articulo = {id: datosProducto.id, name: datosProducto.name, count: 1,unitCost: datosProducto.cost, currency: datosProducto.currency, image: datosProducto.images[0]};
    let arayCarrito = JSON.parse(localStorage.getItem("carrito"));
    if (arayCarrito === null) {arayCarrito = [] }; 
    arayCarrito.push(articulo);
    localStorage.setItem("carrito", JSON.stringify(arayCarrito));
    document.getElementById("btnComprar").innerHTML = `<a onclick="quitar()" class="btn btn-warning" href="#btnComprar" role="button"><i class="fas fa-shopping-cart"></i> Quitar del carrito</a>`;
}

function quitar() {
    let articulos = JSON.parse(localStorage.getItem("carrito"));
    var articulo = articulos.indexOf(datosProducto.id);
    articulos.splice(articulo, 1);
    console.log(articulos);
    document.getElementById("btnComprar").innerHTML = `<a onclick="comprar()" class="btn btn-success" href="#btnComprar" role="button"><i class="fas fa-shopping-cart"></i> Agregar al carrito</a>`;
}


//Obtenemos las imagenes
function mostrarImagenes(){
    
    for (const imagen of imagenesProducto) {
        imagenes.innerHTML += `
        <div class="carousel-item ">
          <img src="${imagen}" class="d-block w-100" alt="${datosProducto.name}">
        </div>`;
    }
    //Detecto la primer foto para colocar clase active, y de esa manera hacer funcionar el carousel
    let primerFoto = document.querySelector(".carousel-item");
    primerFoto.className = "carousel-item active";
}

function mostrarRelacionados() {
    relacionados.innerHTML = "";
    datosProducto.relatedProducts.forEach(producto => {
        relacionados.innerHTML += `<div class="col-4" onclick="setProdRel(${producto.id})"><img src="${producto.image}" class="img-thumbnail m-1" alt="${producto.name}" heigth="300" width="300"><p>${producto.name}</p></div>`;
    });
}

function setProdRel(id) {
    //guardo en LS
    localStorage.setItem("productID", id);
    //Redirijo a la pag de productos
    window.location = "product-info.html";
}

//Obtenemos los comentarios
function mostrarComentarios() {
    // Creo un array con concat() uniendo el array del localStorage y el array traido por getJSONdata
    let comentTotal = comentariosProducto.concat(comentariosLocal)
    // limpio antes del for
    comentarios.innerHTML = "";
    for (const comentario of comentTotal){
        //Filtro que solo muestra los comentarios para el ProductID actual
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

//Funcion para mostrar las estrellas en los comentarios
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

//Funcion para crear comentario
function crearComentario() {
    //Obtengo la fecha y hora de hoy y formateo segun json
    var hoy = new Date();
    // funcion para agregar 0
    function addZero(i) {if (i < 10) {i = "0" + i} return i}
    //Para el caso de month obtiene el mes numerico del 0 al 11 lo cual hace que se obtenga algo no acorde a la realidad
    //Por lo tanto se soluciona agregando +1 al valor y con addZero se le agrega un 0 a los meses dias y horas con 1 digito.
    var fechaYHora = hoy.getFullYear() + '-' + addZero(hoy.getMonth() + 1) + '-' + addZero(hoy.getDate())+ ' ' + addZero(hoy.getHours()) + ':' + addZero(hoy.getMinutes()) + ':' + addZero(hoy.getSeconds());
    //Guardo el user en una variable
    var usuario = localStorage.getItem("usuario")
    //Creo el array con los datos a enviar  
    let comentarioAEnviar = {product: parseInt(productID), score: parseInt(formRating.value), description: formComentario.value, user: usuario, dateTime: fechaYHora};
    // Guardo el array en localstorage
    localStorage.setItem("formvalores", JSON.stringify(comentarioAEnviar));
    // Agrego los valores del comentario al array
    comentariosLocal.push(comentarioAEnviar);
    //Guardo como un array en localstorage el array con los datos
    localStorage.setItem('listaLocal', JSON.stringify(comentariosLocal));
}

//Cuando cargue el dom...
document.addEventListener("DOMContentLoaded", function (e) {
    //Obtengo la info del producto
    getJSONData(PRODUCT_INFO_URL).then(function (producto){
        if (producto.status === "ok") {
            datosProducto = producto.data;
            imagenesProducto = producto.data.images;
            mostrarInfo();
            mostrarImagenes();
            mostrarRelacionados();
            
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
        crearComentario();
    });

});