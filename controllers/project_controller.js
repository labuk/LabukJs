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
					models.Problem.findAll({
							where: { PieceId: piece.id },
						}).then(function(problems){
							var task = models.Task.build( {tas_tarea: "Tarea", PieceId: "PieceId"} );
							var problem = models.Problem.build( {prb_problema: "Problema", prb_estado: "Estado", PieceId: "PieceId", ProjectId: "ProjectId"} )
							res.render('project/piece_main',{ piece: piece, project: req.project, task: task, tasks: tasks, problem: problem, problems: problems, errors: []});
		})})} else { next(new Error('No existe piece ')); }
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

// GET /project/:pro_url/problems
exports.problems = function(req, res){
	models.Problem.findAll({
		where:{ ProjectId: req.project.id },
	}).then(function(problems){
		res.render('project/problems_index', {problems: problems, project: req.project, errors: []});
	}).catch(function(error){next(error);})
};

// GET /project/:pro_url/problems/:problemId
exports.show_problem = function(req, res){
	models.Problem.find({
		where:{ ProjectId: req.project.id, id: req.params.problemId },
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
			problem.save().then(function(){
			res.redirect('/project/'+req.params.pro_url+'/pieces/'+req.params.pie_url);})
		}
	});
}

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
	console.log(req.params.voteId);
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
