var express = require('express');
var router = express.Router();

var userController = require('../controllers/user_controller');
var sessionController = require('../controllers/session_controller');
var projectController = require('../controllers/project_controller');
var blogController = require('../controllers/blog_controller');

// GET home page
router.get('/', function(req, res) {
  res.render('index', { title: 'Labuk' , errors: []});
});

// Autoload de comandos
router.param('pro_url', projectController.load); //Si existe parametro pro_url hace el autoload

// Definición de rutas de usuario
router.get('/user', userController.index); // lista de usuarios
router.get('/user/new', userController.new); // formulario nuevo usuario
router.post('/user/create', userController.create); // crear usuario
router.get('/user/myprofile', userController.myprofile); // crear usuario

// Definicion de rutas de session
router.get('/login', sessionController.new); // formulario login
router.post('/login', sessionController.create); // crear session
router.get('/logout', sessionController.destroy); // destruir session - lo ideal sería utilizar delete

//Definición de rutas de Project
router.get('/project', projectController.index); // lista de proyectos
router.get('/project/new', sessionController.loginRequired,projectController.new); // formulario nuevo proyecto
router.post('/project/create', sessionController.loginRequired,projectController.create); // crear proyecto
router.get('/project/:pro_url', sessionController.loginRequired, sessionController.memberRequired, projectController.show_pro); // index proyecto :pro_url
router.get('/project/:pro_url/front', sessionController.loginRequired, projectController.show_front); // portada proyecto :pro_url
router.get('/project/:pro_url/manage', sessionController.loginRequired, sessionController.memberRequired, projectController.manage); // index modificar proyecto
router.put('/project/:pro_url/update', sessionController.loginRequired, sessionController.memberRequired, projectController.project_update); //editar proyecto
router.get('/project/:pro_url/members', sessionController.loginRequired, sessionController.memberRequired, projectController.members); // index miembros del proyecto
router.post('/project/:pro_url/members/create', sessionController.loginRequired, sessionController.memberRequired, projectController.members_create); // crear miembro
router.get('/project/:pro_url/pieces', sessionController.loginRequired, sessionController.memberRequired, projectController.pieces); // index piezas del proyecto
router.post('/project/:pro_url/pieces/create', sessionController.loginRequired, sessionController.memberRequired, projectController.piece_create); // crear piece
router.put('/project/:pro_url/pieces/:pieceId(\\d+)', sessionController.loginRequired, sessionController.memberRequired, projectController.piece_update); //editar piece
router.delete('/project/:pro_url/pieces/:pieceId(\\d+)', sessionController.loginRequired, sessionController.memberRequired, projectController.piece_destroy); //borrar piece
router.get('/project/:pro_url/pieces/:pie_url', sessionController.loginRequired, sessionController.memberRequired, projectController.show_pie); // index piece :pie_url
router.post('/project/:pro_url/tasks/:pie_url/create', sessionController.loginRequired,sessionController.memberRequired, projectController.task_create); // crear tarea
router.get('/project/:pro_url/tasks', sessionController.loginRequired, sessionController.memberRequired, projectController.tasks); // index tablón tareas
router.put('/project/:pro_url/tasks/:taskId(\\d+)', sessionController.loginRequired, sessionController.memberRequired, projectController.task_update); //editar tarea
router.delete('/project/:pro_url/tasks/:taskId(\\d+)', sessionController.loginRequired, sessionController.memberRequired, projectController.task_destroy); //borrar tarea
router.get('/project/:pro_url/logs', sessionController.loginRequired, sessionController.memberRequired, projectController.logs); // index log
router.post('/project/:pro_url/logs/create', sessionController.loginRequired, sessionController.memberRequired, projectController.log_create); // crear log
router.get('/project/:pro_url/ideas', sessionController.loginRequired, sessionController.memberRequired, projectController.ideas); // index ideas
router.post('/project/:pro_url/ideas/create', sessionController.loginRequired, sessionController.memberRequired, projectController.idea_create); // crear idea
router.get('/project/:pro_url/board', sessionController.loginRequired,sessionController.memberRequired, projectController.board); // index tablón
router.get('/project/:pro_url/problems', sessionController.loginRequired, sessionController.memberRequired, projectController.problems); // index problem
router.get('/project/:pro_url/problems/:problemId(\\d+)', sessionController.loginRequired, sessionController.memberRequired, projectController.show_problem); // index problem :problemId
router.post('/project/:pro_url/problems/:pie_url/create', sessionController.loginRequired, sessionController.memberRequired, projectController.problem_create); // crear problem
router.delete('/project/:pro_url/problems/:problemId(\\d+)', sessionController.loginRequired, sessionController.memberRequired, projectController.problem_destroy); //borrar problem
router.post('/project/:pro_url/problems/:problemId(\\d+)/answer/create', sessionController.loginRequired, sessionController.memberRequired, projectController.answer_create); // crear answer
router.put('/project/:pro_url/problems/:problemId(\\d+)/answer/:answerId(\\d+)', sessionController.loginRequired, sessionController.memberRequired, projectController.answer_update); //editar answer
router.delete('/project/:pro_url/problems/:problemId(\\d+)/answer/:answerId(\\d+)', sessionController.loginRequired, sessionController.memberRequired, projectController.answer_destroy); //borrar answer
router.get('/project/:pro_url/polls', sessionController.loginRequired, sessionController.memberRequired, projectController.polls); // index polls
router.post('/project/:pro_url/polls/create', sessionController.loginRequired, sessionController.memberRequired, projectController.poll_create); // crear poll
router.get('/project/:pro_url/polls/:pollId(\\d+)', sessionController.loginRequired, sessionController.memberRequired, projectController.show_poll); // index poll :pollId
router.post('/project/:pro_url/polls/:pollId(\\d+)/option/create', sessionController.loginRequired, sessionController.memberRequired, projectController.option_create); // crear option
router.put('/project/:pro_url/polls/:pollId(\\d+)/option/:optionId', sessionController.loginRequired, sessionController.memberRequired, projectController.option_update); //editar tarea
router.post('/project/:pro_url/polls/:pollId(\\d+)/vote/create', sessionController.loginRequired, sessionController.memberRequired, projectController.vote_create); // crear vote
router.put('/project/:pro_url/polls/:pollId(\\d+)/vote/:voteId', sessionController.loginRequired, sessionController.memberRequired, projectController.vote_update); //editar vote


// Definición de rutas de Blog
router.post('/project/:pro_url/posts/create', sessionController.loginRequired, sessionController.memberRequired, blogController.post_create); // crear idea
router.get('/project/:pro_url/posts/:pos_url', sessionController.loginRequired, sessionController.memberRequired, blogController.show_post); // crear idea
router.post('/project/:pro_url/comments/:pos_url/create', sessionController.loginRequired, sessionController.memberRequired, blogController.comment_create); // crear idea

// GET author page
router.get('/author', function(req, res){
  res.render('author', {errors: []});
});

module.exports = router;
