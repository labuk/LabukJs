// Definición del modelo Quiz

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Comment',
		{ com_texto:  {
			type: DataTypes.TEXT,
			validate: {notEmpty: {msg: "-> Falta Comentario"}}
		  }
		});
}
