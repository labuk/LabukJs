// Importamos modelo DB
var models = require('../models/models.js');

// GET /services
exports.index = function(req, res){
  console.log('Services');
	res.render('services/index',{ errors: []});
};
