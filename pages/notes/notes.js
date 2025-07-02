document.addEventListener('DOMContentLoaded', () => {
  const notesContainer = document.getElementById('notesContainer');
  const saveNoteBtn = document.getElementById('saveNoteBtn');
  const noteTextarea = document.getElementById('noteText');
  const noNotesMessage = document.getElementById('noNotesMessage');
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

  // Function to load and display notes
  function loadNotes() {
    notesContainer.innerHTML = ''; // Clear current notes
    const storedNotes = JSON.parse(localStorage.getItem('userNotes')) || {};
    const userNotes = storedNotes[currentUser] || [];

    if (userNotes.length === 0) {
      noNotesMessage.style.display = 'block'; // Show "no notes" message
      return;
    } else {
      noNotesMessage.style.display = 'none'; // Hide "no notes" message
    }

    userNotes.forEach((noteContent, index) => {
      const column = document.createElement('div');
      column.classList.add('column', 'is-one-third-desktop', 'is-half-tablet', 'is-two-thirds-mobile');

      const noteElement = document.createElement('div');
      noteElement.classList.add('box', 'note-card');

      noteElement.innerHTML = `
    <p class="subtitle is-6 has-text-dark">${noteContent}</p>
    <div class="buttons">
        <button class="button is-info is-small edit-note-btn" data-index="${index}">Edit</button>
        <button class="button is-danger is-small delete-note-btn" data-index="${index}">Delete</button>
    </div>
`;

      column.appendChild(noteElement);
      notesContainer.appendChild(column);
    });

    // Add event listeners to new edit/delete buttons
    document.querySelectorAll('.edit-note-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const index = event.target.dataset.index;
        editNote(index);
      });
    });

    document.querySelectorAll('.delete-note-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const index = event.target.dataset.index;
        if (confirm('Are you sure you want to delete this note?')) {
          deleteNote(index);
        }
      });
    });
  }

  // Function to save a new note
  saveNoteBtn.addEventListener('click', () => {
    const noteText = noteTextarea.value.trim();
    if (noteText) {
      const storedNotes = JSON.parse(localStorage.getItem('userNotes')) || {};
      if (!storedNotes[currentUser]) {
        storedNotes[currentUser] = [];
      }
      storedNotes[currentUser].push(noteText);
      localStorage.setItem('userNotes', JSON.stringify(storedNotes));
      noteTextarea.value = ''; // Clear the textarea
      loadNotes(); // Reload and display notes
    } else {
      alert('Note content cannot be empty.');
    }
  });

  // Function to delete a note
  function deleteNote(index) {
    const storedNotes = JSON.parse(localStorage.getItem('userNotes')) || {};
    let userNotes = storedNotes[currentUser] || [];

    userNotes.splice(index, 1); // Remove the note at the specified index

    storedNotes[currentUser] = userNotes;
    localStorage.setItem('userNotes', JSON.stringify(storedNotes));
    loadNotes(); // Reload and display notes
  }

  // Function to edit a note
  function editNote(index) {
    const storedNotes = JSON.parse(localStorage.getItem('userNotes')) || {};
    let userNotes = storedNotes[currentUser] || [];

    const currentNote = userNotes[index];
    const newNoteContent = prompt('Edit your note:', currentNote);

    if (newNoteContent !== null) { // If the user didn't cancel the prompt
      if (newNoteContent.trim() !== '') {
        userNotes[index] = newNoteContent.trim();
        storedNotes[currentUser] = userNotes;
        localStorage.setItem('userNotes', JSON.stringify(storedNotes));
        loadNotes(); // Reload and display notes
      } else {
        alert('Note content cannot be empty.');
      }
    }
  }

  // Event listener for the logout button in the navbar
  if (logoutBtnNav) {
    logoutBtnNav.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('userActive'); // Clear active user session
      window.location.href = '../login/login.html'; // Redirect to login page
    });
  }

  // Initial load of notes when the page is loaded
  loadNotes();
});