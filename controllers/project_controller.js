// Importamos modelo DB
var models = require('../models/models.js');

// Cargamos Sequelize
var sequelize = require('sequelize');

// Cargamos Moments
var moment = require('moment');

// Cargamos Jimp
var jimp = require("jimp");

// Cargamos Tools
var tools = require('./tools.js');

// Config path - localhost / azure
if (process.env.DATABASE_URL == "sqlite://:@:/") {
	var file_logo = './public/images/logo/';
} else {
	var file_logo = '../public/images/logo/';
}

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
    models.Project.findAll({
			where:{ pro_portada: 1 }
		}).then(function(projects){
			models.Member.findAll({
				where:{ UserId: req.session.user.id },
				include: [{model: models.Project, attributes: ['pro_nombre','pro_url','pro_logo','pro_eslogan']}]
			}).then(function(projects_member){
      	res.render('project/index',{ projects: projects, projects_member: projects_member, errors: []});
    })}).catch(function(error){next(error);})
};

// GET /project/new
exports.new = function(req,res){
 	var project = models.Project.build(
		{
			pro_nombre: "Nombre",
			pro_url: "Url",
			pro_eslogan: "Eslogan",
			pro_descripcion: "Descripción",
			pro_tipo: "Tipo"
		}
	);

	res.render('project/new', {project: project, errors: []});
};

