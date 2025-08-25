const form = document.getElementById("login-form");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email.includes("@")) {
        alert("Incorrect email");
        return;
    }
    if (password.length < 6) {
        alert("You must enter at least 6 characters long");
        return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);

    window.location.href = "../html/index.html";
});