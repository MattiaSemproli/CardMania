$('#logout').on("click", function () {
    sessionStorage.clear();
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "../../view/auth/login.html";
});