// tools.js
// ========

// Importamos modelo DB
var models = require('../models/models.js');

// Function getCleanedString - Limpiar la cadena de acentos, espacios y carácteres raros.
exports.getCleanedString = function (cadena){
   // Definimos los caracteres que queremos eliminar
   var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

   // Los eliminamos todos
   for (var i = 0; i < specialChars.length; i++) {
       cadena= cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
   }

   // Lo queremos devolver limpio en minusculas
   cadena = cadena.toLowerCase();

   // Quitamos espacios y los sustituimos por _ porque nos gusta mas asi
   cadena = cadena.replace(/ /g,"-");

   // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
   cadena = cadena.replace(/á|à|ä|â/gi,"a");
   cadena = cadena.replace(/é|è|ë|ê/gi,"e");
   cadena = cadena.replace(/í|ì|ë|ê/gi,"i");
   cadena = cadena.replace(/ó|ò|ö|ô/gi,"o");
   cadena = cadena.replace(/ú|ù|ü|û/gi,"u");
   cadena = cadena.replace(/ñ/gi,"n");
   return cadena;
}

// Function autoLog - Guardamos logs automáticos
exports.autoLog = function (tipo, project, entrada_aux, id, url) {

	console.log('AutoLog');

	if (tipo == 10){
		var entrada = "Se ha creado una nueva noticia";
		var log_url = "/posts/"+url;
	}

	if (tipo == 11){
		var entrada = "Se ha creado una nueva noticia privada";
		var log_url = "/posts/"+url;
	}

  if (tipo == 12){
    var entrada = "Se ha creado un nuevo problema.";
    var log_url = "/problems/"+url;
  }

  if (tipo == 13){
    var entrada = "Se ha creado una nueva nota.";
    var log_url = "/pieces/"+url;
  }

	var log = models.Log.build({
			log_entrada: entrada,
			log_tipo: tipo,
			log_url: log_url,
			ProjectId: project,
			UserId: id
	});

	log.validate().then(function(err){
			// guarda en DB los campos pregunta y respuesta
			log.save().then(function(){
			return 'Ok';
		})
	});
}
