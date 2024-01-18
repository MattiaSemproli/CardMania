document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("photo");
    const uploadImageButton = document.getElementById("upload-image-button");
    
    uploadImageButton.addEventListener("click", function () {
        fileInput.click();
    });
    
    fileInput.addEventListener("change", function () {
        if (fileInput.files && fileInput.files[0]) {    
            const reader = new FileReader();
            reader.onload = function (e) {
                $("#placeholder").attr("src", e.target.result);
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    });
    
    document.getElementById("upload-form").addEventListener("submit", function (e) {
        e.preventDefault();
        document.getElementById("username").value = sessionStorage.getItem("username");
        this.submit();
    });
});
