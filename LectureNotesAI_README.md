# LectureNotes AI — Setup Guide

A complete AI-powered lecture notes platform matching the provided screenshots.

---

## Quick Start (3 options)

### Option A — Run in Claude.ai
Paste `LectureNotesAI.jsx` directly into Claude as a React artifact. It runs instantly with no setup.

### Option B — Vite + React (local dev)

```bash
npm create vite@latest lecture-notes -- --template react
cd lecture-notes
# Replace src/App.jsx with LectureNotesAI.jsx content
npm install
npm run dev
```
Open http://localhost:5173

### Option C — Replit / CodeSandbox
1. Create a new **React** project
2. Replace `App.jsx` with the contents of `LectureNotesAI.jsx`
3. Click Run

---

## Features Implemented

| Feature | Status |
|---|---|
| Dashboard with lecture grid/list | ✅ |
| Lecture cards (title, date, tags, status) | ✅ |
| Grid ↔ List view toggle | ✅ |
| Click lecture → detail view | ✅ |
| Summary tab (paragraph + bullets) | ✅ |
| Mindmap tab (SVG, interactive nodes) | ✅ |
| Diagrams tab (flowchart tree) | ✅ |
| Full Transcript tab (monospace) | ✅ |
| Record Lecture button → recording screen | ✅ |
| Live timer (00:29 format) | ✅ |
| Launch! → AI Processing spinner | ✅ |
| Cancel recording | ✅ |
| Join Classroom modal (code input) | ✅ |
| Sidebar: Personal Notes, Classrooms, Subjects | ✅ |
| Search bar (filters by title/summary) | ✅ |
| Dark theme matching screenshots exactly | ✅ |
| Mobile responsive | ✅ |
| Sample data: AI lecture with all disadvantages | ✅ |

---

## Adding Real AI (Backend Integration)

### 1. Transcription (Whisper API)
```js
// POST /api/transcribe
const formData = new FormData();
formData.append('audio', audioBlob, 'lecture.webm');
const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${OPENAI_KEY}` },
  body: formData,
});
const { text } = await res.json();
```

### 2. Summary + Mindmap (Claude / GPT-4)
```js
// POST /api/process
const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'x-api-key': CLAUDE_KEY, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-opus-4-20250514',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `Given this transcript:\n${transcript}\n\nReturn JSON with: summary (string), bullets (string[]), mindmap ({center, branches: [{label, color, children}]})`
    }]
  })
});
```

### 3. Database (SQLite via better-sqlite3)
```js
const db = new Database('lectures.db');
db.exec(`CREATE TABLE IF NOT EXISTS lectures (
  id INTEGER PRIMARY KEY,
  title TEXT, date TEXT, status TEXT,
  classroom_id TEXT, transcript TEXT,
  summary TEXT, mindmap_json TEXT
)`);
```

---

## File Structure (for full-stack version)

```
lecture-notes/
├── frontend/
│   ├── src/App.jsx          ← LectureNotesAI.jsx goes here
│   └── package.json
├── backend/
│   ├── index.js             ← Express/Fastify server
│   ├── routes/
│   │   ├── transcribe.js    ← Whisper API
│   │   ├── process.js       ← Claude/GPT summary+mindmap
│   │   └── lectures.js      ← CRUD
│   └── db/
│       └── schema.sql
└── README.md
```

---

## Tech Stack
- **Frontend:** React 18, Tailwind-like CSS-in-JS (no build deps needed)
- **Fonts:** Inter + JetBrains Mono (Google Fonts)
- **Mindmap:** Custom SVG renderer
- **Diagram:** Hierarchical flowchart component
- **AI:** Plug in OpenAI Whisper + Claude/GPT-4
- **DB:** SQLite (dev) / PostgreSQL (prod)
