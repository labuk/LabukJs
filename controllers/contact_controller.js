// Importamos modelo DB
var models = require('../models/models.js');

// Cargamos Moments
var moment = require('moment');

// GET /contact
exports.index = function(req, res){
	models.Contact.findAll(
		{where: {con_contact: req.session.user.id},
		include: [{model: models.User, attributes: ['nombre','online','avatar']}]
	}).then(function(contacts){
		res.render('contact/index',{contacts: contacts, errors: []});
	}).catch(function(error){next(error);})
};

// GET /contact_new
exports.count_new = function(req, res){
	models.Contact.count(
		{where: {
			con_contact: req.session.user.id,
			con_block: 1
		}
	}).then(function(contacts){
		if (contacts) {
			res.send('Ok');
		} else {
			res.send('undefined');
		}
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
			if (req.body.contact.UserId > req.session.user.id) {
				contact_bis.con_message = contact.id;
				contact.con_message = contact.id;
			} else {
				contact_bis.con_message = contact_bis.id;
				contact.con_message = contact_bis.id;
			}
			contact.validate().then(function(err){
				if (err) {
					res.render('project/new', {project: project, errors: err.errors});
				} else {
					// guarda en DB los campos pregunta y respuesta
					contact.save({fields: ["con_block","con_message"] }).then(function(){
						contact_bis.save({fields: ["con_block","con_message"] });
						res.redirect('/user/profile/'+req.body.contact.UserId);
				})}
			})})});
};

// POST /contact/update_block
exports.update_block = function(req,res){
	models.Contact.find({
		where:{ id: req.body.contact.id }
	}).then(function(contact){
		contact.con_block = 4;
		models.Contact.find({
			where:{ con_contact: req.body.contact.UserId, UserId: req.session.user.id }
		}).then(function(contact_bis){
			contact_bis.con_block = 3;
			if (req.body.contact.UserId > req.session.user.id) {
				contact_bis.con_message = contact.id;
				contact.con_message = contact.id;
			} else {
				contact_bis.con_message = contact_bis.id;
				contact.con_message = contact_bis.id;
			}
			contact.validate().then(function(err){
				if (err) {
					res.render('project/new', {project: project, errors: err.errors});
				} else {
					// guarda en DB los campos pregunta y respuesta
					contact.save({fields: ["con_block","con_message"] }).then(function(){
						contact_bis.save({fields: ["con_block","con_message"] });
						res.redirect('/contact');
				})}
			})})});
};

// GET /contact/message
exports.index_message = function(req, res){
	models.Message.findAll(
		{where: {mes_recivier: req.session.user.id},
		include: [{model: models.User, attributes: ['nombre']}],
		limit: 20,
		order: [['createdAt' , 'DESC']]
	}).then(function(messages){
		models.Contact.findAll(
			{where: {con_contact: req.session.user.id},
			include: [{model: models.User, attributes: ['nombre']}]
		}).then(function(contacts){
			res.render('contact/message',{messages: messages, contacts: contacts, moment: moment, errors: []});
	})}).catch(function(error){next(error);});
};

// GET /contact/message/send
exports.index_send = function(req, res){
	models.Message.findAll(
		{where: {UserId: req.session.user.id},
		limit: 20,
		order: [['createdAt' , 'DESC']]
	}).then(function(messages){
		models.Contact.findAll(
			{where: {con_contact: req.session.user.id},
			include: [{model: models.User, attributes: ['nombre']}]
		}).then(function(contacts){
			var name = {};
			for (i=0; i < messages.length; i++){
				for (j=0; j < contacts.length; j++){
					if(messages[i].mes_recivier == contacts[j].UserId) name[i]=contacts[j].User.nombre;
				}
			}
			res.render('contact/send',{messages: messages, name:name, contacts: contacts, moment: moment, errors: []});
	})}).catch(function(error){next(error);});
};

// POST /contact/message/create
exports.create_message = function(req, res){
	models.Contact.find(
		{where: {con_contact: req.body.contact1, UserId: req.session.user.id},
		include: [{model: models.User, attributes: ['nombre']}]
	}).then(function(contact){
		console.log(contact);
		console.log(req.body);
		var message = models.Message.build(
			{ mes_message: req.body.message,
				mes_topic: req.body.topic || "Sin asunto",
				mes_read: 0,
				mes_recivier: req.body.contact1,
				contactId: contact.con_message,
				UserId: req.session.user.id
			});
			message.validate().then(function(err){
				if (err) {
					res.render('error', {errors: err.errors});
				} else {
					// guarda en DB los campos pregunta y respuesta
					message.save().then(function(){
						res.send('Terminado');
				})};
			});
	}).catch(function(error){next(error);});
};

// POST /contact/message/read
exports.read_message = function(req, res){
	models.Message.find(
		{where: {id: req.body.id}
	}).then(function(message){
		message.mes_read = '1';
		message.validate().then(function(err){
			if (err) {
				res.render('error', {errors: err.errors});
			} else {
				// guarda en DB los campos mes_read
				message.save({fields: ["mes_read"]}).then(function(){
					res.send('Terminado');
			})};
		});
	}).catch(function(error){next(error);});
};

// GET /contact/chat/UserId
exports.index_chat = function(req, res){
	models.Contact.find(
		{where: {con_contact: req.session.user.id, UserId: req.params.userId},
		include: [{model: models.User, attributes: ['nombre']}]
	}).then(function(contact){
		models.Message.findAll(
			{where: {contactId: contact.con_message},
			include: [{model: models.User, attributes: ['nombre']}],
			limit: 20,
			order: [['updatedAt' , 'DESC']]
		}).then(function(messages){
			res.render('contact/chat',{contact: contact, messages: messages, errors: []});
	})}).catch(function(error){next(error);});
};
