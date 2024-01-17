$(document).ready(function () {
    const carousel = new bootstrap.Carousel(document.getElementById('postCarousel'));

    // Azione clic su pulsante di caricamento
    $('#uploadImageButton').click(function () {
        // Simula il clic sull'input file
        $('#photo').click();
    });

    // Azione al cambio dell'input file
    $('#photo').change(function () {
        var fileInput = $(this)[0];
        if (fileInput.files && fileInput.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var newItem = '<div class="carousel-item">' +
                    '<img src="' + e.target.result + '" class="img-fluid" alt="Uploaded Image">' +
                    '</div>';

                // Aggiungi il nuovo item al carosello
                $('.carousel-inner').append(newItem);

                // Aggiorna l'indicatore del carosello
                var indicators = $('.carousel-indicators');
                var newIndex = indicators.children().length;
                indicators.append('<button type="button" data-bs-target="#postCarousel" data-bs-slide-to="' + newIndex + '"></button>');

                // Aggiorna il carosello
                carousel.to(newIndex);
            };

            reader.readAsDataURL(fileInput.files[0]);
        }
    });

    // TODO fixare il fatto che rimuove tutto e poi non si può più aggiungere
    // Azione clic su pulsante di rimozione
    $('#removeImageButton').click(function () {
        var items = $('.carousel-inner').children('.carousel-item');

        if (items.length >= 1) {
            // Rimuovi l'ultimo item dal carosello
            items.last().remove();

            // Rimuovi l'ultimo indicatore
            $('.carousel-indicators').children().last().remove();

            // Aggiorna il carosello
            carousel.to(carousel._activeIndex);
        }
    });

});

document.getElementById("upload-form").addEventListener("submit", function (e) {
    e.preventDefault();
    document.getElementById("username").textContent = sessionStorage.getItem("username");
    this.submit();
});