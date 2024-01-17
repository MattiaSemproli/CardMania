window.addEventListener("load", function () {
    if(sessionStorage.getItem("username") != null) {
        toHome();
    } else {
        if(document.cookie.includes("username")) {
            sessionStorage.setItem("username", getCookie("username"));
            toHome();
        }
    }
});

$("#login").on("click", function () {
    const checkBox = $("#remember-me").is(":checked");
    $.ajax({
        url: "../../model/auth/login/login.php",
        type: "POST",
        data: {
            username: $("#username").val(),
            password: $("#password").val(),
        },
        success: function (result) {
            const res = JSON.parse(result);
            if (res.success) {
                if (checkBox) {
                  document.cookie = "username=" + res.username + "; expires=" + getCookieExpireDate() + "; path=/";
                }
                sessionStorage.setItem("username", res.username);
                toHome();
            }
        },
        error: function (error) {
          console.log(error);
        },
    });
});

function toHome() {
    window.location.href = "../../view/feed/index.html";
}

function getCookieExpireDate() {
    let date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toUTCString();
}

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