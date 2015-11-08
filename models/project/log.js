// Definición del modelo Logs

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Log',
		{ log_entrada:  {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta Log"}}
			}
		});
}
