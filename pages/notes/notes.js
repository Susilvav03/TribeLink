//Esperar que cargue el DOM para no tener interrupciones correctamente
document.addEventListener("DOMContentLoaded", () => {

    // llamar los elementos de HTML por medio del ID
    const inputNote = document.getElementById("newNote");
    const buttonKeep = document.getElementById("buttonSave");
    const containerNotes = document.getElementById("containerNotes");

    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    notes.forEach((note, index) => {
        createNote(note, index);
    });

    buttonKeep.addEventListener("click", () => {
    let text = inputNote.value.trim();
    if (text === "") return;

    notes.push(text);
    localStorage.setItem("notes", JSON.stringify(notes));
    createNote(text, notes.length - 1);
    inputNote.value = "";
    });

    function createNote(text, index) {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-3";
    col.setAttribute("data-index", index);

    col.innerHTML = `
    <div class="card note-card p-3">
        <p>${text}</p>
        <div class="note-actions">
            <a href="#" class="text-danger btn-eliminar">Delete</a>
            <a href="#" class="text-primary btn-editar">Edit</a>
        </div>
    </div>
    `;

    containerNotes.appendChild(col);

    col.querySelector(".btn-eliminar").addEventListener("click", (e) => {
        e.preventDefault();
        const i = parseInt(col.getAttribute("data-index"));
        notes.splice(i, 1);
        localStorage.setItem("notes", JSON.stringify(notes));
        containerNotes.innerHTML = "";
        notes.forEach((n, idx) => createNote(n, idx));
    });

    col.querySelector(".btn-editar").addEventListener("click", (e) => {
        e.preventDefault();
        const i = parseInt(col.getAttribute("data-index"));
        const newText = prompt("Edit note:", notes[i]);
        if (newText) {
            notes[i] = newText;
            localStorage.setItem("notes", JSON.stringify(notes));
            containerNotes.innerHTML = "";
            notes.forEach((n, idx) => createNote(n, idx));
        }
    });
    }
});

