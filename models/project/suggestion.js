// Definición del modelo Logs

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Suggestion',
		{ sug_sugerencia:  {
				type: DataTypes.TEXT,
				validate: {notEmpty: {msg: "-> Falta Sugerencia"}}
			}
		});
}
