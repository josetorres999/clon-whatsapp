const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var contador = 0;


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));



io.on('connection', (socket) => {
  console.log('a user connected');
  contador++;
  console.log("Hay "+contador+" usuarios");


  socket.on('logueo', (msg)=>{
    console.log("Me has mandado un correo "+msg);
    socket.broadcast.emit("msg_chat",msg);
  });


  socket.on('disconnect', () => {
    console.log('user disconnected');
    contador--;
    console.log("Hay "+contador+" usuarios");
  });
  
});



server.listen(3000, () => {
  console.log('listening on *:3000');
});
