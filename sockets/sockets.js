// User Chat
var nicknames = {};
exports = module.exports = function(io){
  io.on('connection', function(socket){

    socket.on('sendMessage', function(msg){
      console.log(msg);
      io.emit('newMessage', {msg: msg, nick: socket.nickname});
    });

    socket.on('newUser', function(user){
      socket.nickname = user;
      nicknames[socket.nickname] = 1;
      io.emit('newUser', nicknames);
    });

    socket.on('disconnect', function(data) {
      if(!socket.nickname) return;
      delete nicknames[socket.nickname];
      io.emit('newUser', nicknames);
    });

  });
}
