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

function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    const responsePayload = jwt_decode(response.credential);

    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);
    document.getElementById("datosgoogle").innerHTML = `<h3>Bienvenido ${responsePayload.name}</h3>
       <img src="${responsePayload.picture}">
    <p>Tu correo es ${responsePayload.email}</p><p>Ya puedes ingresar al sitio</p>`;
    document.getElementById("usuario").value = responsePayload.email;
    document.getElementById("pass").value = responsePayload.sub;
    localStorage.setItem("imagen", responsePayload.picture);
 }