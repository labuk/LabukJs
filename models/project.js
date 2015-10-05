// Definición del modelo Quiz

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Project',
		{ pro_nombre:  {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta Nombre"}}
		  }
		});
}
