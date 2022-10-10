let tablaCarrito = document.getElementById("tablaCarrito");
let formEnvio = document.getElementById("formularioEnvio");
let carrito = [];
let localCarrito = JSON.parse(localStorage.getItem("carrito"));
if (localCarrito === null) {localCarrito = [] }; 
function generarTabla(param1, param2) {
    var tabla = document.createElement("table");
    tabla.setAttribute("class","table text-center mt-1");
    tablaCarrito.appendChild(tabla);

    var thead = document.createElement("thead");
    tabla.appendChild(thead);

    var trCabecera = document.createElement("tr");
    thead.appendChild(trCabecera);

    let titulosCabeceraTabla = ["","Nombre","Precio","Cantidad", "Subtotal"];

    for (let i = 0; i < titulosCabeceraTabla.length; i++) {
        const element = titulosCabeceraTabla[i];
        var th = document.createElement("th");
        trCabecera.appendChild(th).innerHTML = element;
    }

    var tbody = document.createElement("tbody")
    tabla.appendChild(tbody);

    // let articulos = [
    //     {
    //         "id": 50924,
    //         "name": "Peugeot 208",
    //         "count": 1,
    //         "unitCost": 15200,
    //         "currency": "USD",
    //         "image": "img/prod50924_1.jpg"
    //     },
    //     {
    //         "id": 51925,
    //         "name": "Peugfsdfsdfeot 208",
    //         "count": 3,
    //         "unitCost": 15200,
    //         "currency": "USD",
    //         "image": "img/prod50924_1.jpg"
    //     }
    // ];

    carrito.forEach(dato => {
        var trCuerpo = document.createElement("tr")
        tbody.appendChild(trCuerpo);
        var tdImg = document.createElement("td");
        var tdName = document.createElement("td");
        var tdCost = document.createElement("td");
        var tdCantidad = document.createElement("td");
        var tdSubTotal = document.createElement("td");

        //td.setAttribute("id",dato.id);

        trCuerpo.appendChild(tdImg).innerHTML+=`<img class="img-thumbnail" src="${dato.image}" width="200">`;

        trCuerpo.appendChild(tdName).innerHTML+=dato.name;
        trCuerpo.appendChild(tdCost).innerHTML+=dato.unitCost;
        trCuerpo.appendChild(tdCantidad).innerHTML+=`<input type="number" value="${dato.count}" name="cantidad" id="cantidad-${dato.id}">`;
        tdSubTotal.setAttribute("id","subtotal-"+dato.id)
        document.getElementById("cantidad-"+dato.id).addEventListener("input", function(){
        trCuerpo.appendChild(tdSubTotal).innerHTML= Number(document.getElementById("cantidad-"+dato.id).value) * dato.unitCost;
        })
        trCuerpo.appendChild(tdSubTotal).innerHTML+= Number(document.getElementById("cantidad-"+dato.id).value) * dato.unitCost;
    });

}

function formulario() {
  formEnvio.innerHTML=`
        <h4>Tipo de envio</h4>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="envio" id="premium" checked>
          <label class="form-check-label" for="premium">
            Premium 2 a 5 dias (15%)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="envio" id="express">
          <label class="form-check-label" for="express">
            Express 5 a 8 dias (7%)
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="envio" id="standard">
          <label class="form-check-label" for="standard">
            Standard 12 a 15 dias (5%)
          </label>
        </div>
        <hr>
        <h4>Direccion de envio</h4>
        <div class="row g-2">
          <div class="col-sm-9">
            <label class="form-check-label" for="calle">Calle</label>
            <input type="text" name="calle" id="calle" class="form-control" placeholder="Av. Pirulin">
          </div>
          <div class="col-sm">
            <label class="form-check-label" for="numero">Numero</label>
            <input type="number" name="numero" id="numero" class="form-control" placeholder="1256">
          </div>
          <div class="col-sm-9">
            <label class="form-check-label" for="esquina">Esquina</label>
            <input type="text" name="esquina" id="esquina" class="form-control" placeholder="Pepito">
          </div>
        </div>
  `;
  
}

//Cuando cargue el dom...
document.addEventListener("DOMContentLoaded", function (e) {
  //Obtengo la info del producto
  getJSONData(CART_INFO_URL).then(function (info){
      if (info.status === "ok") {
        
          carrito = info.data.articles;
          carrito = carrito.concat(localCarrito);
          console.log(carrito);
          generarTabla();
          formulario();
          
      };
  });
});