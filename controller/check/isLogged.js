const body = document.querySelector("body");

document.addEventListener("DOMContentLoaded", function() {
    if (sessionStorage.getItem("loggedUser") == null) {
        /*setTimeout(function() {
            window.location.href = "../../view/auth/login.html";
        }, 500);*/
        let nav = document.createElement("nav");
        nav.setAttribute("id", "nav-to-load");
        body.appendChild(nav);
        $(function() {
            $("#nav-to-load").load("../../view/common/commonfunc.html #common-navbar");
        });
    } else {
    }
});