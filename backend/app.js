require('dotenv').config();
const open = require('open');
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ expose uploaded/processed audio files
app.use('/uploads/audio', express.static(path.join(__dirname, 'uploads/audio')));

// Ensure profile upload directory exists
const profileUploadPath = path.join(__dirname, 'uploads', 'profilePics');
if (!fs.existsSync(profileUploadPath)) {
    fs.mkdirSync(profileUploadPath, { recursive: true });
}

// For Profile photo
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger API Docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/home', require('./routes/home'));
app.use('/api/friends', require('./routes/friends'));
app.use('/api/collaboration', require('./routes/collaboration'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: "Internal server error" });
});

// Create HTTP server + Socket.io
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Track connected users in memory (simple)
let connectedUsers = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinSession', ({ sessionId, username }) => {
        socket.join(sessionId);
        connectedUsers[socket.id] = { sessionId, username };
        console.log(`${username} joined session ${sessionId}`);

        // Notify others in the room
        socket.to(sessionId).emit('userJoined', { username });
    });

    socket.on('leaveSession', () => {
        const { sessionId, username } = connectedUsers[socket.id] || {};
        if (sessionId && username) {
            socket.leave(sessionId);
            socket.to(sessionId).emit('userLeft', { username });
            console.log(`${username} left session ${sessionId}`);
            delete connectedUsers[socket.id];
        }
    });

    socket.on('audioData', ({ sessionId, buffer }) => {
        socket.to(sessionId).emit('audioData', buffer);
    });

    socket.on('chatMessage', ({ sessionId, username, msg }) => {
        io.to(sessionId).emit('chatMessage', { username, msg });
    });

    socket.on('applyPlugin', ({ sessionId, pluginName }) => {
        io.to(sessionId).emit('pluginApplied', { pluginName });
    });

    socket.on('disconnect', () => {
        const { sessionId, username } = connectedUsers[socket.id] || {};
        if (sessionId && username) {
            socket.to(sessionId).emit('userLeft', { username });
            console.log(`${username} disconnected from session ${sessionId}`);
            delete connectedUsers[socket.id];
        } else {
            console.log('A user disconnected:', socket.id);
        }
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
    open(`http://localhost:${PORT}/api/docs`);
});
