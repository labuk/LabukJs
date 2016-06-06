// Importamos modelo DB
var models = require('../models/models.js');

// Cargamos Moments
var moment = require('moment');

// Cargamos Tools
var tools = require('./tools.js');

// POST /project/:pro_url/posts/create
exports.post_create = function(req,res){

	var pos_url = tools.getCleanedString(req.body.post.pos_titulo);

	var post = models.Post.build({
			pos_titulo: req.body.post.pos_titulo,
      pos_resumen: req.body.post.pos_resumen,
      pos_contenido: req.body.post.pos_contenido,
			pos_publica: req.body.post.pos_publica,
			pos_url: pos_url,
			ProjectId: req.project.id,
			UserId: req.session.user.id
	});

	post.validate().then(function(err){
		if (err) {
			res.render('project/log_index', {piece: piece, errors: err.errors});
		} else {
			if (req.body.post.pos_publica == 1) {
				tools.autoLog(10, req.project.id, req.project.pro_url, req.session.user.id, pos_url);
			} else {
				tools.autoLog(11, req.project.id, req.project.pro_url, req.session.user.id, pos_url);
			}
			// guarda en DB los campos pregunta y respuesta
			post.save().then(function(){
			res.redirect('/project/'+req.params.pro_url+'/board');})
		}
	});
};

// GET /project/:pro_url/posts/:pos_url
exports.show_post = function(req, res){
	models.Post.find({
		  where: { pos_url: req.params.pos_url },
			include: [{model: models.Project, attributes: ['pro_nombre','pro_url','pro_logo']},{model: models.User, attributes: ['nombre']}]
		}).then(function(post){
			if(post) {
				models.Comment.findAll({
					  where: { PostId: post.id },
					}).then(function(comments){
						var project = post.Project;
						res.render('post/post_main',{ post: post, project: project, comments: comments, moment: moment, errors: []});
  })} else { next(new Error('No existe post')); }
	}).catch(function(error){ next(error);} );
};

// GET /project/:pro_url/front/posts/:pos_url
exports.show_post_publica = function(req, res){
	models.Post.find({
		  where: {
				pos_url: req.params.pos_url,
			},
			include: [{model: models.Project, attributes: ['pro_nombre','pro_url','pro_eslogan','pro_logo']},{model: models.User, attributes: ['nombre']}]
		}).then(function(post){
			console.log(post);
			if(post.pos_publica) {
				models.Comment.findAll({
					  where: { PostId: post.id },
					}).then(function(comments){
						var project = post.Project;
						res.render('post/post_main_front',{ post: post, project: project, comments: comments, moment: moment, errors: []});
  		})} else {
				req.session.errors = [{"message": "El post ha pasado a ser privado. Tienes que ser miembro del proyecto para verlo."}];
				res.redirect("/project/"+req.params.pro_url+"/front");
			}
	}).catch(function(error){ next(error);} );
};

// PUT /project/:pro_url/posts/:pos_url
exports.post_update = function(req,res){

	models.Post.find({
		  where: { pos_url: req.params.pos_url },
			include: [{model: models.Project, attributes: ['pro_nombre','pro_url']},{model: models.User, attributes: ['nombre']}]
		}).then(function(post){

			console.log(req.body.post.pos_publica);

			post.pos_titulo = req.body.post.pos_titulo,
      post.pos_resumen = req.body.post.pos_resumen,
      post.pos_contenido = req.body.post.pos_contenido,
			post.pos_publica = req.body.post.pos_publica || 'false',
			post.pos_url = req.body.post.pos_titulo.replace(/\s+/g, '-').toLowerCase(),

	console.log('1');

			post.validate().then(function(err){
				if (err) {
					res.render('error', { errors: err.errors});
				} else {
					// cambia en DB los campos pregunta y respuesta
					post.save({fields: ["pos_titulo","pos_resumen","pos_contenido","pos_publica","pos_url"]}).then(function(){
						res.redirect('/project/'+req.params.pro_url+'/posts/'+post.pos_url);
				})}
		})});
};

// DELETE /project/:pro_url/posts/:postId
exports.post_destroy = function(req,res){
	models.Post.find({
		where:{ id: req.params.postId }
	}).then(function(post){
	 	post.destroy().then(function() {
			res.redirect('/project/'+req.params.pro_url+'/board');
		}).catch(function(error){next(error)});
})};

// POST /project/:pro_url/comments/create
exports.comment_create = function(req,res){
	var comment = models.Comment.build({
			com_texto: req.body.comment.com_texto,
			PostId: req.body.comment.PostId,
	});

	comment.validate().then(function(err){
		if (err) {
			res.render('project/log_index', {piece: piece, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			comment.save().then(function(){
			res.redirect('/project/'+req.params.pro_url+'/posts/'+req.params.pos_url);})
		}
	});
};
