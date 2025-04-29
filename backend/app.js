require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const http    = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

connectDB();
const app = express();
app.use(cors(), express.json());

// Swagger
const swaggerUi = require('swagger-ui-express');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(require('./swagger.json')));

// Routes
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/profile',       require('./routes/profile'));
app.use('/api/home',          require('./routes/home'));
app.use('/api/friends',       require('./routes/friends'));
app.use('/api/collaboration', require('./routes/collaboration'));

const server = http.createServer(app);
const io = new Server(server, { cors:{ origin:'*' } });

io.on('connection', socket => {
    socket.on('joinSession', ({ sessionId }) => socket.join(sessionId));
    socket.on('audioData', ({ sessionId, buffer }) =>
        socket.to(sessionId).emit('audioData', buffer)
    );
    socket.on('chatMessage', ({ sessionId, msg }) =>
        io.to(sessionId).emit('chatMessage', msg)
    );
});

server.listen(process.env.PORT, () =>
    console.log(`Backend listening on ${process.env.PORT}`)
);
