// Definición del modelo Project

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Project',
		{ pro_nombre:  {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta Nombre"}}
			},
			pro_url:  {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta url"}}
			}
		});
}
