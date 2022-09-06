//Obtengo el ID del producto seleccionado
let productID = localStorage.getItem('productID');
//Obtengo numero de categoria del localstorage
let numCategory = localStorage.getItem("catID");
const EXT_TYPE = ".json";
const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/"+ numCategory + EXT_TYPE;
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/"+ productID + EXT_TYPE;
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/"+ productID + EXT_TYPE;
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";

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
if (localStorage.getItem('usuario') != null) {
  if (localStorage.getItem('imagen') == null) {
    imagen = 'img/img_perfil.png';
  } else {
    imagen = localStorage.getItem('imagen');
   
  }
  document.querySelector('ul li:last-child').innerHTML = `<a href="" id="nombreUsuario" class="nav-link"><img src="${imagen}" alt="" width="30" height="30">${localStorage.getItem('usuario')}</a>`;
} else {
  window.location.href = "login.html";
}

// LogOut
document.getElementById("nombreUsuario").addEventListener("click", function(){
  localStorage.removeItem("usuario")
})