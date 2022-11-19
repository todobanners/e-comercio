//Obtengo el ID del producto seleccionado
let productID = localStorage.getItem('productID');
//Obtengo numero de categoria del localstorage
let numCategory = localStorage.getItem("catID");

// https://japceibal.github.io/emercado-api

const EXT_TYPE = ".json";
const CATEGORIES_URL = "https://ecomerciojap.onrender.com/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://ecomerciojap.onrender.com/sell/publish.json";
const PRODUCTS_URL = "https://ecomerciojap.onrender.com/cats_products/"+ numCategory + EXT_TYPE;
const PRODUCT_INFO_URL = "https://ecomerciojap.onrender.com/products/"+ productID + EXT_TYPE;
const PRODUCT_INFO_COMMENTS_URL = "https://ecomerciojap.onrender.com/products_comments/"+ productID + EXT_TYPE;
const CART_INFO_URL = "https://ecomerciojap.onrender.com/user_cart/25801"+EXT_TYPE;
const CART_BUY_URL = "https://ecomerciojap.onrender.com/cart/buy.json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

// Si tengo guardado un usuario en localstorage muestro el nombre arriba, sino lo redirijo al login
if (localStorage.getItem('userEmail') != null) {
  //Si el user no tiene imagen muestro una por defecto
  if (localStorage.getItem('userImagen') == null) {
    imagen = 'img/img_perfil.png';
  } else { imagen = localStorage.getItem('userImagen'); }
  document.querySelector('ul li:last-child').className = "nav-item dropdown";
  //Muestro el nombre e imagen en el menu
  document.querySelector('ul li:last-child').innerHTML = `
  <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
  <img src="${imagen}" alt="" width="30" height="30"> ${localStorage.getItem('userEmail')}
</a>
<ul class="dropdown-menu ">
  <li><a class="dropdown-item" href="cart.html"><i class="fas fa-shopping-cart"></i> Mi carrito</a></li>
  <li><a class="dropdown-item" href="my-profile.html"><i class="fas fa-user"></i> Mi perfil</a></li>
  <li><a class="dropdown-item" id="nombreUsuario" href=""><i class="fas fa-sign-out-alt"></i> LogOut</a></li>
</ul>`;
} else {
  window.location.href = "login.html";
}

// Borro del localStorage el usuario
document.getElementById("nombreUsuario").addEventListener("click", function(){
  localStorage.removeItem("userEmail")
})