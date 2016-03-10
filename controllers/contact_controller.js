// Importamos modelo DB
var models = require('../models/models.js');

// Cargamos Moments
var moment = require('moment');

// GET /contact
exports.index = function(req, res){
	models.Contact.findAll(
		{where: {con_contact: req.session.user.id},
		include: [{model: models.User, attributes: ['nombre']}]
	}).then(function(contacts){
		res.render('contact/index',{contacts: contacts, errors: []});
	}).catch(function(error){next(error);})
};

// POST /contact/create
exports.create = function(req,res){

	var contact = models.Contact.build(
		{ con_contact: req.session.user.id,
			con_block: 0,
			UserId: req.body.contact.UserId
		});

	var contact_bis  = models.Contact.build(
		{ con_contact: req.body.contact.UserId,
			con_block: 1,
			UserId: req.session.user.id
		});

	contact.validate().then(function(err){
		if (err) {
			res.render('project/new', {project: project, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta
			contact.save().then(function(){
			contact_bis.save();
			res.redirect('/user/profile/'+req.body.contact.UserId);
		})}
	});
};

// POST /contact/update_allow
exports.update_allow = function(req,res){

	models.Contact.find({
		where:{ id: req.body.contact.id }
	}).then(function(contact){
		contact.con_block = 2;
		models.Contact.find({
			where:{ con_contact: req.body.contact.UserId, UserId: req.session.user.id }
		}).then(function(contact_bis){
			contact_bis.con_block = 2;
			contact.validate().then(function(err){
				if (err) {
					res.render('project/new', {project: project, errors: err.errors});
				} else {
					// guarda en DB los campos pregunta y respuesta
					contact.save({fields: ["con_block"] }).then(function(){
						contact_bis.save({fields: ["con_block"] });
						res.redirect('/user/profile/'+req.body.contact.UserId);
				})}
			})})});
};
