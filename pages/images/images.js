document.addEventListener('DOMContentLoaded', () => {
    const uploadTrigger = document.getElementById('uploadTrigger');
    const imageGrid = document.getElementById('imageGrid');
    const currentUser = 'Sancatheboss'; // Esto debería venir de tu sistema de autenticación

    // Función para cargar imágenes desde localStorage
    function loadImages() {
        imageGrid.innerHTML = ''; // Limpiar la cuadrícula antes de cargar
        const storedImages = JSON.parse(localStorage.getItem('userImages')) || {};
        const userImages = storedImages[currentUser] || [];

        if (userImages.length === 0) {
            imageGrid.innerHTML = '<p class="has-text-white has-text-centered column is-full">No tienes imágenes aún. ¡Sube una!</p>';
            return;
        }

        userImages.forEach(imageUrl => {
            const column = document.createElement('div');
            column.classList.add('column', 'is-one-quarter-desktop', 'is-one-third-tablet', 'is-half-mobile');

            const card = document.createElement('div');
            card.classList.add('card');
            card.style.position = 'relative'; // Necesario para posicionar el botón de eliminar

            const cardImage = document.createElement('div');
            cardImage.classList.add('card-image');

            const figure = document.createElement('figure');
            figure.classList.add('image', 'is-4by3');

            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Uploaded Image';

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete', 'is-small'); // Clase de Bulma para botón de eliminar
            deleteButton.style.position = 'absolute';
            deleteButton.style.top = '10px';
            deleteButton.style.right = '10px';
            deleteButton.ariaLabel = 'eliminar imagen';
            deleteButton.addEventListener('click', () => {
                deleteImage(imageUrl);
            });

            figure.appendChild(img);
            cardImage.appendChild(figure);
            card.appendChild(deleteButton);
            card.appendChild(cardImage);
            column.appendChild(card);
            imageGrid.appendChild(column);
        });
    }

    // Función para agregar una nueva imagen
    async function addImage() {
        const imageUrl = prompt('Por favor, ingresa la URL de la imagen:');

        if (imageUrl && imageUrl.trim() !== '') {
            const storedImages = JSON.parse(localStorage.getItem('userImages')) || {};
            if (!storedImages[currentUser]) {
                storedImages[currentUser] = [];
            }
            storedImages[currentUser].push(imageUrl);
            localStorage.setItem('userImages', JSON.stringify(storedImages));
            loadImages(); // Volver a cargar las imágenes para mostrar la nueva
        } else if (imageUrl !== null) { // Si el usuario no cancela pero deja el campo vacío
            alert('La URL de la imagen no puede estar vacía.');
        }
    }

    // Función para eliminar una imagen
    function deleteImage(imageUrlToDelete) {
        const storedImages = JSON.parse(localStorage.getItem('userImages')) || {};
        let userImages = storedImages[currentUser] || [];

        const initialLength = userImages.length;
        userImages = userImages.filter(url => url !== imageUrlToDelete);

        if (userImages.length < initialLength) { // Solo si una imagen fue eliminada
            storedImages[currentUser] = userImages;
            localStorage.setItem('userImages', JSON.stringify(storedImages));
            loadImages(); // Volver a cargar las imágenes para actualizar la vista
        } else {
            alert('No se pudo encontrar la imagen para eliminar.');
        }
    }

    // Event listener para el trigger de subida
    if (uploadTrigger) {
        uploadTrigger.addEventListener('click', addImage);
    } else {
        console.error('El elemento #uploadTrigger no fue encontrado.');
    }
            // sadalsjksdhasldhasdsljkdha
    // Cargar las imágenes al iniciar la página
    loadImages();
});