// POST /project/create
exports.create = function(req,res){

	// Sustituimos espacios por '-' y todo en minúscula.
	req.body.project.pro_url = tools.getCleanedString(req.body.project.pro_nombre);

	var project = models.Project.build(req.body.project);

	project.validate().then(function(err){
		if (err) {
			res.render('project/new', {project: project, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			project.save().then(function(projectId){
				var member = models.Member.build({mem_rol: 0, ProjectId: projectId.id, UserId: req.session.user.id});
				member.save().then(function(memberId){
					console.log(memberId);
					models.Piece.create({
						pie_nombre: 'Definición de proyecto',
						pie_url: 'definición-de-proyecto',
						pie_descripcion: 'Punto de partida donde se definen los objetivos y planifican las piezas del proyecto.',
						pie_prioridad: '0',
						UserId: req.session.user.id,
						ProjectId: projectId.id
					});
					models.Piece.create({
						pie_nombre: 'Foro general',
						pie_url: 'foro-general',
						pie_descripcion: 'Foro de discusión general del proyecto, para hablar de todos los temas relacionados con el mismo y establecer tareas compartidas o genéricas del proyecto.',
						pie_prioridad: '0',
						UserId: req.session.user.id,
						ProjectId: projectId.id
					});
					models.Piece.create({
						pie_nombre: 'Taller de creatividad',
						pie_url: 'taller-de-creatividad',
						pie_descripcion: 'Pieza donde se gestiona la creatividad del proyecto, creando tareas que posibiliten el surgimiento de nuevas ideas.',
						pie_prioridad: '0',
						UserId: req.session.user.id,
						ProjectId: projectId.id
					});
					res.redirect('/project/'+req.body.project.pro_url);
		})})}
	});
};

// GET /project/:pro_url
exports.show_pro = function(req, res){
	models.Task.findAll({
		where: { UserId: req.session.user.id, tas_todos: 0},
		include: [{model: models.Piece, where: {ProjectId: req.project.id}}]
	}).then(function(tasks){
		models.Task.findAll({
			where: { tas_todos: 1},
			include: [{
				model: models.Piece,
				attributes: ['pie_nombre','pie_url'],
				where: {ProjectId: req.project.id}
			}]
		}).then(function(tasks_all){
			models.Log.findAll({
				where:{ ProjectId: req.project.id },
				order: [
					['createdAt', 'DESC']
				],
				include: [{model: models.User, attributes: ['nombre']}]
			}).then(function(logs){
			res.render('project/project_main',{ project: req.project, logs: logs, tasks: tasks, tasks_all: tasks_all, moment: moment, errors: []});
	})})}).catch(function(error){next(error);})
};

// GET /project/:pro_url/front
exports.show_front = function(req, res){

	var errors = req.session.errors || {};
  req.session.errors = {};

	models.Post.findAll({
		where:{
			ProjectId: req.project.id,
			pos_publica: true
		},
		include: [{model: models.User, attributes: ['nombre']}]
	}).then(function(posts){
		if (req.session.user.id != 1) {
			models.Member.findOne({
				where:{
					ProjectId: req.project.id,
					UserId: req.session.user.id,
				}
			}).then(function(member){
				if (member) {
					req.session.project = member.mem_rol;
					res.render('project/project_front',{ project: req.project, posts: posts, moment: moment, errors: errors});
				} else {
					delete req.session.project;
					res.render('project/project_front',{ project: req.project, posts: posts, moment: moment, errors: errors});
				}
			})
		} else {
			delete req.session.project;
			res.render('project/project_front',{ project: req.project, posts: posts, moment: moment, errors: errors});
		}
	});
};

// PUT /project/:pro_url/update
exports.project_update = function(req,res){

		req.project.pro_portada = req.body.project.pro_portada || req.project.pro_portada;
		req.project.pro_nombre = req.body.project.pro_nombre || req.project.pro_nombre;
		req.project.pro_eslogan = req.body.project.pro_eslogan || req.project.pro_eslogan;
		req.project.pro_descripcion = req.body.project.pro_descripcion || req.project.pro_descripcion;
		req.project.pro_tipo = req.body.project.pro_tipo || req.project.pro_tipo;

		if (req.body.project.pro_nombre) {
			req.project.pro_url = tools.getCleanedString(req.body.project.pro_nombre);
		}

		req.project.validate().then(function(err){
			if (err) {
				res.render('project/pieces_index', {piece: piece, project: req.project, errors: err.errors});
			} else {
				// cambia en DB los campos pregunta y respuesta
				req.project.save({fields: ["pro_nombre","pro_url","pro_portada","pro_eslogan","pro_descripcion","pro_tipo"]}).then(function(){
					if (req.body.project.pro_nombre) {
						res.redirect('/project/'+req.project.pro_url+'/manage');
					} else {
						res.redirect('/project/'+req.params.pro_url+'/manage');
					}
			})}
		});
};

// POST /project/:pro_url/logo
exports.upload_logo = function(req,res){
	models.Project.find({
		where:{ id: req.project.id }
	}).then(function(project){
		project.pro_logo = req.file.filename;
		jimp.read(file_logo+'project-'+req.project.id+'.png').then(function (logo) {
		logo.resize(parseInt(req.body.t), jimp.AUTO)
					.crop(parseInt(req.body.x), parseInt(req.body.y), parseInt(req.body.w), parseInt(req.body.h))				// crop
					.resize(400, 400)            // resize
					.write(file_logo+"project-"+req.project.id+".png"); // save
		}).then(function(){
			project.save({fields: ["pro_logo"] }).then(function(){
				res.redirect('/project/'+req.params.pro_url+'/manage');
	})})}).catch(function(error){next(error);});
};

// DELETE /project/:pro_url/:projectId
exports.project_destroy = function(req,res){
	models.Project.find({
		where:{ id: req.params.projectId }
	}).then(function(project){
	 	project.destroy().then(function() {
			res.redirect('/project');
		}).catch(function(error){next(error)});
})};

// GET /project/:pro_url/manage
exports.manage = function(req, res){
	// Buscar Sugerencias
	models.Suggestion.findAll({
		where:{ ProjectId: req.project.id },
		include: [{model: models.User, attributes: ['nombre']}]
	}).then(function(suggestions){
		res.render('project/manage_project',{ project: req.project, suggestions: suggestions, errors: []});
	});
};

// GET /project/:pro_url/members
exports.members = function(req, res){

	var errors = req.session.errors || {};
  req.session.errors = {};

	// Buscar Miembros
	models.Member.findAll({
		where:{
			ProjectId: req.project.id,
			mem_rol: {$lt: 3}
		},
		include: [{model: models.User, attributes: ['nombre']}]
	}).then(function(members){
		// Crea los datos del form
		var member = models.Member.build(
			{mem_rol: "Rol", UserId: "UserId"}
		);
		// Lista posibles nuevos miembros
		models.User.findAll({
			where:{
				id: {gt: 1}
			}
		}).then(function(users){
			res.render('project/members_index', {members: members, member: member, users: users, project: req.project, errors: errors});
	})}).catch(function(error){next(error);})
};

// POST /project/:pro_url/members/create
exports.members_create = function(req,res){

	models.Member.find({
		where:{
			ProjectId: req.project.id,
			UserId: req.body.member.UserId
		}
	}).then(function(members){
		if (members) {
			if (members.mem_rol == 3) {
				members.mem_rol = req.body.member.mem_rol;
				members.save({fields: ["mem_rol"] }).then(function(){
					res.redirect('/project/'+req.params.pro_url+'/members');
				});
			} else {
				if (req.body.member.editar) {
					members.mem_rol = req.body.member.mem_rol;
					members.save({fields: ["mem_rol"] }).then(function(){
						res.redirect('/project/'+req.params.pro_url+'/members');
					});
				} else {
					req.session.errors = [{"message": "Ya existe ese usuario."}];
					res.redirect('/project/'+req.params.pro_url+'/members');
				}
			}
		} else {
			var member = models.Member.build({
					mem_rol: req.body.member.mem_rol,
					ProjectId: req.project.id,
					UserId: req.body.member.UserId,
				});

			member.validate().then(function(err){
				if (err) {
					res.render('project/members_index', {piece: piece, errors: err.errors});
				} else {
					// guarda en DB los campos
					member.save().then(function(){
					res.redirect('/project/'+req.params.pro_url+'/members');
					})
				}
			});
		}
	});
};

// POST /project/:pro_url/follower/create
exports.follower_create = function(req,res){

	var member = models.Member.build({
			mem_rol: 3,
			ProjectId: req.project.id,
			UserId: req.session.user.id
		});

	member.validate().then(function(err){
		if (err) {
			res.render('project/members_index', {piece: piece, errors: err.errors});
		} else {
			// guarda en DB los campos
			member.save().then(function(){
				res.send('Ok');
			})
		}
	});
};

// DELETE /project/:pro_url/follower/create
exports.follower_delete = function(req,res){
	models.Member.find({
		where:{
			ProjectId: req.project.id,
			UserId: req.session.user.id
		}
	}).then(function(member){
	 	member.destroy().then(function() {
			res.send('Ok');
		}).catch(function(error){next(error)});
})};

// GET /project/:pro_url/pieces
exports.pieces = function(req, res){
	// Muestra piezas
	models.Piece.findAll({
		where:{ ProjectId: req.project.id },
		include: [{model: models.User, attributes: ['nombre']}]
	}).then(function(pieces){
		models.Member.findAll({
			where:{
				ProjectId: req.project.id,
				mem_rol: {$lt: 3}
			},
			include: [{model: models.User, attributes: ['nombre']}]
		}).then(function(members){
			// Crea los datos del form
			var piece = models.Piece.build(
				{pie_nombre: "Nombre", pie_descripcion: "Descripcion", pie_url: "Url", pie_prioridad: "Prioridad"}
			);
			res.render('project/pieces_index', {pieces: pieces, piece: piece, members: members, project: req.project, errors: []});
	})}).catch(function(error){next(error);})
};


// POST /project/:pro_url/pieces/create
exports.piece_create = function(req,res){

	// Sustituimos espacios por '-' y todo en minúscula. Quitamos acentos y carácteres raros.
	req.body.piece.pie_url = tools.getCleanedString(req.body.piece.pie_nombre);
	console.log(req.body.piece.pie_url);
	// Permite Seleccionar al user de la session sin hacer nada en el formulario
	var PieceUserId = req.body.piece.UserId != 0 ? req.body.piece.UserId : req.session.user.id;

	var piece = models.Piece.build({
				pie_nombre: req.body.piece.pie_nombre,
				pie_descripcion: req.body.piece.pie_descripcion,
				pie_url: req.body.piece.pie_url,
				pie_prioridad: req.body.piece.pie_prioridad,
				ProjectId: req.project.id,
				UserId: PieceUserId
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
		piece.pie_descripcion = req.body.piece.pie_descripcion;
		piece.pie_prioridad = req.body.piece.pie_prioridad;
		piece.pie_url = tools.getCleanedString(req.body.piece.pie_nombre);
		piece.validate().then(function(err){
			if (err) {
				res.render('project/pieces_index', {piece: piece, project: req.project, errors: err.errors});
			} else {
				// cambia en DB los campos pregunta y respuesta
				piece.save({fields: ["pie_nombre","pie_descripcion","pie_prioridad","pie_url"] }).then(function(){
				//models.Piece.update(piece).then(function(){
				res.redirect('/project/'+req.params.pro_url+'/pieces/'+piece.pie_url);
			})}
	})});
};

// DELETE /project/:pro_url/pieces/:pieceId
exports.piece_destroy = function(req,res){
	models.Piece.find({
		where:{ id: req.params.pieceId }
	}).then(function(piece){
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
					include: [{model: models.User, attributes: ['nombre']}]
				}).then(function(tasks){
					models.Problem.findAll({
							where: {
								PieceId: piece.id,
								prb_estado: 0
							},
						}).then(function(problems){
							models.Member.findAll({
								where:{
									ProjectId: req.project.id,
									mem_rol: {$lt: 3}
								},
								include: [{model: models.User, attributes: ['nombre']}]
							}).then(function(members){
								models.Note.findAll({
									where:{ PieceId: piece.id },
									include: [{model: models.User, attributes: ['nombre']}]
								}).then(function(notes){
									var task = models.Task.build( {tas_tarea: "Tarea", tas_todos:"Todos", PieceId: "PieceId"} );
									var note = models.Note.build( {not_nota: "Nota"} );
									var problem = models.Problem.build( {prb_problema: "Problema", prb_estado: "Estado", PieceId: "PieceId", ProjectId: "ProjectId"} )
									res.render('project/piece_main',{ piece: piece, session_user: req.session.user, project: req.project, task: task, tasks: tasks, members: members, note: note, notes: notes, problem: problem, problems: problems, errors: []});
		})})})})} else { next(new Error('No existe piece')); }
		}).catch(function(error){ next(error);} );
};

