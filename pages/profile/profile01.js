document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const profileDisplay = document.getElementById('profileDisplay');
    const profileEditFormContainer = document.getElementById('profileEditFormContainer');
    const activitySummary = document.getElementById('activitySummary');

    const showProfileBtn = document.getElementById('showProfileBtn');
    const showActivityBtn = document.getElementById('showActivityBtn');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileDisplayBtn = document.getElementById('editProfileDisplayBtn'); // "Edit Profile" button on the display view

    const logoutBtnNav = document.getElementById('logoutBtnNav'); // Logout button in the navbar
    const logoutBtnSidebar = document.getElementById('logoutBtnSidebar'); // Logout button in the sidebar
    const logoutBtnBottom = document.getElementById('logoutBtnBottom'); // Bottom logout button

    const profileForm = document.getElementById('profileForm');
    const nameInput = document.getElementById('name');
    const lastnameInput = document.getElementById('lastname');
    const emailInput = document.getElementById('profileEmail');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const cityInput = document.getElementById('city');
    const countryInput = document.getElementById('country');

    const displayName = document.getElementById('displayName');
    const displayLastName = document.getElementById('displayLastName');
    const displayEmail = document.getElementById('displayEmail');
    const displayPhone = document.getElementById('displayPhone');
    const displayAddress = document.getElementById('displayAddress');
    const displayCity = document.getElementById('displayCity');
    const displayCountry = document.getElementById('displayCountry');

    const profileAvatarDisplay = document.getElementById('profileAvatarDisplay');
    const profileAvatarEdit = document.getElementById('profileAvatarEdit');
    const navAvatar = document.getElementById('navAvatar');
    const navUsername = document.getElementById('navUsername');
    const avatarUpload = document.getElementById('avatarUpload');
    const avatarFileName = document.getElementById('avatarFileName');

    const logsContainer = document.getElementById('logsContainer');

    // --- Utility Functions ---

    // Function to handle validation errors
    const showError = (element, message) => {
        element.style.display = 'block';
        element.textContent = message;
    };

    const hideError = (element) => {
        element.style.display = 'none';
        element.textContent = '';
    };

    // Input validations
    const validateLength = (inputElement, fieldName, min, max) => {
        const errorElement = document.getElementById(`${inputElement.id}Error`);
        if (inputElement.value.trim().length < min || inputElement.value.trim().length > max) {
            showError(errorElement, `${fieldName} must be between ${min}-${max} characters.`);
            return false;
        }
        hideError(errorElement);
        return true;
    };

    const validateEmail = (inputElement) => {
        const errorElement = document.getElementById(`${inputElement.id}Error`);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputElement.value.trim())) {
            showError(errorElement, 'Enter a valid email address.');
            return false;
        }
        hideError(errorElement);
        return true;
    };

    const validatePhone = (inputElement) => {
        const errorElement = document.getElementById(`${inputElement.id}Error`);
        const phoneRegex = /^\d{7,15}$/; // Accepts 7 to 15 digits
        if (inputElement.value.trim() !== '' && !phoneRegex.test(inputElement.value.trim())) {
            showError(errorElement, 'Phone must be 7-15 digits.');
            return false;
        }
        hideError(errorElement);
        return true;
    };


    // --- Business Logic Functions ---

    // Loads active user profile data from sessionStorage
    const loadUserProfile = () => {
        const userActiveString = sessionStorage.getItem('userActive');
        return userActiveString ? JSON.parse(userActiveString) : null;
    };

    // Saves active user profile data to sessionStorage
    const saveUserProfile = (userProfile) => {
        sessionStorage.setItem('userActive', JSON.stringify(userProfile));
        // Optional: Also update in localStorage if you want persistence across sessions
        // This will depend on how you manage your global users. For now, only userActive.
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email === userProfile.email);
        if (userIndex !== -1) {
            users[userIndex] = userProfile;
            localStorage.setItem('users', JSON.stringify(users));
        }
    };

    // Loads logs from localStorage
    const loadLogs = () => {
        const userActive = loadUserProfile();
        if (!userActive || !userActive.email) return [];
        const allLogs = JSON.parse(localStorage.getItem('userLogs')) || {};
        return allLogs[userActive.email] || [];
    };

    // Saves a new log to localStorage
    const addLog = (action) => {
        const userActive = loadUserProfile();
        if (!userActive || !userActive.email) return;

        const timestamp = new Date().toLocaleString();
        const logEntry = {
            user: userActive.email,
            action: action,
            date: timestamp
        };

        let allLogs = JSON.parse(localStorage.getItem('userLogs')) || {};
        if (!allLogs[userActive.email]) {
            allLogs[userActive.email] = [];
        }
        allLogs[userActive.email].push(logEntry);
        localStorage.setItem('userLogs', JSON.stringify(allLogs));
        renderLogs(); // Update logs display
    };

    // Renders profile information in the display view
    const renderUserProfile = () => {
        const userProfile = loadUserProfile();

        if (userProfile) {
            displayName.textContent = userProfile.name || 'N/A';
            displayLastName.textContent = userProfile.lastName || 'N/A';
            displayEmail.textContent = userProfile.email || 'N/A';
            displayPhone.textContent = userProfile.phone || 'N/A';
            displayAddress.textContent = userProfile.address || 'N/A';
            displayCity.textContent = userProfile.city || 'N/A';
            displayCountry.textContent = userProfile.country || 'N/A';
            // displayZip.textContent = userProfile.zip || 'N/A'; // Removed

            // Load profile image or use placeholder
            const avatarSrc = userProfile.avatar || 'https://via.placeholder.com/128/0000FF/FFFFFF?text=U';
            profileAvatarDisplay.src = avatarSrc;
            profileAvatarEdit.src = avatarSrc; // Also for the edit view
            navAvatar.src = userProfile.avatar || 'https://via.placeholder.com/24/0000FF/FFFFFF?text=U'; // For the navbar
            navUsername.textContent = userProfile.name || 'User';
        } else {
            // If no user, redirect to login
            window.location.href = '../login/login.html';
        }
    };

    // Populates the edit form with current profile data
    const populateEditForm = () => {
        const userProfile = loadUserProfile();
        if (userProfile) {
            nameInput.value = userProfile.name || '';
            lastnameInput.value = userProfile.lastName || '';
            emailInput.value = userProfile.email || ''; // Email is readonly
            phoneInput.value = userProfile.phone || '';
            addressInput.value = userProfile.address || '';
            cityInput.value = userProfile.city || '';
            countryInput.value = userProfile.country || '';
            // zipInput.value = userProfile.zip || ''; // Removed

            const avatarSrc = userProfile.avatar || 'https://via.placeholder.com/128/0000FF/FFFFFF?text=U';
            profileAvatarEdit.src = avatarSrc;
            avatarFileName.textContent = userProfile.avatar ? 'Avatar selected' : 'No file chosen'; // Update file name if avatar exists
        }
    };

    // Renders logs in the activity section
    const renderLogs = () => {
        const logs = loadLogs();
        logsContainer.innerHTML = ''; // Clear existing logs

        if (logs.length === 0) {
            logsContainer.innerHTML = '<p>No activity logs found.</p>';
            return;
        }

        logs.reverse().forEach(log => { // Show most recent first
            const p = document.createElement('p');
            p.innerHTML = `<strong>${log.date}:</strong> ${log.action}`;
            logsContainer.appendChild(p);
        });
    };

    // --- View Management (Show/Hide sections) ---
    const showSection = (sectionToShow) => {
        profileDisplay.style.display = 'none';
        profileEditFormContainer.style.display = 'none';
        activitySummary.style.display = 'none';

        if (sectionToShow === 'profile') {
            profileDisplay.style.display = 'block';
            renderUserProfile(); // Ensure display is updated
        } else if (sectionToShow === 'edit') {
            profileEditFormContainer.style.display = 'block';
            populateEditForm(); // Populate form when shown
        } else if (sectionToShow === 'activity') {
            activitySummary.style.display = 'block';
            renderLogs(); // Load logs when shown
        }

        // Update sidebar button active state
        showProfileBtn.classList.remove('is-active');
        showActivityBtn.classList.remove('is-active');
        editProfileBtn.classList.remove('is-active');

        if (sectionToShow === 'profile') {
            showProfileBtn.classList.add('is-active');
        } else if (sectionToShow === 'edit') {
            editProfileBtn.classList.add('is-active');
        } else if (sectionToShow === 'activity') {
            showActivityBtn.classList.add('is-active');
        }
    };

    // --- Event Listeners ---

    // Sidebar Navigation and action buttons
    showProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('profile');
    });

    editProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('edit');
    });

    editProfileDisplayBtn.addEventListener('click', (e) => { // "Edit Profile" button on the display view
        e.preventDefault();
        showSection('edit');
    });

    showActivityBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('activity');
    });

    // Avatar upload handling
    avatarUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            avatarFileName.textContent = file.name;
            const reader = new FileReader();
            reader.onload = (e) => {
                profileAvatarEdit.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            avatarFileName.textContent = 'No file chosen';
            profileAvatarEdit.src = loadUserProfile().avatar || 'https://via.placeholder.com/128/0000FF/FFFFFF?text=U'; // Reset to current avatar or placeholder
        }
    });

    // Profile form submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Perform validations before saving
        let isValid = true;
        isValid = validateLength(nameInput, 'Name', 2, 50) && isValid;
        isValid = validateLength(lastnameInput, 'Last name', 2, 50) && isValid;
        // Email is readonly, no format validation needed here, only presence if edited
        isValid = validatePhone(phoneInput) && isValid;
        if (addressInput.value.trim() !== '') {
            isValid = validateLength(addressInput, 'Address', 5, 100) && isValid;
        }
        if (cityInput.value.trim() !== '') {
            isValid = validateLength(cityInput, 'City', 2, 50) && isValid;
        }
        if (countryInput.value.trim() !== '') {
            isValid = validateLength(countryInput, 'Country', 2, 50) && isValid;
        }
        // isValid = validateZip(zipInput) && isValid; // Removed


        if (!isValid) {
            alert('Please correct the errors in the form.');
            return;
        }

        const userProfile = loadUserProfile();
        if (userProfile) {
            userProfile.name = nameInput.value.trim();
            userProfile.lastName = lastnameInput.value.trim();
            userProfile.phone = phoneInput.value.trim();
            userProfile.address = addressInput.value.trim();
            userProfile.city = cityInput.value.trim();
            userProfile.country = countryInput.value.trim();
            // userProfile.zip = zipInput.value.trim(); // Removed
            userProfile.avatar = profileAvatarEdit.src; // Save image as base64

            saveUserProfile(userProfile);
            addLog('Profile updated');
            alert('Profile updated successfully!');
            showSection('profile'); // Return to profile view
        }
    });

    // Handle logout button clicks
    const handleLogout = () => {
        addLog('Session logged out');
        sessionStorage.removeItem('userActive'); // Remove active session
        alert('You have been logged out.');
        window.location.href = '../login/login.html'; // Redirect to login
    };

    logoutBtnNav.addEventListener('click', handleLogout);
    logoutBtnSidebar.addEventListener('click', handleLogout);
    logoutBtnBottom.addEventListener('click', handleLogout);

    // --- Initialization on page load ---

    // Load and display profile data on start
    renderUserProfile();
    showSection('profile'); // Show profile view by default

    // Handle the "navbar-burger" for mobile devices (Bulma code)
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {
                const target = el.dataset.target;
                const $target = document.getElementById(target);
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
            });
        });
    }

    // Initialize session log if user just logged in
    const userActive = loadUserProfile();
    if (userActive && !sessionStorage.getItem('loggedSession')) {
        addLog('Session started');
        sessionStorage.setItem('loggedSession', 'true'); // Mark that session start log has been recorded
    }
});