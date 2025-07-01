const message = document.getElementById("loginError");

document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const emailIngresado = document.getElementById("loginEmail").value.trim();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const usuarioEncontrado = users.find(u => u.email === emailIngresado);

    if (usuarioEncontrado)  {
        message.textContent = "Iniciando sesion...";
        setTimeout(() => {
        window.location.href = "../profile/profile.html";
    }, 3000);
    } else {
        message.textContent = "Usuario no registrado";
    }




});