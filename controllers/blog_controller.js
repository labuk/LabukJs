// Importamos modelo DB
var models = require('../models/models.js');

// Cargamos Moments
var moment = require('moment');

// POST /project/:pro_url/posts/create
exports.post_create = function(req,res){
	var post = models.Post.build({
			pos_titulo: req.body.post.pos_titulo,
      pos_resumen: req.body.post.pos_resumen,
      pos_contenido: req.body.post.pos_contenido,
			pos_url: req.body.post.pos_titulo.replace(/\s+/g, '-').toLowerCase(),
			ProjectId: req.project.id,
			UserId: req.session.user.id
	});

	post.validate().then(function(err){
		if (err) {
			res.render('project/log_index', {piece: piece, errors: err.errors});
		} else {
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
			include: [{model: models.Project, attributes: ['pro_nombre','pro_url']},{model: models.User, attributes: ['nombre']}]
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
