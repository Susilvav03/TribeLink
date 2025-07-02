const userActive = JSON.parse(sessionStorage.getItem("userActive"));

if (!userActive) {
    window.location.href = "../../pages/login/login.html";
} else {
    console.log(`Active session ${userActive.name} ${userActive.lastname}`);
}