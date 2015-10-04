// Importamos modelo DB
var models = require('../models/models.js');

// Cargamos Sequelize
var sequelize = require('sequelize');

// Autoload - Factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find({
		  where: { id:Number(quizId) },
		  include: [{model: models.Comment}]
		}).then(function(quiz){
		if (quiz){
		req.quiz = quiz;
		next();
		} else { next(new Error('No existe quizId=' + quizId)); }
	}).catch(function(error){ next(error);} );	
};

// GET quizes 
exports.index = function(req, res){
	if(req.query.search){
		var search_string = req.query.search.replace(/ |\u0195|\xc3/g,'%');
		var search_string = '%'+search_string+'%';
		console.log('Search: '+search_string); 
		models.Quiz.findAll({where: ["pregunta like ?", search_string], order:'pregunta ASC'}).then(function(quizes){
			res.render('quizes/index',{ quizes: quizes, errors: []});
			console.log('Search results: '+quizes.length);

		})
	} else {
	models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index',{ quizes: quizes, errors: []});
	}).catch(function(error){next(error);})	}
};

// GET /quizes/:quizid
exports.show = function(req, res){
	res.render('quizes/show',{ quiz: req.quiz, errors: []});
};

// GET /quizes/:quizId/answer
exports.answer = function(req,res){
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/statictics
exports.statistics = function(req,res){
	console.log('Search and count');

	// Se utiliza Promise.all para realizar consultas asíncronas en paralelo
	var stats = {};
	sequelize.Promise.all([
  	   models.Quiz.count(),
	   models.Comment.count(),
	   models.Quiz.findAll({ include: [{model: models.Comment, required: true}] }),
	]).then(function(result){
		stats.quiz = result[0];
		stats.comment = result[1];
		stats.comment_quiz = result[1]/result[0];
		stats.withComment = result[2].length;
		stats.woutComment = result[0] - result[2].length;
		res.render('quizes/statistics',{ statictics: stats, errors: []});

	});
};

// GET /quizes/new
exports.new = function(req,res){
 	var quiz = models.Quiz.build(
		{pregunta: "Pregunta", respuesta: "Respuesta"}
	);

	res.render('quizes/new', {quiz: quiz, errors: []});
};

// GET /quizes/create
exports.create = function(req,res){
 	var quiz = models.Quiz.build( req.body.quiz);

	quiz.validate().then(function(err){
		if (err) {
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			quiz.save({fields: ["pregunta","respuesta","tematica"]}).then(function(){
			res.redirect('/quizes');})
		}
	});
};

// GET /quizes/:quizId/edit
exports.edit = function(req,res){
 	var quiz = req.quiz;
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:quizId
exports.update = function(req,res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tematica = req.body.quiz.tematica;

	req.quiz.validate().then(function(err){
		if (err) {
			res.render('quizes/edit', {quiz: quiz, errors: err.errors});
		} else {
			// cambia en DB los campos pregunta y respuesta
			req.quiz.save({fields: ["pregunta","respuesta","tematica"]}).then(function(){
			res.redirect('/quizes');})
		}
	});
};

// GET /quizes/:quizId/delete
exports.destroy = function(req,res){
 	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};

