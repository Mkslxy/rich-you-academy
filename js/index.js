
function init() {
    import('./index.login.js')
}

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "../html/index.login.partial.html";
}

const totalPartials = document.querySelectorAll('[hx-trigger="load"], [data-hx-trigger="load"]').length;
let loadedPartialsCount = 0;

document.body.addEventListener('htmx:afterOnLoad', () => {
    loadedPartialsCount++;
    if (loadedPartialsCount === totalPartials) init();
});