window.addEventListener("load", function() {  
    if (sessionStorage.getItem("username") == null) {
        if(!document.cookie.includes("username")) {
            window.location.href = "../../view/auth/login.html";
        } else {
            sessionStorage.setItem("username", getCookie("username"));
            loadNavbar();
        }
    } else {
        loadNavbar();
    }
});

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        const [cookieName, cookieValue] = cookies[i].split("=");
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}

function loadNavbar() {
    $(".nav-to-load").load("../../view/common/commonNavbar.html .common-navbar");
}