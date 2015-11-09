// Importamos modelo DB
var models = require('../models/models.js');

// Cargamos Sequelize
var sequelize = require('sequelize');

// Cargamos Moments
var moment = require('moment');

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

// POST /project/create
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

// GET /project/:pro_url
exports.show_front = function(req, res){
	res.render('project/project_front',{ project: req.project, errors: []});
};

// PUT /project/:pro_url/update
exports.project_update = function(req,res){

		req.project.pro_portada = req.body.project.pro_portada || req.project.pro_portada;
		req.project.pro_nombre = req.body.project.pro_nombre || req.project.pro_nombre;
		if (req.body.project.pro_nombre) {
			req.project.pro_url = req.body.project.pro_nombre.replace(/\s+/g, '-').toLowerCase();
		}

		req.project.validate().then(function(err){
			if (err) {
				res.render('project/pieces_index', {piece: piece, project: req.project, errors: err.errors});
			} else {
				// cambia en DB los campos pregunta y respuesta
				req.project.save({fields: ["pro_nombre","pro_url","pro_portada"]}).then(function(){
					res.redirect('/project/'+req.params.pro_url+'/manage');
			})}
		});
};

// GET /project/:pro_url/manage
exports.manage = function(req, res){
	res.render('project/manage_project',{ project: req.project, errors: []});
};

// GET /project/:pro_url/members
exports.members = function(req, res){
	// Muestra piezas
	models.Member.findAll({
		where:{ ProjectId: req.project.id },
		include: [{model: models.User, attributes: ['nombre']}]
	}).then(function(members){
		// Crea los datos del form
		var member = models.Member.build(
			{mem_rol: "Rol", UserId: "UserId"}
		);
		// Lista posibles nuevos miembros
		models.User.findAll().then(function(users){
			res.render('project/members_index', {members: members, member: member, users: users, project: req.project, errors: []});
	})}).catch(function(error){next(error);})
};

// POST /project/:pro_url/members/create
exports.members_create = function(req,res){

	var member = models.Member.build({
			mem_rol: req.body.member.mem_rol,
			ProjectId: req.project.id,
			UserId: req.body.member.UserId
		});

	member.validate().then(function(err){
		if (err) {
			res.render('project/members_index', {piece: piece, errors: err.errors});
		} else {
			// guarda en DB los campos
			member.save().then(function(){
			res.redirect('/project/'+req.params.pro_url+'/members');})
		}
	});
};

// GET /project/:pro_url/pieces
exports.pieces = function(req, res){
	// Muestra piezas
	models.Piece.findAll({
		where:{ ProjectId: req.project.id },
		include: [{model: models.User, attributes: ['nombre']}]
	}).then(function(pieces){
		// Crea los datos del form
		var piece = models.Piece.build(
			{pie_nombre: "Nombre", pie_url: "Url", pie_prioridad: "Prioridad"}
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
				pie_prioridad: req.body.piece.pie_prioridad,
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
		console.log (req.body.piece);
		piece.pie_nombre = req.body.piece.pie_nombre;
		piece.pie_prioridad = req.body.piece.pie_prioridad
		piece.pie_url = req.body.piece.pie_nombre.replace(/\s+/g, '-').toLowerCase();
		piece.validate().then(function(err){
			if (err) {
				res.render('project/pieces_index', {piece: piece, project: req.project, errors: err.errors});
			} else {
				// cambia en DB los campos pregunta y respuesta
				piece.save({fields: ["pie_nombre","pie_prioridad","pie_url"] }).then(function(){
				//models.Piece.update(piece).then(function(){
				res.redirect('/project/'+req.params.pro_url+'/pieces/'+piece.pie_url);
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


// GET /project/:pro_url/tasks
exports.tasks = function(req, res){
	// Muestra tareas
	models.Task.findAll({
		include: [{	model: models.Piece, attributes: ['ProjectId'],
								where:{ ProjectId: req.project.id }}]
	}).then(function(tasks){
		res.render('project/task_tab', {tasks: tasks, project: req.project, errors: []});
	}).catch(function(error){next(error);})
};

// PUT /project/:pro_url/tasks/:taskId
exports.task_update = function(req,res){
	models.Task.find({
		where:{ id: req.params.taskId }
	}).then(function(task){
		task.tas_tarea = req.body.task.tas_tarea;
		task.tas_estado = req.body.task.tas_estado;
		task.validate().then(function(err){
			if (err) {
				res.render('project/pieces_index', {quiz: quiz, errors: err.errors});
			} else {
				// cambia en DB los campos pregunta y respuesta
				task.save({fields: ["tas_tarea","tas_estado"] }).then(function(){
					if (req.body.task.flag_tab){
						res.redirect('/project/'+req.params.pro_url+'/tasks');
					} else {
						res.redirect('/project/'+req.params.pro_url+'/pieces/'+req.body.piece.pie_url);
					}
			})}
	})});
};

// DELETE /project/:pro_url/tasks/:taskId
exports.task_destroy = function(req,res){
	models.Task.find({
		where:{ id: req.params.taskId }
	}).then(function(task){
	 	task.destroy().then(function() {
			res.redirect('/project/'+req.params.pro_url+'/pieces/'+req.body.piece.pie_url);
		}).catch(function(error){next(error)});
})};

// GET /project/:pro_url/logs
exports.logs = function(req, res){
	// Muestra logs
	models.Log.findAll({
		where:{ ProjectId: req.project.id },
		include: [{model: models.User, attributes: ['nombre']}]
	}).then(function(logs){
		res.render('project/logs_index', {logs: logs, project: req.project, moment: moment, errors: []});
	}).catch(function(error){next(error);})
};

// POST /project/:pro_url/log/create
exports.log_create = function(req,res){
	var log = models.Log.build({
			log_entrada: req.body.log.log_entrada,
			ProjectId: req.project.id,
			UserId: req.session.user.id
	});

	log.validate().then(function(err){
		if (err) {
			res.render('project/log_index', {piece: piece, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			log.save().then(function(){
			res.redirect('/project/'+req.params.pro_url+'/logs');})
		}
	});
};

// GET /project/:pro_url/ideas
exports.ideas = function(req, res){
	var limit = req.limit | 3;
	var pag = {current: req.query.pag | 0, total: 0 };
	var offset = pag.current*limit | 0;

	//models.Idea.findAll({
	models.Idea.findAndCountAll({
		where:{ ProjectId: req.project.id },
		offset: offset,
		limit: limit
	}).then(function(ideas){
		pag.total = ideas.count/limit;
		console.log (pag);
		res.render('project/ideas_index', {ideas: ideas.rows, pag: pag, project: req.project, errors: []});
	}).catch(function(error){next(error);})
};

// POST /project/:pro_url/idea/create
exports.idea_create = function(req,res){
	var idea = models.Idea.build({
			ide_idea: req.body.idea.ide_idea,
			ProjectId: req.project.id
	});
	idea.validate().then(function(err){
		if (err) {
			res.render('project/log_index', {piece: piece, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			idea.save().then(function(){
			res.redirect('/project/'+req.params.pro_url+'/ideas');})
		}
	});
};

// GET /project/:pro_url/board
exports.board = function(req, res){
	models.Post.findAll({
		where:{ ProjectId: req.project.id },
		include: [{model: models.User, attributes: ['nombre']}]
	}).then(function(posts){
		res.render('project/board_index', {posts: posts, project: req.project, moment: moment, errors: []});
	}).catch(function(error){next(error);})
};
