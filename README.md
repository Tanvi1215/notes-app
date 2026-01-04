# Minimal Notepad

A small, clean notes web app — create, save, view and delete simple text notes stored locally in your browser.

## Features

- Create and title notes
- Save notes to localStorage
- View a list of saved notes with timestamps
- Load a saved note for editing
- Delete individual notes (with confirmation)
- Keyboard shortcuts: Ctrl/Cmd+S to save, Ctrl/Cmd+N for a new note
- Small save-confirmation toast

## Tech Stack

- Plain HTML, CSS, and JavaScript
- Browser `localStorage` for persistence

## Files

- `index.html` — app UI
- `style.css` — styles and responsive layout
- `script.js` — notes logic (save/load/delete, keyboard shortcuts)

## Run locally

1. Open the app directly in your browser by double-clicking `index.html`.

OR run a simple local server (recommended for consistent behavior):

Windows / PowerShell:

```powershell
python -m http.server 8000
```

macOS / Linux:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser and navigate to the project folder.

## Notes

- Notes are stored only in the current browser on your device (no sync or server).
- The project is intentionally minimal — feel free to extend with tags, search, or export/import.

---

Enjoy — open [index.html](index.html) to start taking notes.
