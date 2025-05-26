# 🎯 Backend - Reverb Platform

Node.js + Express backend for managing users, sessions, chat, and audio file operations.

## 📦 Setup
```bash
cd backend
npm install
npm start
```

## 🔐 .env Example
```
MONGO_URI=mongodb://localhost:27017/reverb
JWT_SECRET=your-secure-secret
PORT=5000
AUDIO_SERVICE_URL=http://localhost:6000
```

## 📁 Routes
- `/api/auth` - Login/Register/Logout
- `/api/home` - Home page features API
- `/api/collaboration` - Sessions, Files, Plugins
- `/api/friends` - Friend management
- `/api/profile` - User profile and upload pic

## 📘 Swagger Docs
- Visit: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

## 📡 WebSocket Events
- `joinSession`, `leaveSession`, `chatMessage`, `applyPlugin`

## 📂 Multer Uploads
- Audio: `uploads/audio/`
- Profile: `uploads/profilePics/`
