let numCategory = localStorage.getItem("catID");
if (numCategory == null){
    let tID = setTimeout(function () {
        window.location.href = "/categories.html";
        window.clearTimeout(tID);		// clear time out.
    }, 5000);

    document.getElementById("textoP").innerHTML = `No ha seleccionado una categoría, será redirigido a la lista de <a href="/categories.html">categorias</a>`;
}

const URL_PRODUCTS = "https://japceibal.github.io/emercado-api/cats_products/" + numCategory + ".json";

function showProducts() {
    let htmlContentToAppend = "";
    fetch(URL_PRODUCTS).then(resp => resp.json()).then(data => {
        for (const product of data.products){
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
             document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
        }
        document.getElementById("textoP").innerHTML = `Estas viendo los productos de la categoría <b>${data.catName}.</b>`;
    })
    
}

showProducts();