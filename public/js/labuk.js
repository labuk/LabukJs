// function Fecha DB
function getDate (data) {
  var day = new Date(data);
  var dd = day.getDate();
  var ds = day.getDay();
  var mm = day.getMonth()+1; //January is 0!
  var yyyy = day.getFullYear();

  var daysWeek = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  var resDate =  [ dd+'/'+mm+'/'+yyyy, daysWeek[ds]+' '+dd ];
  return resDate;
}

// Function Prioridad
function get_prioridad(prioridad) {
	if (prioridad === 0) {return 'General';}
	if (prioridad === 1) {return 'Esencial';}
	if (prioridad === 2) {return 'Util';}
	if (prioridad === 3) {return 'Laborioso';}
	if (prioridad === 4) {return 'Desechado';}
};

// Function Estado Piece
function get_estado(estado) {
	if (estado === 0) {return 'En cola';}
	if (estado === 1) {return 'En desarrollo';}
	if (estado === 2) {return 'Boceto';}
	if (estado === 3) {return 'Perfilado';}
	if (estado === 4) {return 'Terminado';}
};

// Function Rol
function get_rol(rol) {
	if (rol === 0) {return 'Administrador';}
	if (rol === 1) {return 'Miembro';}
	if (rol === 2) {return 'Colaborador';}
	if (rol === 3) {return 'Seguidor';}
};

// Function Tipo Event
function get_tipo(tipo) {
	if (tipo === 0) {return 'General';}
	if (tipo === 1) {return 'Tarea';}
	if (tipo === 2) {return 'Encuesta';}
	if (tipo === 3) {return 'Reunión';}
  if (tipo === 4) {return 'Objetivo';}
};

// Function Estado Answer
function get_answer(answer) {
	if (answer === 0) {return 'Pendiente revisión';}
	if (answer === 1) {return 'Solución';}
	if (answer === 2) {return 'Error';}
};

// Function Estado Piece
function get_problema(estado) {
	if (estado === 0) {return 'Sin solución';}
	if (estado === 1) {return 'Solucionado';}
};

// Function Expandir Textarea
function expandTextarea(id) {
  var $element = $('#Message').get(0);

  $element.addEventListener('keyup', function() {
      this.style.overflow = 'hidden';
      this.style.height = 54;
      if(this.scrollHeight > 54)  this.style.height = this.scrollHeight + 'px';
  }, false);
}

// Function Add Chat
function addChat(id, contactId, username) {
  $('.footer .row').append(
    '<div id="chatId'+id+'" class="pull-right col-xs-12 col-sm-4">'+
    '<div class="panel-group collapse in chat" id="collapseChat'+id+'">'+
        '<div class="col-xs-12">'+
          '<div class="panel panel-success">'+
            '<div class="panel-heading">'+
              'CHAT'+
              '<div class="input-group col-xs-12">'+
                '<form id="newMessage" method="post" action="/contact/message/create">'+
                '<input id="Contact" type="hidden" name="message[contact1]" value="'+id+'" />'+
                '<div class="input-group">'+
                  '<input id="Message" type="text" name="message[message]" class="form-control" placeholder="Mensaje" autocomplete="off" />'+
                  '<span class="input-group-btn">'+
                    '<button class="btn btn-success" type="submit">Send</button>'+
                  '</span>'+
                '</div>'+
                '</form>'+
              '</div>'+
            '</div>'+
            '<div id="listMessages'+id+'" class="panel-body">'+
              '</br>'+
            '</div>'+
          '</div>'+
      '</div>'+
    '</div>'+
  '</div>'
  );
  $('.footer').append(
  '<div id="chatbtnId'+id+'" class="btn-group pull-right">'+
    '<a id="chatbtn" class="btn btn-default" role="button" data-toggle="collapse" href="#collapseChat'+id+'" aria-expanded="false" aria-controls="collapseChat'+contactId+'">'+
      username+
    '</a>'+
    '<a id="closeChat" data-parent="collapseChat2" data-contact="'+id+'" class="btn btn-default" role="button" onClick="closeChat('+id+','+contactId+')" >'+
      'X'+
    '</a>'+
  '</div>'
  );
};

// Function Close Chat
function closeChat(id,contactId) {
  $("#chatId"+id).remove();
  $("#chatbtnId"+id).remove();
  var chatId = 'chatId_'+id+'_'+contactId;
  sessionStorage.setItem(chatId, '');
}