// POST /project/:pro_url/task/create
exports.task_create = function(req,res){

	// Permite Seleccionar al user de la session sin hacer nada en el formulario y en el caso Todod
	req.body.task.UserId = req.body.task.UserId != 0 ? req.body.task.UserId : req.session.user.id;

	// Crea la variable Todos con 0
	if (!req.body.task.tas_todos) {
		req.body.task.tas_todos = '0';
	}

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
		include: [{	model: models.Piece, attributes: ['pie_nombre','pie_url','ProjectId'],
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
		console.log(req.body.task);
		task.tas_tarea = req.body.task.tas_tarea;
		task.tas_estado = req.body.task.tas_estado;
		task.UserId = req.body.task.UserId != 0 ? req.body.task.UserId : task.UserId;
		if (!req.body.task.tas_todos) {
			task.tas_todos = '0';
		} else {
			task.tas_todos = '1';
		}
		task.validate().then(function(err){
			if (err) {
				res.render('project/pieces_index', {quiz: quiz, errors: err.errors});
			} else {
				// cambia en DB los campos pregunta y respuesta
				task.save({fields: ["tas_tarea","tas_estado","UserId","tas_todos"] }).then(function(){
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

// POST /project/:pro_url/note/:pie_url/create
exports.note_create = function(req,res){

	req.body.note.UserId = req.session.user.id;
	var note = models.Note.build(req.body.note);

	note.validate().then(function(err){
		if (err) {
			res.render('project/pieces_index', {piece: piece, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			note.save().then(function(){
			tools.autoLog(13, req.project.id, req.project.pro_url, req.session.user.id, req.params.pie_url);
			res.redirect('/project/'+req.params.pro_url+'/pieces/'+req.params.pie_url);})
		}
	});
}

// DELETE /project/:pro_url/notes/:noteId
exports.note_destroy = function(req,res){
	models.Note.find({
		where:{ id: req.params.noteId }
	}).then(function(note){
	 	note.destroy().then(function() {
			res.redirect('/project/'+req.params.pro_url+'/pieces/'+req.body.piece.pie_url);
		}).catch(function(error){next(error)});
})};

// GET /project/:pro_url/logs
exports.logs = function(req, res){
	// Muestra logs
	models.Log.findAll({
		where:{ ProjectId: req.project.id },
		order: [
			['createdAt', 'DESC']
		],
		include: [{model: models.User, attributes: ['nombre']}]
	}).then(function(logs){
		res.render('project/logs_index', {logs: logs, project: req.project, moment: moment, errors: []});
	}).catch(function(error){next(error);})
};

// POST /project/:pro_url/log/create
exports.log_create = function(req,res){
	var log = models.Log.build({
			log_entrada: req.body.log.log_entrada,
			log_tipo: 0,
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

// GET /project/:pro_url/problems
exports.problems = function(req, res){
	models.Problem.findAll({
		where:{ ProjectId: req.project.id },
		include: [{model: models.Piece, attributes: ['pie_nombre','pie_url']}]
	}).then(function(problems){
		res.render('project/problems_index', {problems: problems, project: req.project, errors: []});
	}).catch(function(error){next(error);})
};

// GET /project/:pro_url/problems/:problemId
exports.show_problem = function(req, res){
	models.Problem.find({
		where:{ ProjectId: req.project.id, id: req.params.problemId },
		include: [{model: models.Piece, attributes: ['pie_nombre','pie_url']}]
	}).then(function(problem){
		models.Answer.findAll({
			//where:{ ProblemId: req.params.problemId }, // TEST - Cascade para destroy
		}).then(function(answers){
			var answer = models.Answer.build( {ans_solucion: "Solución", ans_estado: "Estado", ProblemId: "ProblemId"} )
			res.render('project/problems_main', {problem: problem, answer: answer, answers: answers, project: req.project, errors: []});
	})}).catch(function(error){next(error);})
};

// POST /project/:pro_url/problem/:pie_url/create
exports.problem_create = function(req,res){

	var problem = models.Problem.build(req.body.problem);

	problem.validate().then(function(err){
		if (err) {
			res.render('project/pieces_index', {piece: piece, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			problem.save().then(function(problemId){
				// Guardamos log
				tools.autoLog(12, req.project.id, req.project.pro_url, req.session.user.id, problemId.id);
				res.redirect('/project/'+req.params.pro_url+'/pieces/'+req.params.pie_url);})
		}
	});
}

// PUT /project/:pro_url/problems/:problemId
exports.problem_update = function(req,res){
	models.Problem.find({
		where:{ id: req.params.problemId }
	}).then(function(problem){
		problem.prb_problema = req.body.problem.prb_problema;
		problem.prb_estado = req.body.problem.prb_estado;
		problem.validate().then(function(err){
			if (err) {
				res.render('project/pieces_index', {quiz: quiz, errors: err.errors});
			} else {
				// cambia en DB los campos pregunta y respuesta
				problem.save({fields: ["prb_problema","prb_estado"] }).then(function(){
				res.redirect('/project/'+req.params.pro_url+'/problems/'+req.params.problemId);
			});
		}
	})});
};

// DELETE /project/:pro_url/problems/:problemId
exports.problem_destroy = function(req,res){
	models.Problem.find({
		where:{ id: req.params.problemId }
	}).then(function(problem){
	 	problem.destroy().then(function() {
			res.redirect('/project/'+req.params.pro_url+'/problems/');
		}).catch(function(error){next(error)});
})};

// POST /project/:pro_url/problems/:problemId/answer/create
exports.answer_create = function(req,res){

	var answer = models.Answer.build(req.body.answer);

	answer.validate().then(function(err){
		if (err) {
			res.render('project/pieces_index', {piece: piece, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			answer.save().then(function(){
			res.redirect('/project/'+req.params.pro_url+'/problems/'+req.params.problemId);})
		}
	});
}

// PUT /project/:pro_url/problems/:problemId/answer/:answerId
exports.answer_update = function(req,res){
	models.Answer.find({
		where:{ id: req.params.answerId }
	}).then(function(answer){
		answer.ans_tarea = req.body.answer.ans_solucion;
		answer.ans_estado = req.body.answer.ans_estado;
		answer.validate().then(function(err){
			if (err) {
				res.render('project/pieces_index', {quiz: quiz, errors: err.errors});
			} else {
				// cambia en DB los campos pregunta y respuesta
				answer.save({fields: ["ans_solucion","ans_estado"] }).then(function(){
				res.redirect('/project/'+req.params.pro_url+'/problems/'+req.params.problemId);
			});
		}
	})});
};

// DELETE /project/:pro_url/problems/:problemId/answer/:answerId
exports.answer_destroy = function(req,res){
	models.Answer.find({
		where:{ id: req.params.answerId }
	}).then(function(answer){
	 	answer.destroy().then(function() {
			res.redirect('/project/'+req.params.pro_url+'/problems/'+req.params.problemId);
		}).catch(function(error){next(error)});
})};


// GET /project/:pro_url/polls
exports.polls = function(req, res){
	models.Poll.findAll({
		where:{ ProjectId: req.project.id },
	}).then(function(polls){
		var poll = models.Poll.build( {pol_pregunta: "Pregunta", pol_votos: "Votos", ProjectId: "ProjectId"} )
		res.render('project/polls_index', {polls: polls,poll: poll, project: req.project, errors: []});
	}).catch(function(error){next(error);})
};


// POST /project/:pro_url/polls/create
exports.poll_create = function(req,res){
	var poll = models.Poll.build(req.body.poll);
	poll.validate().then(function(err){
		if (err) {
			res.render('project/pieces_index', {piece: piece, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			poll.save().then(function(){
			res.redirect('/project/'+req.params.pro_url+'/polls/'+poll.id);})
		}
	});
}

// GET /project/:pro_url/polls/:pollId
exports.show_poll = function(req, res){
	models.Poll.findOne({
		where:{ id: req.params.pollId },
	}).then(function(poll){
		models.Option.findAll({
			where:{ Pollid: req.params.pollId },
		}).then(function(options){
			models.Vote.findOne({
				where:{ Pollid: req.params.pollId, UserId: req.session.user.id }
			}).then(function(votes){
				if (!votes){var votes = 0;}
				var vote = models.Vote.build( {vot_voto: "Voto", PollId: "PollId"} )
				var option = models.Option.build( {opt_respuesta: "Respuesta", opt_votos: "Votos", PollId: "PollId"} )
				res.render('project/polls_main', {poll: poll, option: option, options: options, vote: vote, votes: votes, project: req.project, errors: []});
	})})}).catch(function(error){next(error);})
};

// PUT /project/:pro_url/polls/:pollId
exports.poll_update = function(req,res){
	models.Poll.find({
		where:{ id: req.params.pollId }
	}).then(function(poll){
		poll.pol_pregunta = req.body.poll.pol_pregunta;
		poll.validate().then(function(err){
			if (err) {
				res.render('project/pieces_index', {quiz: quiz, errors: err.errors});
			} else {
				// cambia en DB los campos pregunta y respuesta
				poll.save({fields: ["pol_pregunta"] }).then(function(){
				res.redirect('/project/'+ req.params.pro_url+'/polls/'+ req.params.pollId);
			});
		}
	})});
};

// DELETE /project/:pro_url/polls/:pollId
exports.poll_destroy = function(req,res){
	models.Poll.find({
		where:{ id: req.params.pollId }
	}).then(function(poll){
	 	poll.destroy().then(function() {
			res.redirect('/project/'+req.params.pro_url+'/polls');
		}).catch(function(error){next(error)});
})};

// POST /project/:pro_url/polls/:pollId/option/create
exports.option_create = function(req,res){
	var option = models.Option.build(req.body.option);
	option.validate().then(function(err){
		if (err) {
			res.render('project/pieces_index', {piece: piece, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			option.save().then(function(){
			res.redirect('/project/'+ req.params.pro_url+'/polls/'+ req.params.pollId);})
		}
	});
}

// PUT /project/:pro_url/polls/:pollId/option/:optionId
exports.option_update = function(req,res){
	models.Option.find({
		where:{ id: req.params.optionId }
	}).then(function(option){
		option.opt_respuesta = req.body.option.opt_respuesta;
		option.opt_votos = req.body.option.opt_votos;
		option.validate().then(function(err){
			if (err) {
				res.render('project/pieces_index', {quiz: quiz, errors: err.errors});
			} else {
				// cambia en DB los campos pregunta y respuesta
				option.save({fields: ["ans_solucion","ans_estado"] }).then(function(){
				res.redirect('/project/'+ req.params.pro_url+'/polls/'+ req.params.pollId);
			});
		}
	})});
};

// DELETE /project/:pro_url/polls/:pollId/option/:optionId
exports.option_destroy = function(req,res){
	models.Option.find({
		where:{ id: req.params.optionId }
	}).then(function(option){
	 	option.destroy().then(function() {
			res.redirect('/project/'+req.params.pro_url+'/polls/'+req.params.pollId);
		}).catch(function(error){next(error)});
})};

// POST /project/:pro_url/polls/:pollId/vote/create
exports.vote_create = function(req,res){
	var vote = models.Vote.build(req.body.vote);
	vote.UserId = req.session.user.id;
	vote.validate().then(function(err){
		if (err) {
			res.render('project/pieces_index', {piece: piece, errors: err.errors});
		} else {
			sequelize.Promise.all([
		 		models.Option.findOne( {where: { id: req.body.vote.vot_voto }} ),
				models.Poll.findOne( {where: { id: req.body.vote.PollId }} )
			]).then(function(result){
				result[0].opt_votos = result[0].opt_votos + 1;
				result[1].pol_votos = result[1].pol_votos + 1;
				result[0].save({fields: ["opt_votos"] }).then(function(){
					result[1].save({fields: ["pol_votos"] }).then(function(){
						vote.save().then(function(){
							res.redirect('/project/'+ req.params.pro_url+'/polls/'+ req.params.pollId);
		})})})})}
	});
}

// PUT /project/:pro_url/polls/:pollId/vote/:voteId
exports.vote_update = function(req,res){
	sequelize.Promise.all([
		models.Vote.findOne( {where: { id: req.params.voteId }} ),
		models.Option.findOne( {where: { id: req.body.vote.vot_voto }} ),
		models.Option.findOne( {where: { id: req.body.vote.old_option }} )
	]).then(function(result){
			result[0].vot_voto = req.body.vote.vot_voto;
			result[1].opt_votos = result[1].opt_votos + 1;
			result[2].opt_votos = result[2].opt_votos - 1;
			result[1].save({fields: ["opt_votos"] }).then(function(){
				result[2].save({fields: ["opt_votos"] }).then(function(){
					result[0].save({fields: ["vot_voto"] }).then(function(){
						res.redirect('/project/'+ req.params.pro_url+'/polls/'+ req.params.pollId);
		})})})
	});
}


// GET /project/:pro_url/meetings
exports.meetings = function(req,res) {
	res.render('project/meetings_index', {project: req.project, user: req.session.user.username, errors: []});
}

// GET /project/:pro_url/events_table
exports.events_table = function(req, res){
	// Muestra Events
	models.Events.findAll({
		where:{	ProjectId: req.project.id,	},
		order: [ ['eve_date', 'ASC'] ],
	}).then(function(events){
		res.render('project/events_index', {events: events, project: req.project, moment: moment, errors: []});
	}).catch(function(error){next(error);})
};

// GET /project/:pro_url/events
exports.events = function(req,res) {
	models.Events.findAll({
		where:{
			ProjectId: req.project.id,
			eve_date: {gte: new Date()}
		},
		order: [ ['eve_date', 'DESC'] ],
	}).then(function(events){
		res.send(events);
	}).catch(function(error){next(error);})
}

// POST /project/:pro_url/events
exports.events_create = function(req,res) {
	var events = models.Events.build(
		{
			eve_evento: req.body.eve_evento,
			eve_tipo: req.body.eve_tipo,
			eve_date: req.body.eve_date,
			UserId:  req.session.user.id,
			ProjectId:  req.project.id
		});

	events.validate().then(function(err){
		if (err) {
			res.render('project/pieces_index', {piece: piece, errors: err.errors});
		} else {
			// guarda en DB
			events.save().then(function(){
				if(req.body.eve_table) {
					res.redirect('/project/'+ req.params.pro_url+'/events_table');
				}
			});
		}
	});
}

// PUT /project/:pro_url/events/:eventsId
exports.events_update = function(req,res){
	console.log('Events');
	console.log(req.params.eventsId);
	models.Events.find({
		where:{ id: req.params.eventsId }
	}).then(function(event){
		event.eve_evento = req.body.eve_evento;
		event.eve_tipo = req.body.eve_tipo;
		event.eve_date = req.body.eve_date;
		event.validate().then(function(err){
			if (err) {
				res.render('project/pieces_index', {quiz: quiz, errors: err.errors});
			} else {
				// cambia en DB los campos pregunta y respuesta
				event.save({fields: ["eve_evento","eve_tipo","eve_date"] }).then(function(){
					res.redirect('/project/'+ req.params.pro_url+'/events_table');
				});
			}
		})});
}

// DELETE /project/:pro_url/events/:eventsId
exports.events_destroy = function(req,res){
	console.log('Destroy');
	console.log(req.params.eventsId);
	models.Events.find({
		where:{ id: req.params.eventsId }
	}).then(function(events){
		console.log(events);
	 	events.destroy().then(function() {
			console.log('Destroy2');
			res.redirect('/project/'+ req.params.pro_url+'/events_table');
		}).catch(function(error){next(error)});
})};

// POST /project/:pro_url/suggestion/create
exports.suggestion_create = function(req,res){

	var suggestion = models.Suggestion.build({
			sug_sugerencia: req.body.sug_sugerencia,
			ProjectId: req.project.id,
			UserId: req.session.user.id
		});
	suggestion.validate().then(function(err){
		if (err) {
			res.render('project/members_index', {piece: piece, errors: err.errors});
		} else {
			// guarda en DB los campos
			suggestion.save().then(function(){
				res.send('Ok');})
		}
	});
};
