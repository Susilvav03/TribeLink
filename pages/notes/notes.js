// Función para cargar y mostrar las notas

function loadNotes() {
  const notesContainer = document.getElementById('notesContainer');
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notesContainer.innerHTML = ''; // Limpiar notas actuales
  notes.forEach((note, index) => {
    const noteElement = document.createElement('div');
    noteElement.className = 'box';
    noteElement.innerHTML = `
      <p>${note}</p>
      <button class="button is-danger is-small" onclick="deleteNote(${index})">Eliminar</button>
    `;
    notesContainer.appendChild(noteElement);
  });
}

// Función para guardar una nota
  
document.getElementById('saveNoteBtn').addEventListener('click', 
function () {
  const noteText = document.getElementById('noteText').value.trim();
  if (noteText) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(noteText);
    localStorage.setItem('notes', JSON.stringify(notes));
    document.getElementById('noteText').value = '';
    loadNotes();
  }
});

// Función para eliminar una nota
function deleteNote(index) {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.splice(index, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
  loadNotes();
}

// Cargar notas al inicio
window.addEventListener('DOMContentLoaded', loadNotes);

