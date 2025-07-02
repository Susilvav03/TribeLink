document.addEventListener('DOMContentLoaded', () => {
    // References to DOM elements
    const logsContainer = document.getElementById('logsContainer');
    const navUsername = document.getElementById('navUsername');
    const navAvatar = document.getElementById('navAvatar');
    const logoutBtnNav = document.getElementById('logoutBtnNav');

    // Get active user from session storage
    const activeUser = JSON.parse(sessionStorage.getItem('userActive'));
    let currentUser = null;

    if (activeUser && activeUser.email) {
        currentUser = activeUser.email;
        // Update navbar with user info
        if (navUsername) {
            navUsername.textContent = activeUser.name || 'User';
        }
        if (navAvatar) {
            navAvatar.src = activeUser.avatar || 'https://via.placeholder.com/24/0000FF/FFFFFF?text=U';
        }
    } else {
        // Redirect to login if no active user
        window.location.href = '../login/login.html';
        return;
    }

    // --- Functions for handling logs ---

    // Loads logs from localStorage
    const loadLogs = () => {
        const logs = localStorage.getItem('userLogs');
        return logs ? JSON.parse(logs) : [];
    };

    // Saves logs to localStorage
    const saveLogs = (logs) => {
        localStorage.setItem('userLogs', JSON.stringify(logs));
    };

    // Adds a new log entry (in English)
    const addLog = (action) => {
        const logs = loadLogs();
        const now = new Date();
        const userName = activeUser.name || "Guest";
        const newLog = {
            user: userName,
            action: action,
            date: now.toLocaleDateString('en-US'),
            time: now.toLocaleTimeString('en-US')
        };
        logs.unshift(newLog);
        saveLogs(logs);
        renderLogs();
    };

    // Renders the activity logs
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

    // Logout functionality
    if (logoutBtnNav) {
        logoutBtnNav.addEventListener('click', (e) => {
            e.preventDefault();
            addLog('Logged out');
            sessionStorage.removeItem('userActive');
            alert('You have logged out.');
            window.location.href = '../login/login.html';
        });
    }

    // Initialize page
    renderLogs();
    addLog('User logged in'); // English log message
});