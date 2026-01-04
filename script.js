const NOTES_KEY = "minimal-notes";
const STATUS_TIMEOUT = 1000;

const noteTitle = document.getElementById("noteTitle");
const noteArea = document.getElementById("noteArea");
const statusLabel = document.getElementById("status");
const clearButton = document.getElementById("clearNote");
const newButton = document.getElementById("newNote");
const saveButton = document.getElementById("saveNote");
const clearSavedButton = document.getElementById("clearSaved");
const savedList = document.getElementById("savedList");

let statusTimer;
let editingId = null;

function getNotes() {
  try {
    return JSON.parse(localStorage.getItem(NOTES_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function setNotes(notes) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function setStatus(text) {
  statusLabel.textContent = text;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    statusLabel.textContent = "Idle";
  }, STATUS_TIMEOUT);
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

function renderSavedList() {
  const notes = getNotes();
  savedList.innerHTML = "";
  if (!notes.length) {
    savedList.innerHTML = '<p class="note-card">No saved notes</p>';
    return;
  }

  notes.slice().reverse().forEach((note) => {
    const el = document.createElement("div");
    el.className = "note-card";

    const title = document.createElement("h3");
    title.className = "note-card__title";
    title.textContent = note.title || "Untitled";

    const meta = document.createElement("div");
    meta.className = "note-card__meta";
    meta.textContent = formatDate(note.updatedAt || note.createdAt);

    const text = document.createElement("p");
    text.className = "note-card__text";
    text.textContent = note.text.length > 200 ? note.text.slice(0, 200) + "…" : note.text;

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.gap = "8px";

    const loadBtn = document.createElement("button");
    loadBtn.className = "button secondary";
    loadBtn.textContent = "Load";
    loadBtn.addEventListener("click", () => loadNote(note.id));

    const delBtn = document.createElement("button");
    delBtn.className = "link-button";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteNote(note.id));

    actions.appendChild(loadBtn);
    actions.appendChild(delBtn);

    el.appendChild(title);
    el.appendChild(meta);
    el.appendChild(text);
    el.appendChild(actions);

    savedList.appendChild(el);
  });
}

function loadNote(id) {
  const notes = getNotes();
  const note = notes.find((n) => n.id === id);
  if (!note) return;
  editingId = note.id;
  noteTitle.value = note.title || "";
  noteArea.value = note.text || "";
  setStatus("Loaded");
}

function saveNoteHandler() {
  const title = (noteTitle.value || "").trim();
  const text = (noteArea.value || "").trim();
  const notes = getNotes();
  const now = Date.now();

  if (editingId) {
    const idx = notes.findIndex((n) => n.id === editingId);
    if (idx > -1) {
      notes[idx].title = title;
      notes[idx].text = text;
      notes[idx].updatedAt = now;
      setNotes(notes);
      setStatus("Saved");
      showSaveConfirm();
      renderSavedList();
      return;
    }
  }

  const note = {
    id: String(now),
    title: title || "Untitled",
    text,
    createdAt: now,
    updatedAt: now,
  };
  notes.push(note);
  setNotes(notes);
  editingId = note.id;
  setStatus("Saved");
  showSaveConfirm();
  renderSavedList();
}

function showSaveConfirm() {
  let el = document.querySelector('.save-confirm');
  if (!el) {
    el = document.createElement('div');
    el.className = 'save-confirm';
    el.textContent = 'Saved';
    const app = document.querySelector('.app') || document.body;
    app.appendChild(el);
  }
  el.classList.add('show');
  clearTimeout(window.__saveConfirmTimer);
  window.__saveConfirmTimer = setTimeout(() => {
    el.classList.remove('show');
  }, 1200);
}

function deleteNote(id) {
  if (!window.confirm("Delete this note?")) return;
  let notes = getNotes();
  notes = notes.filter((n) => n.id !== id);
  setNotes(notes);
  if (editingId === id) {
    editingId = null;
    noteTitle.value = "";
    noteArea.value = "";
  }
  renderSavedList();
  setStatus("Deleted");
}

function clearCurrentNote() {
  if (!noteArea.value && !noteTitle.value) return;
  if (!window.confirm("Clear the current note?")) return;
  editingId = null;
  noteTitle.value = "";
  noteArea.value = "";
  setStatus("Cleared");
}

function newNoteHandler() {
  if ((noteArea.value || noteTitle.value) && !window.confirm("Start a new blank note?")) return;
  editingId = null;
  noteTitle.value = "";
  noteArea.value = "";
  setStatus("New");
}

function clearAllSaved() {
  if (!window.confirm("Delete all saved notes?")) return;
  localStorage.removeItem(NOTES_KEY);
  renderSavedList();
  setStatus("All cleared");
}

// wire events
saveButton.addEventListener("click", saveNoteHandler);
clearButton.addEventListener("click", clearCurrentNote);
newButton.addEventListener("click", newNoteHandler);
clearSavedButton.addEventListener("click", clearAllSaved);

// keyboard shortcuts: Ctrl/Cmd+S to save, Ctrl/Cmd+N to create new note
document.addEventListener('keydown', (e) => {
  const mod = e.metaKey || e.ctrlKey;
  if (!mod) return;
  const key = (e.key || '').toLowerCase();
  if (key === 's') {
    e.preventDefault();
    saveNoteHandler();
  }
  if (key === 'n') {
    e.preventDefault();
    newNoteHandler();
  }
});

// load on start
renderSavedList();
noteArea.focus();
