document.addEventListener('DOMContentLoaded', () => {
    // DOM element references
    const navUsername = document.getElementById('navUsername');
    const navAvatar = document.getElementById('navAvatar');
    const logoutBtnNav = document.getElementById('logoutBtnNav');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const noteTextArea = document.getElementById('noteText');
    const notesContainer = document.getElementById('notesContainer');
    const noNotesMessage = document.getElementById('noNotesMessage');

    let editingIndex = -1; // To store the index of the note being edited

    // Get active user from session
    const activeUser = JSON.parse(sessionStorage.getItem('userActive'));
    
    // Redirect to login if no active user
    if (!activeUser || !activeUser.email) {
        window.location.href = '../login/login.html';
        return;
    }

    // Update navbar with user info
    updateNavbar();

    // Initialize notes
    loadNotes();

    // Event listeners
    saveNoteBtn.addEventListener('click', handleSaveOrUpdateNote);
    if (logoutBtnNav) {
        logoutBtnNav.addEventListener('click', handleLogout);
    }

    // Function to update navbar user info
    function updateNavbar() {
        if (navUsername) {
            navUsername.textContent = activeUser.name || 'User';
        }
        if (navAvatar) {
            navAvatar.src = activeUser.avatar || 'https://via.placeholder.com/24/0000FF/FFFFFF?text=U';
        }
    }

    // Function to load and display notes
    function loadNotes() {
        const userNotesKey = `notes_${activeUser.email}`;
        const notes = JSON.parse(localStorage.getItem(userNotesKey)) || [];
        
        notesContainer.innerHTML = '';
        
        if (notes.length === 0) {
            noNotesMessage.style.display = 'block';
            return;
        }

        noNotesMessage.style.display = 'none';
        
        notes.forEach((note, index) => {
            const noteCard = createNoteCard(note, index);
            notesContainer.appendChild(noteCard);
        });
    }

    // Function to create a note card element
    function createNoteCard(note, index) {
        const column = document.createElement('div');
        column.className = 'column is-one-third-desktop is-half-tablet is-full-mobile';
        
        const card = document.createElement('div');
        card.className = 'card note-card';
        
        card.innerHTML = `
            <div class="card-content">
                <div class="content">
                    <p class="has-text-white">${note.text}</p>
                    <small class="has-text-grey-dark">${formatDate(note.date)}</small>
                </div>
            </div>
            <footer class="card-footer">
                <a href="#" class="card-footer-item button is-link is-small edit-btn" data-index="${index}">Edit</a>
                <a href="#" class="card-footer-item button is-danger is-small delete-btn" data-index="${index}">Delete</a>
            </footer>
        `;
        
        // Add event listener to delete button
        card.querySelector('.delete-btn').addEventListener('click', () => deleteNote(index));
        // Add event listener to edit button
        card.querySelector('.edit-btn').addEventListener('click', () => editNote(index));
        
        column.appendChild(card);
        return column;
    }

    // Function to format date
    function formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Function to handle saving or updating a note
    function handleSaveOrUpdateNote() {
        if (editingIndex === -1) {
            saveNewNote();
        } else {
            updateExistingNote();
        }
    }

    // Function to save a new note
    function saveNewNote() {
        const text = noteTextArea.value.trim();
        if (!text) return;

        const userNotesKey = `notes_${activeUser.email}`;
        const notes = JSON.parse(localStorage.getItem(userNotesKey)) || [];
        
        notes.unshift({
            text: text,
            date: new Date().toISOString()
        });
        
        localStorage.setItem(userNotesKey, JSON.stringify(notes));
        noteTextArea.value = '';
        loadNotes();
    }

    // Function to edit an existing note
    function editNote(index) {
        const userNotesKey = `notes_${activeUser.email}`;
        const notes = JSON.parse(localStorage.getItem(userNotesKey)) || [];
        const noteToEdit = notes[index];

        noteTextArea.value = noteToEdit.text;
        saveNoteBtn.textContent = 'Update Note';
        editingIndex = index;
    }

    // Function to update an existing note
    function updateExistingNote() {
        const text = noteTextArea.value.trim();
        if (!text) return;

        const userNotesKey = `notes_${activeUser.email}`;
        const notes = JSON.parse(localStorage.getItem(userNotesKey)) || [];
        
        notes[editingIndex].text = text;
        notes[editingIndex].date = new Date().toISOString(); // Update timestamp
        
        localStorage.setItem(userNotesKey, JSON.stringify(notes));
        noteTextArea.value = '';
        saveNoteBtn.textContent = 'Save Note';
        editingIndex = -1; // Reset editing index
        loadNotes();
    }

    // Function to delete a note
    function deleteNote(index) {
        if (!confirm('Are you sure you want to delete this note?')) return;
        
        const userNotesKey = `notes_${activeUser.email}`;
        const notes = JSON.parse(localStorage.getItem(userNotesKey)) || [];
        notes.splice(index, 1);
        localStorage.setItem(userNotesKey, JSON.stringify(notes));
        loadNotes();
    }

    // Function to handle logout
    function handleLogout(e) {
        e.preventDefault();
        sessionStorage.removeItem('userActive');
        window.location.href = '../login/login.html';
    }
});