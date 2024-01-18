window.addEventListener('load', function () {
    let notificationList = $('<ul>').addClass('list-group list-group-flush');
    let user = this.sessionStorage.getItem('username');

    document.getElementById("modal-user").textContent = user + " is followed by these users";
    $.ajax({
        url: '../../model/getUserNotifications.php',
        type: 'GET',
        data: {
            followers: user,
        },
        dataType: 'json',
        success: function (data) {
            for (let i = 0; i < data.length; i++) {
                let item = $('<li>').addClass('list-group-item');
                let linkItem = $('<a>').attr('href', '../../view/user/profile.html?username=' + data[i].follower)
                    .text(data[i].follower);
                notificationList.append(item.append(linkItem));
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
    $('#offcanvas-body').append(notificationList);

});

setInterval(function () {
    $.ajax({
        type: "GET",
        url: "../Controller/getUnreadNotificationsByNickname.php",
        datatype: "json",
        success: function (response) {
            if (response > 0) {
                $("#notifications").text(response);
                $("#notifications").addClass("bg-danger");
            } else {
                $("#notifications").text("");
            }
        },
        error: function (xhr, status, error) {
            console.error('Errore nella richiesta AJAX:', status, error);
        }
    });
}, 500);
