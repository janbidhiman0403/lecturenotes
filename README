# 🎙️ LectureNotes — AI-Powered Lecture to Notes Platform

> Record a lecture. Get structured notes, summaries, and mind maps — automatically.

---

## 🚀 What It Does

**LectureNotes** is a full-stack web application that converts live teacher lectures or voice recordings into structured, AI-generated study material — in real time.

A teacher clicks **Record Lecture**. The AI transcribes it, summarises it, and generates a dynamic mind map. Students get organised, searchable notes without writing a single word.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎤 **Live Lecture Recording** | One-click recording directly from the browser |
| 🤖 **AI Transcription** | Converts audio to accurate structured text in real time |
| 📝 **Auto Summary** | Generates a concise lecture summary automatically |
| 🧠 **Mind Map Generation** | Creates dynamic visual mind maps from transcribed content |
| 🏫 **Classroom Manager** | Teachers create classes; students join with a unique code |
| 🔍 **Search** | Search across all your notes and lectures instantly |
| 👤 **Secure Auth** | Login using unique classroom codes — no email/password needed |
| 📚 **Multi-Subject Support** | Separate subject folders (Math, Physics, etc.) within one account |

---

## 🖥️ App Screens

### 📌 Dashboard — Recent Lectures
- Displays all recorded lectures in Grid or List view
- Each lecture card shows: date, AI-generated description, and quick links to **Mindmap** and **Summary**
- Search bar to find any lecture or note instantly

### ⚡ AI Processing Screen
- Shows real-time **"Transcribing... Processing audio data"** status
- Fully automated — no manual input required after recording ends

### 🏫 Classroom Manager
- **Join a Classroom** — enter a code from your teacher
- **Create New Class** — name it (e.g., "DAA", "Physics") and start sharing notes with students
- Multiple classrooms supported under one account

---

## 🛠️ Tech Stack

```
Frontend      →  HTML, CSS, JavaScript
Backend       →  Node.js
Database      →  MySQL / MongoDB
AI Layer      →  Speech-to-Text API, AI Summarisation, Mind Map Generation
Auth          →  Unique classroom code-based login (no email/password)
Platform      →  Web — Teacher & Student separate views
```

---

## 🎯 Problem It Solves

Students miss lectures. Notes go incomplete. Handwriting can't keep up with fast teachers.

LectureNotes removes the bottleneck entirely — the teacher records once, and every student gets complete, structured material:
- **Summary** → for quick revision before exams
- **Mind Map** → for visual learners
- **Full Transcript** → for deep reading

Built specifically for Indian classrooms where note-sharing is manual, inconsistent, and often lost on WhatsApp.

---

## 🏗️ Architecture

```
Teacher Records Lecture
        ↓
Audio Captured in Browser
        ↓
Sent to Backend (Node.js)
        ↓
AI Transcription (Speech-to-Text)
        ↓
AI Summary Generation  +  Mind Map Auto-Generated
        ↓
Stored in DB (MySQL / MongoDB)
        ↓
Student accesses via Classroom Code
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js v18+
- MySQL or MongoDB
- API key for AI transcription service

### Installation

```bash
# Clone the repo
git clone https://github.com/janbi-dhiman/lecturenotes.git

# Navigate to project
cd lecturenotes

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your DB credentials and AI API key in .env

# Start the server
npm start
```

Open `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
lecturenotes/
├── public/
│   ├── index.html
│   ├── dashboard.html
│   └── styles/
├── routes/
│   ├── auth.js
│   ├── lectures.js
│   └── classroom.js
├── controllers/
│   ├── lectureController.js
│   └── aiController.js
├── models/
│   ├── Lecture.js
│   └── Classroom.js
├── ai/
│   ├── transcribe.js
│   ├── summarise.js
│   └── mindmap.js
├── server.js
└── package.json
```

---

## 🔮 Roadmap

- [x] Live lecture recording in browser
- [x] AI transcription with real-time processing
- [x] Auto summary and mind map generation
- [x] Classroom code-based login
- [x] Multi-subject support
- [ ] Mobile app version (Android — in progress)
- [ ] Offline recording with sync
- [ ] Quiz auto-generation from lecture
- [ ] Student analytics dashboard for teachers
- [ ] Hindi / Punjabi language transcription support
- [ ] Export notes as PDF

---

## 👨‍💻 Built By

**Janbi Dhiman**
B.Tech CSE · ABVGIET Pragatinagar, Shimla
Android App Dev & ML Intern · EngineerCore / IIT Allahabad
Summer Intern · NIT Hamirpur 2026

[![LinkedIn](https://img.shields.io/badge/LinkedIn-janbi--dhiman-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/janbi-dhiman-2315843b9)

---

## 📄 License

MIT License — free to use, modify, and distribute with attribution.

---

> *"The best notes are the ones you don't have to take."*
