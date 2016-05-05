// User Chat
var nicknames = {};
exports = module.exports = function(io){

  io.on('connection', function(socket){

    // Chat Proyecto
    socket.on('newUser', function(user,projectId){
      socket.join(projectId);
      socket.nickname = user;
      socket.projectId = projectId;
      nicknames[socket.projectId] = nicknames[socket.projectId] || {};
      nicknames[socket.projectId][socket.nickname] = 1;
      io.in(projectId).emit('newUser', nicknames[socket.projectId]);
    });

    socket.on('sendMessage', function(msg){
      io.in(socket.projectId).emit('newMessage', {msg: msg, nick: socket.nickname});
    });

    socket.on('disconnect', function(data) {
      if(!socket.nickname) return;
      delete nicknames[socket.projectId][socket.nickname];
      io.in(socket.projectId).emit('newUser', nicknames[socket.projectId]);
    });

  });
}
