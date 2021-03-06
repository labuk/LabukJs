// Importamos modelo DB
var models = require('../models/models.js');

// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function (req, res, next){
	if (req.session.user.id > 1) {
	  next();
	} else {
	  res.redirect('/login');
	}
};

// MW de autorización de acceso restringido a proyecto
exports.memberRequired = function (req, res, next){
	models.Member.findOne({
		where:{
			ProjectId: req.project.id,
			UserId: req.session.user.id,
		}
	}).then(function(member){
		if (member) {
			if (member.mem_rol == 3){
				res.redirect('/project/'+req.params.pro_url+'/front');
			} else {
				next();
			}
		} else {
		  res.redirect('/project/'+req.params.pro_url+'/front');
		}
	});
};

// GET /login
exports.new = function(req,res){
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});
};

// POST /login
exports.create = function(req,res){

	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user) {

	  // Si hay un error retornamos mensajes de error de sesion
	  if (error) {
		req.session.errors = [{"message": ""+error}];
		res.redirect("/login");
		return;
	  }

		console.log('Session creada');

	  // Crear req.session.user y guardar campos id y username
	  // La sesion se define por la existencia de: req.session.user
		delete req.session.user; // Destruimos session por si había alguna activa.
	  req.session.user = { id:user.id, username:user.nombre, online:true};
		user.save({fields: ["online"]});
	  //res.redirect(req.session.redir.toString()); // redireccionamos a path anterior a login
		res.redirect('/main'); // redireccionamos a la principal de usuario
	});
};

// GET /logout
exports.destroy = function(req,res){
	var userId = req.session.user.id;
	delete req.session.user;
	delete req.session.project;
	models.User.find({
		where:{ id: userId }
	}).then(function(user){
		user.online = false;
		user.save({fields: ["online"]}).then(function(){
			//res.redirect(req.session.redir.toString()); // redirect a path anterior a logout
			res.redirect("/");
	})});
};
