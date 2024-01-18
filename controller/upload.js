document.addEventListener("DOMContentLoaded", function () {
    // Placeholder e input del file
    const placeholder = document.getElementById("placeholder");
    const fileInput = document.getElementById("photo");
    const uploadImageButton = document.getElementById("uploadImageButton");

    // Aggiungi un listener al click del bottone per attivare l'input del file
    uploadImageButton.addEventListener("click", function () {
        fileInput.click();
    });

    // Aggiungi un listener per il cambio di valore nell'input file
    fileInput.addEventListener("change", function () {
        // Verifica se è stato selezionato un file
        if (fileInput.files && fileInput.files[0]) {
            // Rimuovi l'immagine precedente, se presente
            const previousImage = document.getElementById("uploadedImage");
            if (previousImage) {
                previousImage.remove();
            }

            // Leggi il file selezionato
            const reader = new FileReader();
            reader.onload = function (e) {
                // Nascondi il placeholder
                placeholder.style.display = "none";

                // Creazione dell'elemento immagine con classi Bootstrap
                const image = document.createElement("img");
                image.src = e.target.result;
                image.alt = "Uploaded Image";
                image.classList.add("img-fluid", "col", "mx-auto");
                image.id = "uploadedImage";

                // Aggiungi l'immagine al placeholder
                placeholder.parentNode.insertBefore(image, placeholder.nextSibling);
            };
            // Leggi il file come URL dati
            reader.readAsDataURL(fileInput.files[0]);
        }
    });

    // Aggiungi un listener al submit del form
    document.getElementById("upload-form").addEventListener("submit", function (e) {
        e.preventDefault();
        document.getElementById("username").textContent = sessionStorage.getItem("username");
        this.submit();
    });
});
