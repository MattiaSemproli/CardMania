$('#upload-form').submit(function(e) {
    e.preventDefault();
    var formData = new FormData(this);
    $.ajax({
        type: 'POST',
        url: '../model/uploadPost.php',
        data: formData,
        success: function() {
            window.location.href = "../view/user/profile.html?username=" + sessionStorage.getItem("username");
        },
        error: function(error) {
            console.error(error);
        }
    });
});