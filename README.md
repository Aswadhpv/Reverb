# 🎵 Reverb - Collaborative Music Creation Platform

Reverb is a full-stack music collaboration web app where musicians can collaborate in real-time, edit and mix audio tracks, invite friends, and save session results. It uses a modern tech stack with separate modules for frontend (React), backend (Node.js/Express), and audio processing service (Python).

## 🌐 Project Structure
```
Reverb/
├── frontend/           # React.js UI with Auth, Sessions, Chat, PluginRack
├── backend/            # Express.js API + MongoDB + Socket.IO
├── audio-service/      # Python audio processor (WAV effects)
├── README.md           # Root project documentation
```

## 📦 Requirements
- Node.js (v18+)
- MongoDB (local or cloud)
- Python 3.9+

## 🚀 Running the Project
Start each service separately:

### 1. Backend
```bash
cd backend
npm install
npm start
```

### 2. Frontend
```bash
cd frontend
npm install
npm start
```

### 3. Audio Service
```bash
cd audio-service
pip install -r requirements.txt
python app.py
```

### 🔐 Swagger Docs
Visit: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

---
## ✨ Features
- 🎙 Real-time audio editing and session collaboration
- 📁 Drag & Drop audio uploads, waveform visualization
- 🔌 PluginRack: Apply FL Studio-like effects (reverb, chorus, etc.)
- 💬 Live chat, invite friends, accept/reject invites
- 📚 Personal Library and Save-to-Library support
- 🎛 Wavesurfer.js powered editor bar

## Ports
- http://localhost:3000 (frontend)
- http://localhost:5000/api/docs (backend)
- http://localhost:6000 (audio-service)

## 📂 Module READMEs
- [`backend/README.md`](./backend/README.md)
- [`frontend/README.md`](./frontend/README.md)
- [`audio-service/README.md`](./audio-service/README.md)

---

## 👨‍💻 Created By

**Aswadh Puthen Veede**

---

## 🛠 Technologies Used

- **Frontend**: React.js, Tailwind CSS, Wavesurfer.js, Axios, React Router
- **Backend**: Node.js, Express.js, MongoDB, Multer, JWT, Socket.IO
- **Audio Service**: Python (Flask), SciPy, NumPy
- **Other**: Swagger for API docs, dotenv, cors, React Context API  
