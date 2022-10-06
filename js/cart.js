let tablaCarrito = document.getElementById("tablaCarrito");
{/* <table class="table table-primary">
          <thead>
            <tr>
              <th scope="col">img</th>
              <th scope="col">Column 2</th>
              <th scope="col">Column 3</th>
            </tr>
          </thead>
          <tbody>
            <tr class="">
              <td scope="row">R1C1</td>
              <td>R1C2</td>
              <td>R1C3</td>
            </tr>
            <tr class="">
              <td scope="row">Item</td>
              <td>Item</td>
              <td>Item</td>
            </tr>
          </tbody>
        </table> */}
function generarTabla(param1, param2) {
    var tabla = document.createElement("table");
    tabla.setAttribute("class","table text-center mt-1");
    tablaCarrito.appendChild(tabla);

    var thead = document.createElement("thead");
    tabla.appendChild(thead);

    var trCabecera = document.createElement("tr");
    thead.appendChild(trCabecera);

    let titulosCabeceraTabla = ["","nombre","precio","cantidad", "subtotal"];

    for (let i = 0; i < titulosCabeceraTabla.length; i++) {
        const element = titulosCabeceraTabla[i];
        var th = document.createElement("th");
        trCabecera.appendChild(th).innerHTML = element;
    }

    var tbody = document.createElement("tbody")
    tabla.appendChild(tbody);

    

    let articulos = [
        {
            "id": 50924,
            "name": "Peugeot 208",
            "count": 1,
            "unitCost": 15200,
            "currency": "USD",
            "image": "img/prod50924_1.jpg"
        },
        {
            "id": 51925,
            "name": "Peugfsdfsdfeot 208",
            "count": 3,
            "unitCost": 15200,
            "currency": "USD",
            "image": "img/prod50924_1.jpg"
        }
    ];

    articulos.forEach(dato => {
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


generarTabla()
