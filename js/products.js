const URL_PRODUCTOS_AUTOS = "https://japceibal.github.io/emercado-api/cats_products/101.json";

function showCarCat() {
    let htmlContentToAppend = "";
    fetch(URL_PRODUCTOS_AUTOS).then(resp => resp.json()).then(data => {
        for (const car of data.products){
            htmlContentToAppend += `
             <div onclick="setCatID(${car.id})" class="list-group-item list-group-item-action cursor-active">
                 <div class="row">
                     <div class="col-3">
                         <img src="${car.image}" alt="${car.description}" class="img-thumbnail">
                     </div>
                     <div class="col">
                         <div class="d-flex w-100 justify-content-between">
                             <h4 class="mb-1">${car.name} - ${car.currency} ${car.cost}</h4>
                             <small class="text-muted">${car.soldCount} artículos</small>
                         </div>
                         <p class="mb-1">${car.description}</p>
                     </div>
                 </div>
             </div>
             `
             document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
        }
    })
    
}
showCarCat();