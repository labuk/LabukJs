// Definición del modelo Pieces

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Note',
		{ not_nota:  {
				type: DataTypes.TEXT,
				validate: {notEmpty: {msg: "-> Falta Nota"}}
			}
		});
}
