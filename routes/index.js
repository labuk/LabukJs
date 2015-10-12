var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var userController = require('../controllers/user_controller');
var sessionController = require('../controllers/session_controller');
var projectController = require('../controllers/project_controller');


// GET home page
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' , errors: []});
});

// Autoload de comandos
router.param('quizId', quizController.load); //Si existe parametro quizId hace el autoload
router.param('commentId', commentController.load); //Si existe parametro commentId hace el autoload
router.param('pro_url', projectController.load); //Si existe parametro pro_url hace el autoload

// Definicion de rutas /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', sessionController.loginRequired, quizController.new); //new quiz
router.post('/quizes/create', sessionController.loginRequired, quizController.create); //post quiz
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit); //edit quiz
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update); //put quiz
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy); //delete quiz
router.get('/quizes/statistics', quizController.statistics);

// Definicion de rutas /comment
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired,commentController.publish);
	// debería ser pur ya que actualizamos los datos al hacer publish

// Definición de rutas de usuario
router.get('/user', userController.index); // lista de usuarios
router.get('/user/new', userController.new); // formulario nuevo usuario
router.post('/user/create', userController.create); // crear usuario

// Definicion de rutas de session
router.get('/login', sessionController.new); // formulario login
router.post('/login', sessionController.create); // crear session
router.get('/logout', sessionController.destroy); // destruir session - lo ideal sería utilizar delete

//Definición de rutas de Project
router.get('/project', projectController.index); // lista de proyectos
router.get('/project/new', sessionController.loginRequired,projectController.new); // formulario nuevo proyecto
router.post('/project/create', sessionController.loginRequired,projectController.create); // crear proyecto
router.get('/project/:pro_url', sessionController.loginRequired,projectController.show_pro); // index proyecto :pro_url
router.get('/project/:pro_url/pieces', sessionController.loginRequired,projectController.pieces); // index piezas del proyecto
router.post('/project/:pro_url/pieces/create', sessionController.loginRequired,projectController.piece_create); // crear piece
router.put('/project/:pro_url/pieces/:pieceId(\\d+)', sessionController.loginRequired, projectController.piece_update); //editar piece
router.delete('/project/:pro_url/pieces/:pieceId(\\d+)', sessionController.loginRequired, projectController.piece_destroy); //editar piece
router.get('/project/:pro_url/pieces/:pie_url', sessionController.loginRequired,projectController.show_pie); // index proyecto :pro_url
router.post('/project/:pro_url/tasks/:pie_url/create', sessionController.loginRequired,projectController.task_create); // crear tarea

// GET author page
router.get('/author', function(req, res){
  res.render('author', {errors: []});
});

module.exports = router;
