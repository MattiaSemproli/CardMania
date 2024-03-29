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

const pssw = document.getElementById('password');
const confirmPssw = document.getElementById('repassword');
const submitBtn = document.getElementById('registration');

confirmPssw.addEventListener('input', function () {
    if (pssw.value === confirmPssw.value) {
        pssw.style.border = '2px solid green';
        confirmPssw.style.border = '2px solid green';
        submitBtn.disabled = false;
    } else {
        pssw.style.border = '2px solid red';
        confirmPssw.style.border = '2px solid red';
        submitBtn.disabled = true;
    }
});

$("#registration").on("click", function () {
    registerUser(document.getElementById('username').value,
                 document.getElementById('email').value, 
                 document.getElementById('name').value,
                 pssw.value);
});

function registerUser(username, email, name, password) {
    $.ajax({
        type: 'POST',
        url: '../../model/auth/register/registration.php', 
        data: {
            username: username,
            email: email,
            name: name,
            password: password,
        },
        success: function(res) {
            const respo = JSON.parse(res);
            if(respo.success) {
                window.location.href = "../../view/auth/login.html";
            } else {
                console.log("Error in the registration process");
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function toHome() {
    window.location.href = "../../view/feed/index.html";
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