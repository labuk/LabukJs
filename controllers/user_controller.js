// Importamos modelo DB
var models = require('../models/models.js');

// Cargamos Moments
var moment = require('moment');

// Cargamos Jimp
var jimp = require("jimp");

// GET /user
exports.index = function(req, res){
	models.User.findAll({
		where:{
			id: {gt: 1}
		}
	}).then(function(users){
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
		  pass: req.body.password
		});

	user.validate().then(function(err){
		if (err) {
			res.render('user/new', {errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			user.save().then(function(){
			res.redirect('/project');})
		}
	}).catch(function(error){next(error)});
};

// POST /user/avatar
exports.upload_avatar = function(req,res){
	models.User.find({
		where:{ id: req.session.user.id }
	}).then(function(user){
		user.avatar = req.file.filename;
		jimp.read("./public/images/avatar/user-"+req.session.user.id+".bmp").then(function (avatar) {
		avatar.resize(parseInt(req.body.t), jimp.AUTO)
					.crop(parseInt(req.body.x), parseInt(req.body.y), parseInt(req.body.w), parseInt(req.body.h))				// crop
					.resize(400, 400)            // resize
					.write("./public/images/avatar/user-"+req.session.user.id+".bmp"); // save
		}).then(function(){
			user.save({fields: ["avatar"] }).then(function(){
				res.redirect('/user/myprofile');
	})})}).catch(function(error){next(error);});
};

// GET /user/myprofile
exports.myprofile = function(req,res){
	models.User.find({
		where:{ id: req.session.user.id }
	}).then(function(user){
		res.render('user/myprofile', {user: user, moment: moment, errors: []});
	}).catch(function(error){next(error);});
};

// GET /user/profile/:UserId
exports.show_profile = function(req,res){
	if (req.params.userId == req.session.user.id) {
		res.redirect('/user/myprofile');
	}

	models.User.find({
		where:{ id: req.params.userId }
	}).then(function(user){
		models.Contact.find({
			where:{ con_contact: req.session.user.id,
							UserId: req.params.userId }
		}).then(function(contact){
			res.render('user/profile', {user: user, contact: contact, moment: moment, errors: []});
	})}).catch(function(error){next(error);});
};

// Comprueba si el usuario esta registrado en users
// Si autenticación falla o hay errores se ejecuta callback(error)
exports.autenticar = function(login, password, callback){
	models.User.findAll({where: ["nombre like ?", login]})
	.then(function(user){
		if (user.length !== 0){
			if (user[0].pass === password) {
			 var user_login = {id: user[0].id, nombre: login}
		   callback(null, user_login);
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
