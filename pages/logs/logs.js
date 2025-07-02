document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const profileForm = document.getElementById('profileForm');
    const nameInput = document.getElementById('name');
    const lastnameInput = document.getElementById('lastname');
    const emailInput = document.getElementById('profileEmail');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const cityInput = document.getElementById('city');
    const countryInput = document.getElementById('country');
    const zipInput = document.getElementById('zip');
    const logsContainer = document.getElementById('logsContainer');
    const logoutBtn = document.getElementById('logoutBtn');

    // --- Funciones para manejar datos del usuario y logs ---

    // Carga los datos del perfil desde localStorage o devuelve un objeto vacío
    const loadUserProfile = () => {
        const user = localStorage.getItem('userProfile');
        return user ? JSON.parse(user) : {};
    };

    // Guarda los datos del perfil en localStorage
    const saveUserProfile = (userProfile) => {
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
    };

    // Carga los logs desde localStorage o devuelve un array vacío
    const loadLogs = () => {
        const logs = localStorage.getItem('userLogs');
        return logs ? JSON.parse(logs) : [];
    };

    // Guarda los logs en localStorage
    const saveLogs = (logs) => {
        localStorage.setItem('userLogs', JSON.stringify(logs));
    };

    // Añade un nuevo log al historial
    const addLog = (action) => {
        const logs = loadLogs();
        const now = new Date();
        const newLog = {
            user: "", // Podrías obtener el nombre de usuario de la sesión real
            action: action,
            date: now.toLocaleDateString('es-ES'),
            time: now.toLocaleTimeString('es-ES')
        };
        logs.unshift(newLog); // Añade el nuevo log al principio
        saveLogs(logs);
        renderLogs(); // Vuelve a renderizar los logs para que se vea el nuevo
    };

    // --- Funciones de Renderizado ---

    // Rellena los campos del formulario con los datos del perfil cargados
    const renderUserProfile = () => {
        const userProfile = loadUserProfile();
        nameInput.value = userProfile.name || '';
        lastnameInput.value = userProfile.lastname || '';
        emailInput.value = userProfile.email || '';
        phoneInput.value = userProfile.phone || '';
        addressInput.value = userProfile.address || '';
        cityInput.value = userProfile.city || '';
        countryInput.value = userProfile.country || '';
        zipInput.value = userProfile.zip || '';
    };

    // Renderiza el historial de actividad en el contenedor de logs
    const renderLogs = () => {
        const logs = loadLogs();
        if (logs.length === 0) {
            logsContainer.innerHTML = '<p>No activity recorded.</p>';
            return;
        }

        let logsHtml = `
            <table class="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Action</th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
        `;

        logs.forEach(log => {
            logsHtml += `
                <tr>
                    <td>${log.user}</td>
                    <td>${log.action}</td>
                    <td>${log.date}</td>
                    <td>${log.time}</td>
                </tr>
            `;
        });

        logsHtml += `
                </tbody>
            </table>
        `;
        logsContainer.innerHTML = logsHtml;
    };

    // --- Funciones de Validación ---

    // Función genérica para mostrar un mensaje de error debajo del input
    const showError = (inputElement, message) => {
        // Busca si ya existe un elemento p.help para el input (creado previamente)
        let errorHelp = inputElement.nextElementSibling;
        if (errorHelp && errorHelp.classList.contains('help')) {
            errorHelp.textContent = message;
            errorHelp.classList.add('is-danger');
        } else {
            // Crea un nuevo elemento p.help si no existe
            errorHelp = document.createElement('p');
            errorHelp.className = 'help is-danger';
            errorHelp.textContent = message;
            inputElement.parentNode.insertBefore(errorHelp, inputElement.nextSibling); // Inserta después del input
        }
        inputElement.classList.add('is-danger'); // Marca el input en rojo con la clase de Bulma
    };

    // Función genérica para ocultar un mensaje de error
    const hideError = (inputElement) => {
        let errorHelp = inputElement.nextElementSibling;
        if (errorHelp && errorHelp.classList.contains('help') && errorHelp.classList.contains('is-danger')) {
            errorHelp.remove(); // Elimina el elemento de ayuda
        }
        inputElement.classList.remove('is-danger'); // Quita el marcado en rojo del input
    };

    // Valida que un campo no esté vacío (obligatorio)
    const validateRequired = (inputElement, fieldName) => {
        if (inputElement.value.trim() === '') {
            showError(inputElement, `The ${fieldName} is mandatory.`);
            return false;
        }
        hideError(inputElement);
        return true;
    };

    // Valida el formato del correo electrónico usando una expresión regular
    const validateEmail = (inputElement) => {
        // Expresión regular para un formato de email básico (no es 100% estricta pero cubre la mayoría)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (inputElement.value.trim() !== '' && !emailRegex.test(inputElement.value.trim())) {
            showError(inputElement, 'Enter a valid email address (ej. usuario@dominio.com).');
            return false;
        }
        hideError(inputElement);
        return true;
    };

    // Valida que el campo contenga solo números
    const validateNumbersOnly = (inputElement, fieldName) => {
        const numberRegex = /^\d+$/; // Expresión regular para uno o más dígitos
        if (inputElement.value.trim() !== '' && !numberRegex.test(inputElement.value.trim())) {
            showError(inputElement, `The ${fieldName} must contain only numbers.`);
            return false;
        }
        hideError(inputElement);
        return true;
    };

    // Valida la longitud mínima y máxima para campos de texto (ej. nombre, apellido)
    const validateLength = (inputElement, fieldName, minLength, maxLength) => {
        const value = inputElement.value.trim();
        if (value.length < minLength) {
            showError(inputElement, `The ${fieldName} musht have at least ${minLength} characters.`);
            return false;
        }
        if (maxLength && value.length > maxLength) {
            showError(inputElement, `The ${fieldName} must not exceed ${maxLength} characters.`);
            return false;
        }
        hideError(inputElement);
        return true;
    };

    // --- Event Listeners ---

    // Maneja el envío del formulario de perfil
    profileForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita el envío del formulario por defecto

        // Reinicia todos los errores visibles antes de revalidar
        document.querySelectorAll('.input.is-danger').forEach(el => el.classList.remove('is-danger'));
        document.querySelectorAll('.help.is-danger').forEach(el => el.remove());

        let isValid = true; // Bandera para controlar si el formulario es válido

        // --- Aplicar todas las validaciones ---
        // Campos requeridos y con longitud mínima/máxima
        if (!validateRequired(nameInput, 'nombre')) isValid = false;
        else if (!validateLength(nameInput, 'nombre', 2, 50)) isValid = false; // Nombre entre 2 y 50 caracteres

        if (!validateRequired(lastnameInput, 'apellido')) isValid = false;
        else if (!validateLength(lastnameInput, 'apellido', 2, 50)) isValid = false; // Apellido entre 2 y 50 caracteres

        if (!validateRequired(emailInput, 'correo')) isValid = false;
        else if (!validateEmail(emailInput)) isValid = false;

        // Teléfono: no requerido, pero si tiene valor, debe ser numérico y con longitud adecuada
        if (phoneInput.value.trim() !== '') {
            if (!validateNumbersOnly(phoneInput, 'teléfono')) isValid = false;
            else if (!validateLength(phoneInput, 'teléfono', 7, 15)) isValid = false; // Teléfono entre 7 y 15 dígitos
        } else {
            hideError(phoneInput); // Asegurarse de que no haya error si está vacío
        }


        // Dirección, Ciudad, País: Se pueden hacer requeridos o no, en este caso los he dejado opcionales
        // pero puedes descomentar las líneas `validateRequired` si los necesitas obligatorios.
        if (addressInput.value.trim() !== '') {
            if (!validateLength(addressInput, 'dirección', 5, 100)) isValid = false;
        } else {
            hideError(addressInput);
        }

        if (cityInput.value.trim() !== '') {
            if (!validateLength(cityInput, 'ciudad', 2, 50)) isValid = false;
        } else {
            hideError(cityInput);
        }

        if (countryInput.value.trim() !== '') {
            if (!validateLength(countryInput, 'país', 2, 50)) isValid = false;
        } else {
            hideError(countryInput);
        }

        // Código Postal: no requerido, pero si tiene valor, debe ser numérico y con longitud adecuada
        if (zipInput.value.trim() !== '') {
            if (!validateNumbersOnly(zipInput, 'código postal')) isValid = false;
            else if (!validateLength(zipInput, 'código postal', 3, 10)) isValid = false; // Ej: Códigos postales de 3 a 10 dígitos
        } else {
            hideError(zipInput); // Asegurarse de que no haya error si está vacío
        }


        // Si alguna validación falló, se notifica al usuario y se detiene el proceso
        if (!isValid) {
            alert('Please correct the errors highlighted in the form..');
            return;
        }

        // Si todas las validaciones pasan, se guarda la información
        const updatedProfile = {
            name: nameInput.value,
            lastname: lastnameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            address: addressInput.value,
            city: cityInput.value,
            country: countryInput.value,
            zip: zipInput.value
        };

        saveUserProfile(updatedProfile); // Guarda el perfil actualizado
        addLog('Updated profile information'); // Registra la acción
        alert('¡Successfully updated profile!'); // Notifica al usuario
    });

    // --- Validaciones en tiempo real (al perder el foco del campo) ---
    // Esto es útil para dar feedback inmediato al usuario
    nameInput.addEventListener('blur', () => {
        validateRequired(nameInput, 'nombre');
        validateLength(nameInput, 'nombre', 2, 50);
    });
    lastnameInput.addEventListener('blur', () => {
        validateRequired(lastnameInput, 'apellido');
        validateLength(lastnameInput, 'apellido', 2, 50);
    });
    emailInput.addEventListener('blur', () => {
        validateRequired(emailInput, 'correo');
        validateEmail(emailInput);
    });
    phoneInput.addEventListener('blur', () => {
        validateNumbersOnly(phoneInput, 'teléfono');
        if (phoneInput.value.trim() !== '') {
            validateLength(phoneInput, 'teléfono', 7, 15);
        }
    });
    addressInput.addEventListener('blur', () => {
        if (addressInput.value.trim() !== '') {
            validateLength(addressInput, 'dirección', 5, 100);
        } else {
            hideError(addressInput); // Si se deja vacío y no es requerido, quitar error
        }
    });
    cityInput.addEventListener('blur', () => {
        if (cityInput.value.trim() !== '') {
            validateLength(cityInput, 'ciudad', 2, 50);
        } else {
            hideError(cityInput);
        }
    });
    countryInput.addEventListener('blur', () => {
        if (countryInput.value.trim() !== '') {
            validateLength(countryInput, 'país', 2, 50);
        } else {
            hideError(countryInput);
        }
    });
    zipInput.addEventListener('blur', () => {
        validateNumbersOnly(zipInput, 'código postal');
        if (zipInput.value.trim() !== '') {
            validateLength(zipInput, 'código postal', 3, 10);
        }
    });


    // Maneja el clic en el botón de cerrar sesión
    logoutBtn.addEventListener('click', () => {
        addLog('Closed session'); // Registra la acción de cerrar sesión
        // En una aplicación real, aquí borrarías la sesión del usuario (e.g., tokens, cookies)
        // y lo redirigirías a la página de inicio de sesión.
        alert('You have logged out.');
        // Opcional: Redirigir al usuario (ejemplo: window.location.href = '/login.html';)
        // Para limpiar localStorage al cerrar sesión (opcional, dependiendo de tu lógica):
        // localStorage.removeItem('userProfile');
        // localStorage.removeItem('userLogs');
    });

    // --- Inicialización ---
    // Carga y muestra los datos del perfil y los logs al cargar la página
    renderUserProfile();
    renderLogs();
    addLog('Login'); // Registra que el usuario ha "iniciado sesión" al cargar la página
});