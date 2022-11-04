let formulario = document.getElementById("formulario");
let inpPrimerNombre = document.getElementById("inpPrimerNombre");
let inpSegundoNombre = document.getElementById("inpSegundoNombre");
let inpPrimerApellido = document.getElementById("inpPrimerApellido");
let inpSegundoApellido = document.getElementById("inpSegundoApellido");
let inpEmail = document.getElementById("inpEmail");
let inpCelular = document.getElementById("inpCelular");
let inpArchivo = document.getElementById("inpArchivo");
let imagenPerfil = document.getElementById("imagenPerfil");

function autoRelleno(input, valor){
    input.value = valor;
}

function guardarDato(dato, valor){
    localStorage.setItem(dato, valor.value)
}

document.getElementById('inpArchivo').addEventListener('change', (e) => {
    // Leo el input y guardo el archivo para ser leido
    const file = e.target.files[0];
    // leo el archivo
    const reader = new FileReader();
    // Con el archivo espero a que cargue
    reader.onloadend = () => {
      // convierto a base64
      const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
      // Guardo la imagen
      localStorage.setItem('userImagen', base64String);
      // display image
      //document.body.style.background = `url(data:image/png;base64,${base64String})`;
    //   imagenPerfil.innerHTML = `<img src="url(data:image/png;base64,${ localStorage.getItem("userImagen")})">`;
    };
    reader.readAsDataURL(file);
  });
  if (localStorage.getItem("userImagen")){
  imagenPerfil.innerHTML = `<img class="img-fluid rounded-top" src="data:image/png;base64,${ localStorage.getItem("userImagen")}">`;
}
autoRelleno(inpPrimerNombre, localStorage.getItem("userPrimerNombre"));
autoRelleno(inpSegundoNombre, localStorage.getItem("userSgundoNombre"));
autoRelleno(inpPrimerApellido, localStorage.getItem("userPrimerApellido"));
autoRelleno(inpSegundoApellido, localStorage.getItem("userSegundoApellido"));
autoRelleno(inpEmail, localStorage.getItem("userEmail"));
autoRelleno(inpCelular, localStorage.getItem("userCel"));



formulario.addEventListener("submit", function(event){
    if(!formulario.checkValidity()){
        event.preventDefault();
        event.stopPropagation();
    }else{
        guardarDato("userPrimerNombre",inpPrimerNombre);
        guardarDato("userSgundoNombre", inpSegundoNombre);
        guardarDato("userPrimerApellido", inpPrimerApellido);
        guardarDato("userSegundoApellido", inpSegundoApellido);
        guardarDato("userEmail",inpEmail);
        guardarDato("userCel", inpCelular);
        
    }
    formulario.classList.add("was-validated")
},false)