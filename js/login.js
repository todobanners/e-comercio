// Obtengo los valores del form
let user = document.getElementById('usuario');
let contra = document.getElementById('pass');

//Verifico el evento submit
document.getElementById('login').addEventListener('submit', evento => {
//Realizo comprobacion de si tiene mas de 0 caracteres introduciodos o no
    if (user.value.length > 0 && contra.value.length > 0) {
        evento.preventDefault();
        //Guardo en localStorage los datos del usuario
        localStorage.setItem("usuario", user.value)
        //Redirijo a la pagina de index
        window.location.href = "index.html";
    } else {
        //Aviso al usuario que no estan completos los campos de ingreso
        document.getElementById("alertuser").innerHTML = `Necesita colocar algun valor en los dos campos`;
        document.getElementById("alertuser").className = "alert-danger";
        evento.preventDefault();
    }
});

