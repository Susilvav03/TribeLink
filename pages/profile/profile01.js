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
            user: "Usuario Actual", // Podrías obtener el nombre de usuario de la sesión real
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
            logsContainer.innerHTML = '<p>No hay actividad registrada.</p>';
            return;
        }

        let logsHtml = `
            <table class="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Acción</th>
                        <th>Fecha</th>
                        <th>Hora</th>
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

    // --- Event Listeners ---

    // Maneja el envío del formulario de perfil
    profileForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita el envío del formulario por defecto

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
        addLog('Información de perfil actualizada'); // Registra la acción
        alert('¡Perfil actualizado con éxito!'); // Notifica al usuario
    });

    // Maneja el clic en el botón de cerrar sesión
    logoutBtn.addEventListener('click', () => {
        addLog('Sesión cerrada'); // Registra la acción de cerrar sesión
        // En una aplicación real, aquí borrarías la sesión del usuario (e.g., tokens, cookies)
        // y lo redirigirías a la página de inicio de sesión.
        alert('Has cerrado sesión.');
        // Opcional: Redirigir al usuario
        // window.location.href = '/login.html';
    });

    // --- Inicialización ---
    // Carga y muestra los datos del perfil y los logs al cargar la página
    renderUserProfile();
    renderLogs();
    addLog('Inicio de sesión'); // Registra que el usuario ha "iniciado sesión" al cargar la página
});