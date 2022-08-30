//Obtengo numero de categoria del localstorage
let numCategory = localStorage.getItem("catID");
// Si no tuviera localstorage asignado un catid lo redirijo a la pagina de categorias
if (numCategory == null) {
    let tID = setTimeout(function () {
        window.location.href = "/categories.html";
        window.clearTimeout(tID);		// limpio el time out.
    }, 5000);

    document.getElementById("textoP").innerHTML = `No ha seleccionado una categoría, será redirigido a la lista de <a href="/categories.html">categorias</a>`;
}

// Formo la URL con la categoria para hacer el JSON usando variables en init.js
const URL_PRODUCTS = PRODUCTS_URL + numCategory + EXT_TYPE;
// declaro variables necesarias
const ORDER_ASC_BY_COST = "0A1";
const ORDER_DESC_BY_COST = "1A0";
const ORDER_BY_SOLDCOUNT = "Rel.";
const BUSCADOR = "busqueda";
let arrayProductos = [];
let busquedaArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;
let buscando = document.getElementById("buscador");

// Funcion para ordenar y/o buscar productos segun criterio
function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_COST) {
        result = array.sort(function (a, b) {
            if (a.cost < b.cost) { return -1; }
            if (a.cost > b.cost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_COST) {
        result = array.sort(function (a, b) {
            if (a.cost > b.cost) { return -1; }
            if (a.cost < b.cost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_SOLDCOUNT) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if (aCount > bCount) { return -1; }
            if (aCount < bCount) { return 1; }
            return 0;
        });
    } else if (criteria === BUSCADOR) {
        result = buscarTituloCategoria(buscando.value);
    }

    return result;
}

//Muestro los productos
function showProducts() {
    let htmlContentToAppend = "";
    for (const product of arrayProductos) {
        if (((minCount == undefined) || (minCount != undefined && parseInt(product.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(product.cost) <= maxCount))) {
            htmlContentToAppend += `<div class="col">
                                        <div class="card h-100">
                                        <div class="card-header"><h5 class="card-title">${product.name}</h5></div>
                                        <img src="${product.image}" alt="${product.description}" class="card-img-top">
                                            <div class="card-body">
                                                <p class="card-text">${product.description}</p>
                                            </div>
                                            <div class="card-footer text-muted">
                                                <h4 class="mb-1">${product.currency} ${product.cost}</h4>
                                                <small class="text-muted">${product.soldCount} Vendidos</small>
                                            </div>
                                        </div>
                                    </div> `;
        }
        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }

    document.getElementById("textoP").innerHTML = `Estas viendo los productos de la categoría <b>${nombreCategoria}.</b>`;

}

{/* <div class="col">
                 <div class="row">
                     <div class="col-3">
                         <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                     </div>
                     <div class="col">
                         <div class="d-flex w-100 justify-content-between">
                             
                         </div>
                         <p class="mb-1"></p>
                     </div>
                 </div>
             </div> */}


// Ordena y muestra los productos
function sortAndShowProducts(sortCriteria, productsArray) {
    currentSortCriteria = sortCriteria;
    // Sino estuviera definido un array donde buscar se autodefine el array de productos
    if (productsArray != undefined) {
        arrayProductos = productsArray;
    }

    arrayProductos = sortProducts(currentSortCriteria, arrayProductos);

    //Muestro los productos ordenados
    showProducts();
}
// Funcion para el buscador por titulo y descripcion
function buscarTituloCategoria(palabra) {
    // return de la funcion con el array de busqueda
    return busquedaArray.filter(function (producto) {
        // busca en el array anterior las coincidencias mediante el metodo para array indexOf (https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
        // devolviendo como resultado un array con solo las coincidencias, si fuera que no existe (-1) solo muestra el array obtenido hasta el ultimo elemento con coincidencias
        // se usa operador OR para buscar tanto en titulo como en descripcion, se limpian los caracteres para que tanto la busqueda en el array como en el input sean en minuscula
        // porque el metodo es case sensitive.
        return producto.name.toLowerCase().indexOf(palabra.toLowerCase()) > -1 || producto.description.toLowerCase().indexOf(palabra.toLowerCase()) > -1;
    })
}

// Espero a cargar el DOM
document.addEventListener("DOMContentLoaded", function (e) {
    // Llamo a la funcion en init.js para cargar el Json con los datos
    getJSONData(URL_PRODUCTS).then(function (resultObj) {
        if (resultObj.status === "ok") {
            // Se crea el array de productos
            arrayProductos = resultObj.data.products;
            // Se crea el array de productos para el buscador dado  que el metodo filter() crea un nuevo array modificando el original
            busquedaArray = resultObj.data.products;
            // Variable con el nombre de la categoria para colocar en la descripcion
            nombreCategoria = resultObj.data.catName;
            // Muestro los productos
            showProducts();
        }
    });

    // Capturo el evento input del buscador para hacer la busqueda en tiempo real
    document.getElementById("buscador").addEventListener("input", function () {
        // le paso al buscador el array destinado
        sortAndShowProducts(BUSCADOR, busquedaArray);
    });
    // Dependiendo el filtro capturo evento click y asigno el filtro
    document.getElementById("sortAsc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_ASC_BY_COST);
    });

    document.getElementById("sortDesc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_DESC_BY_COST);
    });

    document.getElementById("sortByCount").addEventListener("click", function () {
        sortAndShowProducts(ORDER_BY_SOLDCOUNT);
    });
    // Limpio el filtro por rango de precios
    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterPriceMin").value = "";
        document.getElementById("rangeFilterPriceMax").value = "";
        minCount = undefined;
        maxCount = undefined;
    });

    document.getElementById("rangeFilterPrice").addEventListener("click", function () {
        //Obtengo el mínimo y máximo de los intervalos para filtrar por precio
        //de productos de la categoria seleccionada
        minCount = document.getElementById("rangeFilterPriceMin").value;
        maxCount = document.getElementById("rangeFilterPriceMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
            minCount = parseInt(minCount);
        }
        else {
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
            maxCount = parseInt(maxCount);
        }
        else {
            maxCount = undefined;
        }

        showProducts();
    });
});