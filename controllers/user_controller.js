// Importamos modelo DB
var models = require('../models/models.js');

// Cargamos Moments
var moment = require('moment');

// Cargamos Jimp
var jimp = require("jimp");

// Config path - localhost / azure
if (process.env.DATABASE_URL == "sqlite://:@:/") {
	var file_avatar = './public/images/avatar/';
} else {
  var file_avatar = '../public/images/avatar/';
}

// GET main
exports.main = function(req,res){
	models.User.find({
		where:{ id: req.session.user.id }
	}).then(function(user){
		models.Log.findAll({
			where: {log_tipo: {gte: 10}},
			order: [
				['createdAt', 'DESC']
			],
			include: [{
				model: models.Project, attributes: ['pro_nombre','pro_url','pro_logo'],
				include: [{
					model: models.Member,
					attributes: ['mem_rol'],
					where:{UserId: req.session.user.id}
				}]
			}]
		}).then(function(logs){
			models.Task.findAll({
				where: { UserId: req.session.user.id, tas_todos: 0},
				include: [{
					model: models.Piece,
					attributes: ['pie_url'],
					include: [{
						model: models.Project,
						attributes: ['pro_nombre','pro_url','pro_logo']
					}]
				}]
			}).then(function(tasks){
				models.Member.findAll({
					where:{ UserId: req.session.user.id },
					include: [{model: models.Project, attributes: ['pro_nombre','pro_url','pro_logo','pro_eslogan']}]
				}).then(function(projects_member){
					res.render('main', {user: user, logs: logs, tasks: tasks, moment: moment, projects_member: projects_member, errors: []} );
	})})})});
}

// GET /user
exports.index = function(req, res){
	models.User.findAll({
		where:{
			id: {gt: 1}
		}
	}).then(function(users){
		console.log(users);
		res.render('user/index',{users: users, errors: []});
	}).catch(function(error){next(error);})
};

// GET /user/new
exports.new = function(req,res){
  var errors = req.session.errors || {};
  req.session.errors = {};

	res.render('user/new', {errors: errors});
};

// POST /user/create
exports.create = function(req,res){
 	var user = models.User.build(
		{ nombre: req.body.nombre,
		  pass: req.body.password
		});

	user.validate().then(function(msg, err){
		if (err) {
			res.render('user/new', {errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			user.save().then(function(err){
			res.redirect('/project');}
    ).catch(function(error){
      console.log("Catch");
      req.session.errors = [{"message": "El nombre de usuario no está disponible"}];
      res.redirect('/user/new');
    });}
	}).catch(function(error){next(error);});
};

// POST /user/avatar
exports.upload_avatar = function(req,res){
	models.User.find({
		where:{ id: req.session.user.id }
	}).then(function(user){
		user.avatar = req.file.filename;
		jimp.read(file_avatar+"user-"+req.session.user.id+".png").then(function (avatar) {
		avatar.resize(parseInt(req.body.t), jimp.AUTO)
					.crop(parseInt(req.body.x), parseInt(req.body.y), parseInt(req.body.w), parseInt(req.body.h))				// crop
					.resize(400, 400)            // resize
					.write(file_avatar+"user-"+req.session.user.id+".png"); // save
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
	models.User.find({where: ["nombre like ?", login]})
	.then(function(user){
		if (user){
			if (user.pass === password) {
		   callback(null, user);
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
