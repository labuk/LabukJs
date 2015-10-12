// Importamos modelo DB
var models = require('../models/models.js');

// Cargamos Sequelize
var sequelize = require('sequelize');

// Autoload - Factoriza el código si la ruta incluye :pro_url
exports.load = function(req, res, next, pro_url){
	models.Project.find({
		  where: { pro_url: pro_url }
		}).then(function(project){
		if (project){
		req.project = project;
		next();
  } else { next(new Error('No existe project =' + projectId)); }
	}).catch(function(error){ next(error);} );
};

// GET /project
exports.index = function(req, res){
    models.Project.findAll().then(function(projects){
      res.render('project/index',{ projects: projects, errors: []});
    }).catch(function(error){next(error);})
};

// GET /project/new
exports.new = function(req,res){
 	var project = models.Project.build(
		{pro_nombre: "Nombre", pro_url: "Url"}
	);

	res.render('project/new', {project: project, errors: []});
};

// GET /project/create
exports.create = function(req,res){

	// Sustituimos espacios por '-' y todo en minúscula.
	req.body.project.pro_url = req.body.project.pro_nombre.replace(/\s+/g, '-').toLowerCase();

	var project = models.Project.build(req.body.project);

	project.validate().then(function(err){
		if (err) {
			res.render('project/new', {project: project, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			project.save({fields: ["pro_nombre", "pro_url"]}).then(function(){
			res.redirect('/project');})
		}
	});
};

// GET /project/:pro_url
exports.show_pro = function(req, res){
	res.render('project/project_main',{ project: req.project, errors: []});
};

// GET /project/:pro_url/pieces
exports.pieces = function(req, res){
	// Muestra piezas
	models.Piece.findAll({
		where:{ ProjectId: req.project.id }
	}).then(function(pieces){
		// Crea los datos del form
		var piece = models.Piece.build(
			{pie_nombre: "Nombre", pie_url: "Url"}
		);
		res.render('project/pieces_index', {pieces: pieces, piece: piece, project: req.project, errors: []});
	}).catch(function(error){next(error);})
};


// POST /project/:pro_url/pieces/create
exports.piece_create = function(req,res){

	// Sustituimos espacios por '-' y todo en minúscula.
	req.body.piece.pie_url = req.body.piece.pie_nombre.replace(/\s+/g, '-').toLowerCase();

	var piece = models.Piece.build({
				pie_nombre: req.body.piece.pie_nombre,
				pie_url: req.body.piece.pie_url,
				ProjectId: req.project.id,
				UserId: req.session.user.id
		});

	piece.validate().then(function(err){
		if (err) {
			res.render('project/pieces_index', {piece: piece, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			piece.save().then(function(){
			res.redirect('/project/'+req.params.pro_url+'/pieces');})
		}
	});
};

// PUT /project/:pro_url/pieces/:pieceId
exports.piece_update = function(req,res){
	models.Piece.find({
		where:{ id: req.params.pieceId }
	}).then(function(piece){
		piece.pie_nombre = req.body.piece.pie_nombre;
		piece.validate().then(function(err){
			if (err) {
				res.render('project/pieces_index', {quiz: quiz, errors: err.errors});
			} else {
				// cambia en DB los campos pregunta y respuesta
				piece.save({fields: ["pie_nombre"]}).then(function(){
				//models.Piece.update(piece).then(function(){
				res.redirect('/project/'+req.params.pro_url+'/pieces');
			})}
	})});
};

// DELETE /project/:pro_url/pieces/:pieceId
exports.piece_destroy = function(req,res){
	console.log('Busqueda');
	models.Piece.find({
		where:{ id: req.params.pieceId }
	}).then(function(piece){
		console.log('Borrar');
	 	piece.destroy().then(function() {
			res.redirect('/project/'+req.params.pro_url+'/pieces');
		}).catch(function(error){next(error)});
})};

// GET /project/:pro_url/pieces/:pie_url
exports.show_pie = function(req, res){
	models.Piece.find({
			where: { pie_url: req.params.pie_url },
			include: [{model: models.User, attributes: ['nombre']}]
		}).then(function(piece){
		if (piece){
			models.Task.findAll({
					where: { PieceId: piece.id },
				}).then(function(tasks){
					//console.log(tasks);
					var task = models.Task.build( {tas_tarea: "Tarea", PieceId: "PieceId"} );
					res.render('project/piece_main',{ piece: piece, project: req.project, task: task, tasks: tasks, errors: []});
		})} else { next(new Error('No existe piece ')); }
		}).catch(function(error){ next(error);} );
};

// POST /project/:pro_url/task/create
exports.task_create = function(req,res){

	console.log(req.body.task);

	var task = models.Task.build(req.body.task);

	task.validate().then(function(err){
		if (err) {
			res.render('project/pieces_index', {piece: piece, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			task.save().then(function(){
			res.redirect('/project/'+req.params.pro_url+'/pieces/'+req.params.pie_url);})
		}
	});
};
