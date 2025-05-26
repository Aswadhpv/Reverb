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

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ✅ Serve audio and profile uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/audio', express.static(path.join(__dirname, 'uploads/audio')));
app.use('/uploads/profilePics', express.static(path.join(__dirname, 'uploads/profilePics')));

// Ensure upload directories exist
['uploads/audio', 'uploads/profilePics'].forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

// Swagger Docs
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

let connectedUsers = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinSession', ({ sessionId, username }) => {
        socket.join(sessionId);
        connectedUsers[socket.id] = { sessionId, username };
        socket.to(sessionId).emit('userJoined', { username });
    });

    socket.on('leaveSession', () => {
        const { sessionId, username } = connectedUsers[socket.id] || {};
        if (sessionId && username) {
            socket.leave(sessionId);
            socket.to(sessionId).emit('userLeft', { username });
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
            delete connectedUsers[socket.id];
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
    open(`http://localhost:${PORT}/api/docs`);
});
