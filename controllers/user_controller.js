// Importamos modelo DB
var models = require('../models/models.js');

var users = {	admin: {id:1, username:"admin", password:"1234"},
		pepe:  {id:2, username:"pepe", password:"5678"}
	    };

// GET /user
exports.index = function(req, res){
	models.User.findAll().then(function(users){
		res.render('user/index',{users: users, errors: []});
	}).catch(function(error){next(error);})
};

// GET /user/new
exports.new = function(req,res){
	res.render('user/new', {errors: []});
};

// POST /user/create
exports.create = function(req,res){
 	var user = models.User.build( 
		{ nombre: req.body.nombre,
		  pass: req.params.password
		});

	user.validate().then(function(err){
		if (err) {
			res.render('user/new', {errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			user.save().then(function(){
			res.redirect('/quizes');})
		}
	}).catch(function(error){next(error)});
};




// Comprueba si el usuario esta registrado en users
// Si autenticación falla o hay errores se ejecuta callback(error)
exports.autenticar = function(login, password, callback){
	models.User.findAll({where: ["nombre like ?", login]})
	.then(function(user){
console.log("Usuario: "+user);
	   if (user.length !== 0){
console.log("Usuario: "+user[0].pass);
		if (user[0].pass === password) {
		   callback(null, login);
	  	} else {callback(new Error('Password erróneo.'));}
	   } else {callback(new Error('No existe el usuario.'));}
	})
/*
	if(users[login]){
	  if (password === users[login].password) {
		callback(null, users[login]);
	  } else {callback(new Error('Password erróneo.'));}
	} else {callback(new Error('No existe el usuario.'));}
*/
};
