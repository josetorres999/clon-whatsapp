const users = [];

//Unirse a la sala
function userJoin(id, username, room, avatar) {
  const user = { id, username, room, avatar };

  users.push(user);

  return user;
}

//Obtener usuario
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

//Salir de la sala
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

//Obtener todos los usuarios
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {userJoin,getCurrentUser,userLeave,getRoomUsers};
