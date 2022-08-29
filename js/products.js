//Obtengo numero de categoria del localstorage
let numCategory = localStorage.getItem("catID");
// Si no tuviera localstorage asignado un catid lo redirijo a la apgina de categorias
if (numCategory == null) {
    let tID = setTimeout(function () {
        window.location.href = "/categories.html";
        window.clearTimeout(tID);		// clear time out.
    }, 5000);

    document.getElementById("textoP").innerHTML = `No ha seleccionado una categoría, será redirigido a la lista de <a href="/categories.html">categorias</a>`;
}

// Formo la URL con la categoria para hacer el JSON
const URL_PRODUCTS = PRODUCTS_URL + numCategory + EXT_TYPE;

const ORDER_ASC_BY_COST = "0A1";
const ORDER_DESC_BY_COST = "1A0";
const ORDER_BY_SOLDCOUNT = "Rel.";
const BUSCADOR = "busqueda";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;
let buscando = document.getElementById("buscador");

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
    for (const product of currentCategoriesArray) {
        if (((minCount == undefined) || (minCount != undefined && parseInt(product.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(product.cost) <= maxCount))) {
            htmlContentToAppend += `
             <div class="list-group-item list-group-item-action cursor-active">
                 <div class="row">
                     <div class="col-3">
                         <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                     </div>
                     <div class="col">
                         <div class="d-flex w-100 justify-content-between">
                             <h4 class="mb-1">${product.name} - ${product.currency} ${product.cost}</h4>
                             <small class="text-muted">${product.soldCount} artículos</small>
                         </div>
                         <p class="mb-1">${product.description}</p>
                     </div>
                 </div>
             </div>
             `
        }
        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;

    }

    document.getElementById("textoP").innerHTML = `Estas viendo los productos de la categoría <b>${nombreCategoria}.</b>`;

}

function sortAndShowProducts(sortCriteria, productsArray) {
    currentSortCriteria = sortCriteria;

    if (productsArray != undefined) {
        currentCategoriesArray = productsArray;
    }

    currentCategoriesArray = sortProducts(currentSortCriteria, currentCategoriesArray);

    //Muestro los productos ordenadas
    showProducts();
}

function buscarTituloCategoria(palabra) {
    return currentCategoriesArray.filter(function (producto) {
        return producto.name.toLowerCase().indexOf(palabra.toLowerCase()) > -1 || producto.description.toLowerCase().indexOf(palabra.toLowerCase()) > -1;
    })
}

document.addEventListener("DOMContentLoaded", function (e) {
    function refrescar() {
        getJSONData(URL_PRODUCTS).then(function (resultObj) {
            if (resultObj.status === "ok") {
                currentCategoriesArray = resultObj.data.products;
                nombreCategoria = resultObj.data.catName;
                document.getElementById("buscador").addEventListener("input", function () {
                    sortAndShowProducts(BUSCADOR);
                });
                showProducts();
                //sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
            }
        });
    }
    refrescar();

    document.getElementById("sortAsc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_ASC_BY_COST);
    });

    document.getElementById("sortDesc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_DESC_BY_COST);
    });

    document.getElementById("sortByCount").addEventListener("click", function () {
        sortAndShowProducts(ORDER_BY_SOLDCOUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        refrescar();
        document.getElementById("buscador").value = '';
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function () {
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

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