// Importamos modelo DB
var models = require('../models/models.js');

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
