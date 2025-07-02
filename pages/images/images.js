document.addEventListener('DOMContentLoaded', () => {
    const uploadTrigger = document.getElementById('uploadTrigger');
    const fileInput = document.getElementById('fileInput'); // New: Reference to the hidden file input
    const imageGrid = document.getElementById('imageGrid');
    const navUsername = document.getElementById('navUsername');
    const navAvatar = document.getElementById('navAvatar');
    const logoutBtnNav = document.getElementById('logoutBtnNav');

    // Retrieve active user from session storage
    const activeUser = JSON.parse(sessionStorage.getItem('userActive'));
    let currentUser = null;

    if (activeUser && activeUser.email) {
        currentUser = activeUser.email;
        // Update username in the navbar
        if (navUsername) {
            navUsername.textContent = activeUser.name || 'User'; // Display name or 'User'
        }
        // Update avatar (if a path is stored in userActive)
        if (navAvatar && activeUser.avatar) {
            navAvatar.src = activeUser.avatar;
        }
    } else {
        // If no active user, redirect to login
        window.location.href = '../login/login.html';
        return; // Stop execution if no user is active
    }

    // Function to load images from localStorage
    function loadImages() {
        imageGrid.innerHTML = ''; // Clear the grid before loading
        const storedImages = JSON.parse(localStorage.getItem('userImages')) || {};
        const userImages = storedImages[currentUser] || [];

        if (userImages.length === 0) {
            imageGrid.innerHTML = '<p class="has-text-white has-text-centered column is-full">You don\'t have any images yet. Upload one!</p>';
            return;
        }

        userImages.forEach(imageUrl => {
            const column = document.createElement('div');
            column.classList.add('column', 'is-one-quarter-desktop', 'is-one-third-tablet', 'is-half-mobile');

            const card = document.createElement('div');
            card.classList.add('card');
            card.style.position = 'relative'; // Required to position the delete button

            const cardImage = document.createElement('div');
            cardImage.classList.add('card-image');

            const figure = document.createElement('figure');
            figure.classList.add('image', 'is-4by3');

            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'User Image';

            figure.appendChild(img);
            cardImage.appendChild(figure);

            // Delete button
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button', 'button', 'is-danger', 'is-small');
            deleteButton.innerHTML = '&times;'; // 'x' icon
            deleteButton.style.position = 'absolute';
            deleteButton.style.top = '5px';
            deleteButton.style.right = '5px';
            deleteButton.style.zIndex = '10'; // Ensure it's above the image

            deleteButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this image?')) {
                    deleteImage(imageUrl);
                }
            });

            card.appendChild(cardImage);
            card.appendChild(deleteButton); // Add the delete button to the card
            column.appendChild(card);
            imageGrid.appendChild(column);
        });
    }

    // Function to trigger file input click
    function addImage() {
        fileInput.click(); // Programmatically click the hidden file input
    }

    // New: Event listener for when a file is selected
    if (fileInput) {
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0]; // Get the selected file

            if (file) {
                const reader = new FileReader();

                reader.onload = (e) => {
                    const base64Image = e.target.result; // Base64 encoded image

                    const storedImages = JSON.parse(localStorage.getItem('userImages')) || {};
                    if (!storedImages[currentUser]) {
                        storedImages[currentUser] = [];
                    }
                    storedImages[currentUser].push(base64Image); // Store Base64 string
                    localStorage.setItem('userImages', JSON.stringify(storedImages));
                    loadImages(); // Reload images to display the new one
                };

                reader.onerror = () => {
                    alert('Error reading the image file.');
                };

                reader.readAsDataURL(file); // Read the file as a Data URL (Base64)
            }
            // Clear the file input value to allow selecting the same file again
            fileInput.value = '';
        });
    }

    // Function to delete an image
    function deleteImage(imageUrlToDelete) {
        const storedImages = JSON.parse(localStorage.getItem('userImages')) || {};
        let userImages = storedImages[currentUser] || [];

        const initialLength = userImages.length;
        userImages = userImages.filter(url => url !== imageUrlToDelete);

        if (userImages.length < initialLength) { // Only if an image was deleted
            storedImages[currentUser] = userImages;
            localStorage.setItem('userImages', JSON.stringify(storedImages));
            loadImages(); // Reload images to update the view
        } else {
            alert('Could not find the image to delete.');
        }
    }

    // Event listener for the upload trigger
    if (uploadTrigger) {
        uploadTrigger.addEventListener('click', addImage);
    } else {
        console.error('The #uploadTrigger element was not found.');
    }

    // Event listener for the logout button in the navbar
    if (logoutBtnNav) {
        logoutBtnNav.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('userActive'); // Clear active user session
            window.location.href = '../login/login.html'; // Redirect to login page
        });
    }

    // Load images on page initialization
    loadImages();
});