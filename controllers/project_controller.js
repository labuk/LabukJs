// Importamos modelo DB
var models = require('../models/models.js');

// Cargamos Sequelize
var sequelize = require('sequelize');

// Autoload - Factoriza el código si la ruta incluye :pro_nombre
exports.load = function(req, res, next, projectId){
	models.Project.find({
		  where: { pro_nombre: Number(projectId) }
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
		{pro_nombre: "Nombre"}
	);

	res.render('project/new', {project: project, errors: []});
};

// GET /project/create
exports.create = function(req,res){
 	var project = models.Project.build( req.body.project);

	project.validate().then(function(err){
		if (err) {
			res.render('project/new', {project: project, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			project.save({fields: ["pro_nombre"]}).then(function(){
			res.redirect('/project');})
		}
	});
};

// GET /quizes/:quizid
exports.show_pro = function(req, res){
	res.render('project/project_main',{ project: req.project, errors: []});
};
