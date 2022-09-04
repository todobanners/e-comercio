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
let minPrice = undefined;
let maxPrice = undefined;
let buscando = document.getElementById("buscador");

//Muestro los productos
function showProducts() {
    //Inicio la variable vacia para colocar los productos
    let htmlContentToAppend = "";
    for (const product of arrayProductos) {
        // Si el precio minimo no esta definido, ó es distinto de no definido y el valor del producto es mayor o igual al valor de precio minimo
        // vice versa para siguiente linea pero con precio Maximo
        // Lo anterior es el filtrado por rango de precio con ajustes para que se muestre todo si no estuvieran definidas las variables.
        if (((minPrice == undefined) || (minPrice != undefined && parseInt(product.cost) >= minPrice)) &&
            ((maxPrice == undefined) || (maxPrice != undefined && parseInt(product.cost) <= maxPrice))) {
            //Muestro las terjetas con la info pedida.
            htmlContentToAppend += `
            <div class="col">
                <div class="card h-100 mb-2">
                <div class="card-header mb-1"><h5 class="card-title mt-2 text-center">${product.name}</h5></div>
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
        //Muestro la informacion por cada iteracion del bucle for en el elemento con id prod-list-container
        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }
    //Muestro el nombre de la categoria que se esta visualizando
    document.getElementById("textoP").innerHTML = `Estas viendo los productos de la categoría <b>${nombreCategoria}.</b>`;
}

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
        };

    });
    
    // Capturo el evento input del buscador para hacer la busqueda en tiempo real
    document.getElementById("buscador").addEventListener("input", function () {
        sortAndShowProducts(BUSCADOR);
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
        minPrice = undefined;
        maxPrice = undefined;
        showProducts();
    });

    document.getElementById("rangeFilterPrice").addEventListener("click", function () {
        //Obtengo el mínimo y máximo de los intervalos para filtrar por precio
        //de productos de la categoria seleccionada
        minPrice = document.getElementById("rangeFilterPriceMin").value;
        maxPrice = document.getElementById("rangeFilterPriceMax").value;

        if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0) {
            minPrice = parseInt(minPrice);
        }
        else {
            minPrice = undefined;
        }

        if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0) {
            maxPrice = parseInt(maxPrice);
        }
        else {
            maxPrice = undefined;
        }

        showProducts();
    });
});