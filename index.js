const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'BotWhatsapp';

//Se conecta el cliente
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room, avatar }) => {
    const user = userJoin(socket.id, username, room, avatar);
    socket.join(user.room);
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} se ha unido a la sala`));
    io.to(user.room).emit('roomUsers', {room: user.room,users: getRoomUsers(user.room),avatar: user.avatar});
  });

  //Cuando recibe un mensaje
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
    console.log("Mensaje recibido" + msg);
  });

  //muestra cuando un usuario se desconecta
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} ha salido de la sala`));
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
