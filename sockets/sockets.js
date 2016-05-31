// User Chat
var nicknames = {};

// Check User
var user_connect = {};

// Importamos modelo DB
var models = require('../models/models.js');


exports = module.exports = function(io){

  io.on('connection', function(socket){

    socket.on('disconnect', function(data) {
      user_connect[socket.userId] = 'standby';
      socket.leave(socket.userId);
      io.in(socket.userId).emit('checkUserCli', socket.userId);
      setTimeout(function () {
        if (user_connect[socket.userId] != true) {
          delete user_connect[socket.userId];
          models.User.find({where: {id: socket.userId} })
          .then(function(user){
            if (user) {
            if (user.online) {
              user.online = false;
              delete user_connect[socket.userId];
              user.save({fields: ["online"]});
            }}
            for (var id in socket.chat) {
              io.in('contact_'+id).emit('emitMessage', {msg: socket.chat[id]['contactName']+' se ha desconectado.', nick: 'chat', id: id});
            }
          })};
      }, 2000);
      if(!socket.nickname) return;
      delete nicknames[socket.projectId][socket.nickname];
      io.in(socket.projectId).emit('newUser', nicknames[socket.projectId]);
      socket.leave(socket.projectId);
    });

    socket.on('checkUserSer', function(data){
      user_connect[data] = true;
    });

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
    // End Chat Proyecto

    // Mensajes
    socket.on('newSession', function(userId, username){
      socket.join(userId);
      socket.chat = {};
      socket.userId = userId;
      if (!user_connect[socket.userId]) {
        models.User.find({where: {id: socket.userId} })
        .then(function(user){
          if (!user.online) {
            user.online = true;
            user.save({fields: ["online"]});
          }
        });
      }
      user_connect[socket.userId] = true;
      socket.username = username;
      socket.messages = 0;
      models.Message.count(
        {where: {mes_recivier: userId, mes_read: '0'}
      }).then(function(messages){
        socket.messages = messages;
        io.in(userId).emit('countMessage', {count: socket.messages});
      });
    });

    socket.on('addMessage', function(contactId){
      io.in(contactId).emit('countMessage', {count: 1});
    });

    socket.on('readMessage', function(contactId){
      io.in(contactId).emit('countMessage', {count: -1});
    });
    // End Mensajes

    // Chat Contactos
    socket.on('newChat', function(id, contactId, contactName){
      socket.chat[id] = {id: contactId, contactName: contactName};
      socket.join('contact_'+id);
      io.in(contactId).emit('openChat', id, socket.userId, socket.username);
      if (user_connect[contactId] == true) {
        io.in('contact_'+id).emit('emitMessage', {msg: 'Estais conectados', nick: 'chat', id: id});
      } else {
        io.in('contact_'+id).emit('emitMessage', {msg: contactName+' no esta online. Los mensajes que le escribas no le llegarán. El chat no guarda conversaciones.', nick: 'chat', id: id});
      }
    });

    socket.on('joinChat', function(id, contactId, contactName){
      socket.chat[id] = {id: contactId, contactName: contactName};
      socket.join('contact_'+id);
    });

    socket.on('newMessage', function(id, message){
      io.in('contact_'+id).emit('emitMessage', {msg: message, nick: socket.username, id: id, contactId: socket.userId});
    });
    // End Chat Contactos

  });
}
