const body = document.querySelector("body");

document.addEventListener("DOMContentLoaded", function() {
    if (sessionStorage.getItem("loggedUser") == null) {
        /*setTimeout(function() {
            window.location.href = "../../view/auth/login.html";
        }, 500);*/
        $(function() {
            $(".nav-to-load").load("../../view/common/commonNavbar.html .common-navbar");
        });
    } else {
    }
});