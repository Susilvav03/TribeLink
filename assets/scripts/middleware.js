const userActive = JSON.parse(sessionStorage.getItem("userAvtive"));

if (!userActive) {
    window.location.href = "../../pages/login/login.html";
} else {
    console.log(`Sesion activa ${userActive.name} ${userActive.lastname}`);
}