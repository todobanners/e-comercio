let tablaCarrito = document.getElementById("tablaCarrito");
let subTotal = document.getElementById("subTotal");
let sumaTotalProductos = 0;
let carrito = [];
let localCarrito = JSON.parse(localStorage.getItem("carrito"));
if (localCarrito === null) { localCarrito = [] };
let arraySubtotal = [];
let formEnvio = document.getElementsByName("envio")
let divForm = document.getElementById("formularioEnvio");
let pagoCredito = document.getElementById("credito")
let pagoBanco = document.getElementById("banco")
let formulario = document.getElementById("formulario")

function generarTabla() {
  var tabla = document.createElement("table");
  tabla.setAttribute("class", "table text-center mt-1 table-striped table-hover align-middle");
  tablaCarrito.appendChild(tabla);

  var thead = document.createElement("thead");
  tabla.appendChild(thead);

  var trCabecera = document.createElement("tr");
  thead.appendChild(trCabecera);

  let titulosCabeceraTabla = ["", "Nombre", "Precio", "Cantidad", "Subtotal"];

  for (let i = 0; i < titulosCabeceraTabla.length; i++) {
    const element = titulosCabeceraTabla[i];
    var th = document.createElement("th");
    trCabecera.appendChild(th).innerHTML = element;
  }

  var tbody = document.createElement("tbody")
  tbody.setAttribute("class", "table-group-divider");
  tabla.appendChild(tbody);

  carrito.forEach(dato => {
    var trCuerpo = document.createElement("tr")
    tbody.appendChild(trCuerpo);
    var tdImg = document.createElement("td");
    var tdName = document.createElement("td");
    var tdCost = document.createElement("td");
    var tdCantidad = document.createElement("td");
    var tdSubTotal = document.createElement("td");
    var divInput = document.createElement("div");
    var divColINput = document.createElement("div");

    trCuerpo.appendChild(tdImg).innerHTML += `<img class="img-thumbnail" src="${dato.image}" width="250">`;
    let conversion = 0;
    if (dato.currency == "UYU") {
      conversion = Math.round(dato.unitCost / 40);
    } else {
      conversion = dato.unitCost;
    }
    trCuerpo.appendChild(tdName).innerHTML += dato.name;
    trCuerpo.appendChild(tdCost).innerHTML += "USD " + conversion;
    trCuerpo.appendChild(tdCantidad)
    tdSubTotal.setAttribute("id", "subtotal-" + dato.id)
    divInput.setAttribute("class", "row justify-content-center");
    divColINput.setAttribute("class", "col-10 col-sm-10 col-md-6 col-lg-4")
    tdCantidad.appendChild(divInput);
    divInput.appendChild(divColINput);
    divColINput.innerHTML += `
        <input 
        class="form-control " 
        min="1" 
        type="number" 
        value="${dato.count}" 
        name="cantidad" 
        id="cantidad-${dato.id}" 
        required
        >`;

    document.getElementById("cantidad-" + dato.id).addEventListener("input", function () {
      tdSubTotal.dataset.costo = Number(document.getElementById("cantidad-" + dato.id).value) * conversion;
      trCuerpo.appendChild(tdSubTotal).innerHTML = "USD " + Number(document.getElementById("cantidad-" + dato.id).value) * conversion;
      obtenerTotal();
      mostrarCostos()
    })
    tdSubTotal.dataset.costo = Number(document.getElementById("cantidad-" + dato.id).value) * conversion;
    trCuerpo.appendChild(tdSubTotal).innerHTML += "USD " + Number(document.getElementById("cantidad-" + dato.id).value) * conversion;


  });

}

function obtenerTotal() {
  arraySubtotal = document.querySelectorAll("[data-costo]");
  let suma = 0
  arraySubtotal.forEach(producto => { suma += Number(producto.dataset.costo) });
  return suma
}

function mostrarCostos() {
  let muestroSubtotal = document.getElementById("subtotal");
  let costoEnvio = document.getElementById("costoEnvio");
  let costoTotal = document.getElementById("costoTotal");

  let tipoEnvio = 0

  for (let i = 0; i < formEnvio.length; i++) {
    const element = formEnvio[i];
    if (element.checked) {
      tipoEnvio = element.value
    }
  }

  muestroSubtotal.innerHTML = obtenerTotal() + " USD";
  var envio = Math.round(obtenerTotal() * tipoEnvio);
  costoEnvio.innerHTML = envio + " USD";
  costoTotal.innerHTML = Math.round(obtenerTotal() + envio) + " USD";
}

divForm.addEventListener("input", function (a) {
  mostrarCostos();
});


const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const alert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}

const forms = document.querySelectorAll('.needs-validation')

// Loop over them and prevent submission
Array.from(forms).forEach(form => {
  form.addEventListener('submit', event => {
    if (!form.checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
      alert('Algo no esta bien, revisa porfavor', 'danger')
      if (!form.banco.checkValidity() && !form.credito.checkValidity()) {
        document.getElementById("formaPagoValido").classList.add("d-block")
      }

    } else {
      event.preventDefault() // Se agrega apra evitar que se recargue la pagina y e pierda el mensaje.
      alert('Sus pedidos seran enviados segun lo seleccionado, gracias por comprar en e-mercado', 'success')
    }

    form.classList.add('was-validated')
  }, false)
})



function formaDePago() {
  if (pagoCredito.checked) {
    document.getElementById("numeroCuentaBanco").setAttribute("disabled", "")
    document.getElementById("numeroTarjeta").removeAttribute("required", "")

    document.getElementById("numeroTarjeta").removeAttribute("disabled", "")
    document.getElementById("codigoSeguridad").removeAttribute("disabled", "")
    document.getElementById("vencimientoTarjeta").removeAttribute("disabled", "")

    document.getElementById("numeroTarjeta").setAttribute("required", "")
    document.getElementById("codigoSeguridad").setAttribute("required", "")
    document.getElementById("vencimientoTarjeta").setAttribute("required", "")

    document.getElementById("formaPagoValido").classList.remove("d-block")

    return "Credito"
  }
  if (pagoBanco.checked) {
    document.getElementById("numeroTarjeta").setAttribute("disabled", "")
    document.getElementById("codigoSeguridad").setAttribute("disabled", "")
    document.getElementById("vencimientoTarjeta").setAttribute("disabled", "")

    document.getElementById("numeroTarjeta").removeAttribute("required", "")
    document.getElementById("codigoSeguridad").removeAttribute("required", "")
    document.getElementById("vencimientoTarjeta").removeAttribute("required", "")

    document.getElementById("numeroCuentaBanco").removeAttribute("disabled", "")
    document.getElementById("numeroCuentaBanco").setAttribute("required", "")

    document.getElementById("formaPagoValido").classList.remove("d-block")
    return "Cuenta bancaria"
  }
  if (!pagoBanco.checked && !pagoCredito.checked) {
    document.getElementById("formaPagoValido").classList.remove("d-none")
    return "Seleccionar metodo"
  }

}

document.getElementById("formaPagoModal").addEventListener("input", function (e) {
  formaDePago();
  document.getElementById("formaSeleccionada").innerText = formaDePago();
})

//Cuando cargue el dom...
document.addEventListener("DOMContentLoaded", function (e) {
  //Obtengo la info del producto
  getJSONData(CART_INFO_URL).then(function (info) {
    if (info.status === "ok") {
      carrito = info.data.articles;
      carrito = carrito.concat(localCarrito);
      generarTabla();
      mostrarCostos();
    };
  });
});