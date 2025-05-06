require('dotenv').config();
const open = require('open');
const express = require('express');
const cors    = require('cors');
const http    = require('http');
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

// Swagger API Docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/profile',       require('./routes/profile'));
app.use('/api/home',          require('./routes/home'));
app.use('/api/friends',       require('./routes/friends'));
app.use('/api/collaboration', require('./routes/collaboration'));

// Global Error Handler (optional good practice)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: "Internal server error" });
});

// Create HTTP server + Socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

// Socket.io Events
io.on('connection', socket => {
    console.log('A user connected');

    socket.on('joinSession', ({ sessionId }) => {
        socket.join(sessionId);
    });

    socket.on('audioData', ({ sessionId, buffer }) => {
        socket.to(sessionId).emit('audioData', buffer);
    });

    socket.on('chatMessage', ({ sessionId, msg }) => {
        io.to(sessionId).emit('chatMessage', msg);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
    open(`http://localhost:${PORT}/api/docs`);
});
