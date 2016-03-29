// Importamos modelo DB
var models = require('../models/models.js');

// User Chat
exports = module.exports = function(io){

  io.on('connection', function(socket){

    socket.on('newSession', function(userId, username){
      socket.join(userId);
      socket.userId = userId;
      socket.username = username;
      socket.messages = 0;
      models.Message.count(
        {where: {mes_recivier: userId, mes_read: '0'}
      }).then(function(messages){
        socket.messages = messages;
        io.in(userId).emit('countMessage', {count: socket.messages});
      });
    });

    socket.on('newConversation', function(id){
      socket.join('contact_'+id);
    });

    socket.on('newMessage', function(id, contactId, message){
      io.in(contactId).emit('countMessage', {count: 1});
      io.in('contact_'+id).emit('emitMessage', {msg: message, nick: socket.username});
    });

    socket.on('readMessage', function(id, contactId, message){
      io.in(contactId).emit('countMessage', {count: -1});
    });

  });
}
