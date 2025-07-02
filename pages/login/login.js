const message = document.getElementById("loginError");

document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const emailEntered = document.getElementById("loginEmail").value.trim();
    const passwordEntered = document.getElementById("loginPassword").value.trim();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userFound = users.find(u => u.email === emailEntered && u.password === passwordEntered);

    if (userFound)  {
        sessionStorage.setItem("userActive", JSON.stringify(userFound))
        message.textContent = "Logging in...";
        setTimeout(() => {
        window.location.href = "../profile/profile.html";
    }, 3000);
    } else {
        message.textContent = "User not found";
    }
});