require('dotenv').config();
const mongoose = require('mongoose');
const Message = require('./models/Message');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const roomUsers = {};

app.use(express.static('public'));

app.get('/messages', async (req, res) => {
    try {
        const room = req.query.room || 'general';
        const messages = await Message.find({ room })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(messages.reverse());
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_chat', ({ username, room }) => {
        socket.username = username;
        socket.room = room;
        socket.join(room);

        if (!roomUsers[room]) roomUsers[room] = new Set();
        roomUsers[room].add(username);

        console.log(`${username} joined room: ${room}`);
        socket.to(room).emit('user_joined', username);
        io.to(room).emit('user_list', Array.from(roomUsers[room]));
    });

    socket.on('send_message', async (data) => {
        try {
            const savedMessage = await Message.create({
                username: data.username,
                message: data.message,
                senderId: socket.id,
                time: data.time,
                room: data.room
            });

            console.log('Message saved:', savedMessage);

            io.to(data.room).emit('receive_message', {
                ...data,
                senderId: socket.id
            });
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('leave_chat', ({ username, room }) => {
        socket.leave(room);

        if (roomUsers[room]) {
            roomUsers[room].delete(username);
            io.to(room).emit('user_list', Array.from(roomUsers[room]));
        }

        socket.to(room).emit('user_left', username);
        console.log(`${username} left room: ${room}`);
        socket.username = null;
        socket.room = null;
    });

    socket.on('disconnect', () => {
        if (socket.username && socket.room) {
            console.log(`${socket.username} left room: ${socket.room}`);

            if (roomUsers[socket.room]) {
                roomUsers[socket.room].delete(socket.username);
                io.to(socket.room).emit('user_list', Array.from(roomUsers[socket.room]));
            }

            socket.to(socket.room).emit('user_left', socket.username);
        }
    });
});

const PORT = 3000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected');

        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });
