window.onload = ()=>{
  var chatForm = document.getElementById('chat-form');
  var chatMessages = document.querySelector('.chat-messages');
  var roomName = document.getElementById('room-name');
  var userList = document.getElementById('users');


  // COnseguir el usuario mediante la URL
  const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const socket = io();

  // Sala a la que se une
  socket.emit('joinRoom', { username, room });


  socket.on('roomUsers', ({ room, users }) => {
    roomName.innerText = room;
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  });

  //Recibe un mensaje
  socket.on('message', (message) => {  

    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);

    
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let msg = e.target.elements.msg.value;

    if (!msg) {
      return false;
      }
    socket.emit('chatMessage', msg);
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
  });

  document.getElementById('boton-salir').addEventListener('click', () => {
    const leaveRoom = confirm('¿Seguro que quieres salir?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });
}
