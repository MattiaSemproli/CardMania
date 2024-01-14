document.addEventListener("DOMContentLoaded", function() {
    if (sessionStorage.getItem("loggedUser") == null) {
        setTimeout(function() {
            window.location.href = "../../view/auth/login.html";
        }, 500);
    }
});