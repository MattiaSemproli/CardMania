const canvas = document.getElementById('notifications');
let isCanvasOpen = false;
canvas.addEventListener('shown.bs.offcanvas', function () {
    isCanvasOpen = true;
    let badge = document.getElementById('bell');
    if(badge.children.length > 0) {
        badge.removeChild(badge.children[0]);
    }
    let notificationList = $('<ul>').addClass('list-group list-group-flush');
    $.ajax({
        url: "../../model/getNotifications.php",
        type: "POST",
        data: {
            username: sessionStorage.getItem('username'),
        },
        dataType: "json",
        success: function (data) {
            for (let i = 0; i < data.length; i++) {
                let item = $('<li>').addClass('list-group-item bg-white mb-2');
                let linkItem = $('<a>').attr('href', '../user/profile.html?username=' + data[i].sender)
                                       .text(data[i].sender + " " + data[i].description)
                                       .addClass('text-decoration-none position-relative');

                if (data[i].state == 0) {
                    linkItem.addClass('text-danger');
                    linkItem.append($('<span>')
                            .addClass('position-absolute start-0 translate-middle p-2 bg-danger border border-light rounded-circle'));
                } else {
                    linkItem.append($('<span>')
                            .addClass('position-absolute start-0 translate-middle p-2 bg-success border border-light rounded-circle'));
                    linkItem.addClass('text-success');
                }
                notificationList.append(item.append(linkItem));
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
    $('#notification-box').append(notificationList);
});

canvas.addEventListener('hidden.bs.offcanvas', function () {
    $('#notification-box').empty();
    $.ajax({
        url: "../../model/setNotificationsStateRead.php",
        type: "POST",
        data: {
            username: sessionStorage.getItem('username'),
        },
        dataType: "json",
        error: function (error) {
            console.log(error);
        }
    });
    isCanvasOpen = false;
});

setInterval(function () {
    if (!isCanvasOpen) {
        $.ajax({
            type: "POST",
            url: "../../model/getUnreadNotifications.php",
            data: {
                username: sessionStorage.getItem('username'),
            },
            success: function (res) {
                console.log(res);
                if (res > 0 && document.getElementById('bell').children.length == 0) {
                    $('#bell').append($('<span>').addClass('fs-5 top-0 start-100 translate-middle badge rounded-pill bg-white text-black')
                                                .text(res));
                } else if (res > parseInt($('#bell').text())) {
                    document.getElementById('bell').children[0].textContent = res;
                }
            },
            error: function (error) {
                console.error('Ajax error:', error);
            }
        });
    }
}, 500);