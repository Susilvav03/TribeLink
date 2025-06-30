document.getElementById("signupForm").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const newUser = {
        name : document.getElementById("firstName").value,
        lastName : document.getElementById("lastName").value,
        email : document.getElementById("signupEmail").value,
        phone : document.getElementById("phone").value,
        country : document.getElementById("country").value,
        city : document.getElementById("city").value,
        address : document.getElementById("address").value,
        zipCode : document.getElementById("zip").value,
    };
    
    let users = JSON.parse(localStorage.getItem("users")) || [];

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    

    alert("Usuario registrado correctamente.");
    window.location.href = "../../login.html";
});