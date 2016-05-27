// Definición del modelo Project

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Project',
		{ pro_nombre:  {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta Nombre"}}
			},
			pro_eslogan:  {
				type: DataTypes.STRING
			},
			pro_descripcion:  {
				type: DataTypes.STRING
			},
			pro_tipo:  {
				type: DataTypes.INTEGER,
				validate: {notEmpty: {msg: "-> Falta Tipo"}}
			},
			pro_url:  {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta url"}}
			},
			pro_portada:  {
				type: DataTypes.INTEGER
			},
			pro_logo:  {
				type: DataTypes.STRING
			}
		});
}
