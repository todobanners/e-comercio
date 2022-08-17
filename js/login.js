// Obtengo los valores del form
let user = document.getElementById('usuario');
let contra = document.getElementById('pass');

//Verifico el evento submit
document.getElementById('login').addEventListener('submit', evento => {
//Realizo comprobacion de si tiene texto introduciodo o no
    if (user.value.length > 0 && contra.value.length > 0) {
        evento.preventDefault();
        window.location.href = "home.html";
        console.log('ir a la otra pagina')
    } else {
        document.getElementById("alertuser").innerHTML = `Necesita colocar algun valor en los dos campos`;
        document.getElementById("alertuser").className = "alert-danger";
        console.log('Algun campo esta vacio')
        evento.preventDefault();
    }
});