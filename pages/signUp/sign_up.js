document.getElementById("signupForm").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const newUser = {
        name : document.getElementById("firstName").value,
        lastName : document.getElementById("lastName").value,
        email : document.getElementById("signupEmail").value,
        phone : document.getElementById("phone").value,
        country : document.getElementById("country").value,
        city : document.getElementById("city").value,
        password : document.getElementById("password").value,
    };
    
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    const userExist = users.some(u => u.email === newUser.email);
    
    if (userExist) {
        alert("This email is already registered.")
        return
    }    
    
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    alert("User successfully registered.");
    window.location.href = "../login/login.html";
});